'use strict';

var server = require('server');
var aurusPaySvc = require('*/cartridge/scripts/services/aurusPayServices');
var aurusPayHelper = require('*/cartridge/scripts/util/aurusPayHelper');
var Logger = require('dw/system/Logger');

server.get('GetSession', server.middleware.https, function (req, res, next) {
    var session;
    try {
        var uuid = request.httpParameterMap.ccId.stringValue; // eslint-disable-line
        var isPayPal = request.httpParameterMap.paypal.stringValue; // eslint-disable-line
        var reqBody = isPayPal === 'true' ? aurusPayHelper.getPayPalReqBody() : aurusPayHelper.getSessionReqBody(req, uuid);
        session = aurusPaySvc.getSessionService().call(reqBody);
    } catch (error) {
        Logger.info('ERROR: Error while executing aurusPayServices.js script.', error);
    }

    if (session.ok) {
        session = session.object.text;
    } else {
        session = null;
    }

    res.json({
        session: session
    });

    return next();
});

server.get('GetBillerToken', server.middleware.https, function (req, res, next) {
    var session;
    try {
        var uuid = request; // eslint-disable-line
        var reqBody = aurusPayHelper.getPayPalTokenReqBody(req, uuid);
        session = aurusPaySvc.getBillingToken().call(reqBody);
    } catch (error) {
        Logger.info('ERROR: Error while executing aurusPayServices.js script.', error);
    }

    if (session.ok) {
        session = session.object.text;
    } else {
        session = null;
    }

    res.json({
        session: session
    });

    return next();
});

module.exports = server.exports();
