/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class TicketPriceExpression extends Base {

    async resolve (model) {
        const screening = await model.related.resolve('screening');
        const pricing = await screening.related.resolve('pricing');
        const prices = await pricing.related.resolve('prices');
        const seat = JSON.stringify(model.get('seat'));
        for (const price of prices) {
            if (seat === JSON.stringify(price.get('seat'))) {
                return price.get('value');
            }
        }
        return pricing.get('value');
    }
};