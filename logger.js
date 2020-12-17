"use strict";

const bunyan = require("bunyan");
const morgan = require("morgan");
const fs = require("fs");

const env = process.env.NODE_ENV || "production";
const envLogConsole = process.env.ENV_LOG_CONSOLE === "true";
const envLogLevel = process.env.ENV_LOG_LEVEL || "warn";
const envLogDisableStatus = process.env.ENV_LOG_DISABLE_STATUS || false;
const debug = process.env.DEBUG_ENV || false;

const statusRouteRegex = RegExp(/\/v[0-9]+\/status/i);
let headersToLog = ["x-cpm-request-id", "x-cpm-device-id"];

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
    let headersLogFormat = headersToLog.reduce((header, acc) => {
        return `${acc} :req[${header}]`;
    });
    let logFormat = `:method :url :status :response-time ms${headersLogFormat}`;

    if (env === "production") {
        logFormat = {
            request_method: ":method",
            response_status: ":status",
            request_url: ":url",
            request_time: ":response-time",
            msg: ":method :url :status :response-time"
        };

        headersToLog.forEach(header => {
            logFormat[header] = `:req[${header}]`;
        });

        logFormat = JSON.stringify(logFormat);
    }

    const stream = {
        write: function (message) {
            /* istanbul ignore next */
            if (env === "production") {
                message = JSON.parse(message);
                // We mark requests logs for kibana
                message.source = "router";

                logger.debug(message, message.msg);
            } else {
                logger.info(message);
            }
        }
    };

    return morgan(logFormat, { stream: stream, skip: function (req) {
        return envLogDisableStatus ? statusRouteRegex.test(req.originalUrl) : false;
    }
    });
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
        // Ignore missing headers on /v1/status
        if (!statusRouteRegex.test(req.originalUrl)) {
            headersToLog.forEach(headerName => {
                const header = req.headers[headerName];
                if (!header) {
                    logger.debug(`Request on ${req.originalUrl} has no '${headerName}' header`);
                } else {
                    headers[headerName] = header;
                }
            });
        }
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

    if (config.headersToLog) {
        headersToLog = config.headersToLog;
    }

    if (envLogConsole || env === "development" || debug) {
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

    const logger = bunyan.createLogger({
        name: config.name,
        src: env !== "production",
        streams: streams
    });

    const apiLogger = logger.child({
        message_type: "api"
    });
    const morganLogger = logger.child({
        message_type: "access"
    });

    return {
        logger: apiLogger,
        loggerMiddleware: attachToReq(apiLogger),
        morganMiddleware: initMorganLogger(morganLogger)
    };

}
module.exports.init = init;
