'use strict';

/**
* @constructor
* @classdesc Billing address in Aurus Pay format
* @param {Object} address Shipping address from paymentForm
*/
function BillingAddress(address) {
    // Name
    this.BillingFirstName = address.billing.firstName.value;
    this.BillingLastName = address.billing.lastName.value;
    this.BillingMiddleName = '';
    // Address
    this.BillingAddressLine1 = address.billing.address1.value;
    this.BillingAddressLine2 = !empty(address.billing.address2) ? address.billing.address2.value : '';
    this.BillingCity = address.billing.city.value;
    this.BillingState = address.billing.stateCode.value;
    this.BillingZip = address.billing.postalCode.value;
    this.BillingCountry = address.billing.countryCode.value;
    // Contact
    this.BillingMobileNumber = address.phone.value;
    this.BillingEmailId = address.email.value;
}

module.exports = BillingAddress;
