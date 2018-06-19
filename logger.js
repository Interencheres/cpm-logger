"use strict";

const bunyan = require("bunyan");
const bunyanLogstash = require("bunyan-logstash");
const morgan = require("morgan");
const fs = require("fs");

const env = process.env.NODE_ENV || "production";
const envLogLevel = process.env.ENV_LOG_LEVEL || "warn";
const debug = process.env.DEBUG_ENV || false;

const headersToLog = ["x-cpm-request-id", "x-cpm-device-id"];

/**
 * Edit default bunyan file stream to insert @timestamp to please kibana
 *
 * @param  {Object} config Log section of config
 *
 * @return {function}      Write function to be used by bunyan
 */
function modifiedStream (config) {
    const writableStream = fs.createWriteStream(
        `${config.files.path}/${config.files.name}.log`,
        { flags: "a", encoding: "utf8" }
    );
    return {
        write: incomingLogLine => {
            const outgoingLogLine = Object.assign(
                JSON.parse(incomingLogLine),
                { "@timestamp": new Date().toISOString() }
            );
            writableStream.write(`${JSON.stringify(outgoingLogLine, bunyan.safeCycles())}\n`);
        }
    };
}

/**
 * Generate Morgan middleware to create access.log styled logs
 * @param  {Object} config Logs entry from config file
 * @param  {Object} logger Bunyan logger
 *
 * @return {Object}        Middleware morgan
 */
function initMorganLogger (logger) {
    let logFormat = ":method :url :status :response-time ms :req[x-cpm-request-id] :req[x-cpm-device-id]";

    /* istanbul ignore next */
    /*jshint ignore:start*/
    if (env === "production") {
        logFormat = JSON.stringify({
            request_method: ":method",
            response_status: ":status",
            request_url: ":url",
            "x-cpm-request-id": ":req[x-cpm-request-id]",
            "x-cpm-device-id": ":req[x-cpm-device-id]",
            request_time: ":response-time",
            msg: ":method :url :status :response-time"
        });
    }
    /*jshint ignore:end*/

    const stream = {
        write: function (message) {
            /* istanbul ignore next */
            if (env === "production") {
                message = JSON.parse(message);
                // We mark requests logs for kibana
                message.source = "router";

                logger.info(message, message.msg);
            } else {
                logger.info(message);
            }
        }
    };

    return morgan(logFormat, { stream: stream });
}

/**
 * Generate middleware to attach bunyan logger to req object
 * @param  {Object} logger Bunyan logger to attach
 *
 * @return {Object}        Middleware
 */
function attachToReq (logger) {
    return (req, res, next) => {
        let headers = {};
        headersToLog.forEach(headerName => {
            const header = req.headers[headerName];
            if (!header) {
                logger.warn(`Request on ${req.originalUrl} has no '${headerName}' header`);
            } else {
                headers[headerName] = header;
            }
        });

        req.logger = logger.child(headers);

        next();
    };
}

/**
 * Create the bunyan logger according to config file
 *
 * @param  {Object} config Logs entry from config file
 *
 * @return {Object}        Returns the bunyan logger, and both middlewares
 */
function init (config) {
    let streams = [];

    if (env === "development" || debug) {
        streams.push({
            level: envLogLevel,
            stream: process.stdout
        });
    }

    if (config.files.enable) {
        streams.push({
            level: config.files.level,
            stream: modifiedStream(config)
        });
    }

    if (config.logstash.enable) {
        streams.push({
            type: "raw",
            stream: bunyanLogstash.createStream({
                application: config.logstash.name,
                host: config.logstash.host,
                port: config.logstash.port,
                level: config.logstash.level,
                tags: [
                    config.logstash.name
                ]
            })
        });
    }

    const logger = bunyan.createLogger({
        name: config.name,
        src: true,
        streams: streams
    });

    const apiLogger = logger.child({
        /*jshint ignore:start*/
        message_type: "api"
        /*jshint ignore:end*/
    });
    const morganLogger = logger.child({
        /*jshint ignore:start*/
        message_type: "access"
        /*jshint ignore:end*/
    });

    return {
        logger: apiLogger,
        loggerMiddleware: attachToReq(apiLogger),
        morganMiddleware: initMorganLogger(morganLogger)
    };

}
module.exports.init = init;
