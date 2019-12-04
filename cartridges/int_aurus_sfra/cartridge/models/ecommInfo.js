'use strict';

/**
* @constructor
* @classdesc ECOMMInfo object for preAuth call
* @param {Object} ecommInfo ecommInfo from request body
*/
function ECOMMInfo(ecommInfo) {
    this.StoreId = ecommInfo.storeId;
    this.OneTimeToken = ecommInfo.oneTimeToken.value;
    this.MerchantIdentifier = ecommInfo.merchantId;
    this.TerminalId = ecommInfo.terminalId;
    this.CardIdentifier = ecommInfo.cardId;
    this.OneOrderToken = ecommInfo.oneOrderToken;
}

module.exports = ECOMMInfo;
