"use strict";

const bunyan = require("bunyan");
const bunyanLogstash = require("bunyan-logstash");

exports = module.exports = function (config) {
    let streams = [];
    const env = process.env.NODE_ENV || "production";
    const envLogLevel = process.env.ENV_LOG_LEVEL || "warn";
    const debug = process.env.DEBUG_ENV || false;

    if (env === "development" || debug) {
        streams.push({
            level: envLogLevel,
            stream: process.stdout
        });
    }

    if (config.files.enable) {
        streams.push({
            type: "file",
            path: `${config.files.path}/${config.files.name}.log`,
            level: config.files.level
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

    return bunyan.createLogger({
        name: config.name,
        src: true,
        streams: streams
    });
};
