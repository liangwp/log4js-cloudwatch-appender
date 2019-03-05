'use strict';

const lawgs = require('lawgs');

function awsAppender(accessKeyId, secretAccessKey, region, logGroup, logGroupRetention, logStream, layout, timezoneOffset, lawgsConfig) {
    lawgs.config({
        aws: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: region
        }
    });
    const logger = lawgs.getOrCreate(logGroup, logGroupRetention);
    if (lawgsConfig) {
        logger.config(lawgsConfig);
    }
    var appender_fn = function (loggingEvent) {
        logger.log(logStream, layout(loggingEvent, timezoneOffset));
    };
    appender_fn.shutdown = cb => {
        logger.dispose();
        cb();
    };
    return appender_fn
}

function configure(config, layouts) {
    let layout = layouts.basicLayout;
    if (config.layout) {
        layout = layouts.layout(config.layout.type, config.layout);
    }

    return awsAppender(
        config.accessKeyId,
        config.secretAccessKey,
        config.region,
        config.logGroup,
        config.logGroupRetention,
        config.logStream,
        layout,
        config.timezoneOffset,
        config.lawgsConfig
    );
}

module.exports.configure = configure;
