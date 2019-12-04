'use strict';

var collections = require('*/cartridge/scripts/util/collections');

/**
* @constructor
* @classdesc Maps product line item data to Aurus Pay format
* @param {dw.util.Collection<dw.order.ProductLineItem>} item - a product line item from the basket
*/
function ProductDetails(item) {
    this.L3DepartmentID = 'did';
    this.L3TarriffAmount = item.tax.value;
    this.L3ProductDiscount = '';
    this.L3ProductDescription = item.product.longDescription.markup;
    this.L3ProductUnitPrice = item.basePrice.value;
    this.L3ProductTaxRate = item.taxRate;
    this.L3ProductQuantity = item.quantity.value;
    this.L3ClassID = 'cid';
    this.L3ProductName = item.productName;
    this.L3GiftWrapAmount = '';
    this.L3ProductTotalAmount = item.adjustedNetPrice.value;
    this.L3OrderRefNumber = '';
    this.L3ProductSeqNo = '';
    this.L3ProductCode = item.productID;
    this.L3MonogramAmount = '';
    this.L3ProductTax = item.tax.value;
    this.L3UnitOfMeasure = '';
    this.L3OtherAmount = '';
    this.L3FreightAmount = '';
}

/**
* @constructor
* @classdesc Creates an array of product line items, product data for Aurus Pay
* @param {dw.util.Collection<dw.order.ProductLineItem>} allLineItems - All product
* line items of the basket
* @returns {Array} an array of product line items. in basket
*/
function createProductLineItemsObject(allLineItems) {
    var lineItems = [];

    collections.forEach(allLineItems, function (item) {
        // when item's category is unassigned, return a lineItem with limited attributes
        // TODO: Fix this for non products, i.e. product extended warranty
        if (!item.product) {
            lineItems.push({
                id: item.productID,
                quantity: item.quantity.value,
                productName: item.productName,
                UUID: item.UUID,
                noProduct: true
            });
            return;
        }
        var options = collections.map(item.optionProductLineItems, function (optionItem) {
            return {
                optionId: optionItem.optionID,
                selectedValueId: optionItem.optionValueID
            };
        });

        var bonusProducts = null;

        if (!item.bonusProductLineItem
                && item.custom.bonusProductLineItemUUID
                && item.custom.preOrderUUID) {
            bonusProducts = [];
            collections.forEach(allLineItems, function (bonusItem) {
                if (!!item.custom.preOrderUUID && bonusItem.custom.bonusProductLineItemUUID === item.custom.preOrderUUID) {
                    var bpliOptions = collections.map(bonusItem.optionProductLineItems, function (boptionItem) {
                        return {
                            optionId: boptionItem.optionID,
                            selectedValueId: boptionItem.optionValueID
                        };
                    });
                    var params = {
                        pid: bonusItem.product.ID,
                        quantity: bonusItem.quantity.value,
                        variables: null,
                        pview: 'bonusProductLineItem',
                        containerView: view,
                        lineItem: bonusItem,
                        options: bpliOptions
                    };

                    bonusProducts.push(ProductFactory.get(params));
                }
            });
        }

        var newLineItem = new ProductDetails(item);
        // TODO: Add bonus products
        // newLineItem.bonusProducts = bonusProducts;
        if (newLineItem.bonusProductLineItemUUID === 'bonus' || !newLineItem.bonusProductLineItemUUID) {
            lineItems.push(newLineItem);
        }
    });

    return lineItems;
}

/**
 * Loops through all of the product line items and adds the quantities together.
 * @param {dw.util.Collection<dw.order.ProductLineItem>} items - All product
 * line items of the basket
 * @returns {number} a number representing all product line items in the lineItem container.
 */
function getTotalQuantity(items) {
    // TODO add giftCertificateLineItems quantity
    var totalQuantity = 0;
    collections.forEach(items, function (lineItem) {
        totalQuantity += lineItem.quantity.value;
    });

    return totalQuantity;
}

/**
* @constructor
* @classdesc class that represents a collection of line items and total quantity of
* items in current basket or per shipment
*
* @param {dw.order.Order} order - The order object that has been created
*/
function Level3ProductsData(order) {
    if (order) {
        this.Level3Products = { Level3Product: createProductLineItemsObject(order.allProductLineItems) };
        this.Level3ProductCount = getTotalQuantity(order.allProductLineItems);
    } else {
        this.items = [];
        this.totalQuantity = 0;
    }
}

module.exports = Level3ProductsData;
