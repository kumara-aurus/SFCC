'use strict';

/**
* @constructor
* @classdesc Shipping address in Aurus Pay shipping format
* @param {Object} address Shipping address from paymentForm
*/
function ShippingAddress(address) {
    // Name
    this.ShippingFirstName = address.shipping.firstName.value;
    this.ShippingLastName = address.shipping.lastName.value;
    this.ShippingMiddleName = '';
    // Address
    this.ShippingAddressLine1 = address.shipping.address1.value;
    this.ShipingAddressLine2 =  !empty(address.shipping.address2) ? address.shipping.address2.value : '';
    this.ShippingCity = address.shipping.city.value;
    this.ShippingState = address.shipping.stateCode.value;
    this.ShippingCountry = address.shipping.countryCode.value;
    this.ShippingZip = address.shipping.postalCode.value;
    // Contact
    this.ShippingEmailId = address.email.value;
    this.ShippingMobileNumber = address.phone.value;
}

module.exports = ShippingAddress;
