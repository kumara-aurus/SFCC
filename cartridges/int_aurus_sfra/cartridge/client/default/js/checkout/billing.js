'use strict';

var base = require('base/checkout/billing');
var addressHelpers = require('base/checkout/address');

// Custom Aurus client side code
var aurusCheckout = require('../aurusCheckout');

/**
* Handles credit card number validation
* Overriding base cartrisge validation as there are no credit card numbers to process
* because form is an external iFrame
* @returns {number} returns zero
*/
base.handleCreditCardNumber = function () {
    return 0;
};

/**
* Attaches click event to add payment button
* Renders new iFrame session for new card submission
*/
base.addNewPaymentInstrument = function () {
    $('.btn.add-payment').on('click', function (e) {
        e.preventDefault();
        aurusCheckout.methods.getAurusSession('newCard');
        $('.cancel-new-payment').removeClass('checkout-hidden');
        $('.save-credit-card').removeClass('checkout-hidden');
        $('.stored-payments').addClass('checkout-hidden');
        $(this).addClass('checkout-hidden');
    });
};

/**
* Attaches click event to cancel new payment button
* Renders saved card form into iFrame from Aurus
*/
base.cancelNewPayment = function () {
    $('.cancel-new-payment').on('click', function (e) {
        e.preventDefault();
        aurusCheckout.methods.getAurusSession();
        $('.btn.add-payment').removeClass('checkout-hidden');
        $('.stored-payments').removeClass('checkout-hidden');
        $('.save-credit-card').addClass('checkout-hidden');
        $(this).addClass('checkout-hidden');
    });
};

/**
* updates the billing address form values within payment forms
* @param {Object} order - the order model
*/
function updateBillingAddressFormValues(order) {
    var billing = order.billing;
    if (!billing.billingAddress || !billing.billingAddress.address) return;

    var form = $('form[name=dwfrm_billing]');
    if (!form) return;

    $('input[name$=_firstName]', form).val(billing.billingAddress.address.firstName);
    $('input[name$=_lastName]', form).val(billing.billingAddress.address.lastName);
    $('input[name$=_address1]', form).val(billing.billingAddress.address.address1);
    $('input[name$=_address2]', form).val(billing.billingAddress.address.address2);
    $('input[name$=_city]', form).val(billing.billingAddress.address.city);
    $('input[name$=_postalCode]', form).val(billing.billingAddress.address.postalCode);
    $('select[name$=_stateCode],input[name$=_stateCode]', form)
        .val(billing.billingAddress.address.stateCode);
    $('select[name$=_country]', form).val(billing.billingAddress.address.countryCode.value);
    $('input[name$=_phone]', form).val(billing.billingAddress.address.phone);
    $('input[name$=_email]', form).val(order.orderEmail);

    if (billing.payment && billing.payment.selectedPaymentInstruments
        && billing.payment.selectedPaymentInstruments.length > 0) {
        var instrument = billing.payment.selectedPaymentInstruments[0];
        $('select[name$=expirationMonth]', form).val(instrument.expirationMonth);
        $('select[name$=expirationYear]', form).val(instrument.expirationYear);
        // Force security code and card number clear
        $('input[name$=securityCode]', form).val('');
        // $('input[name$=cardNumber]').data('cleave').setRawValue('');
    }
}

base.methods.updateBillingInformation = function (order, customer) {
    base.methods.updateBillingAddressSelector(order, customer);

    // update billing address form
    updateBillingAddressFormValues(order);

    // update billing address summary
    addressHelpers.methods.populateAddressSummary('.billing .address-summary',
        order.billing.billingAddress.address);

    // update billing parts of order summary
    $('.order-summary-email').text(order.orderEmail);

    if (order.billing.billingAddress.address) {
        $('.order-summary-phone').text(order.billing.billingAddress.address.phone);
    }
};

base.paymentTabs = function () {
    $('.payment-options .nav-item').on('click', function (e) {
        e.preventDefault();
        var methodID = $(this).data('method-id');
        $('.payment-information').data('payment-method-id', methodID);
        if (methodID === 'PayPal') {
            aurusCheckout.methods.getAurusPayPalSession();
            aurusCheckout.methods.getBillerToken();
        }
    });
};

module.exports = base;
