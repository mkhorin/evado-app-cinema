/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/filter/RelationFilter');

module.exports = class FreeSeatsFilter extends Base {

    async apply (query, model) {
        const hall = model.get('hall');
        const screening = model.getId();
        const ticket = model.class.meta.getClass('ticket');
        const seats = await ticket.find({screening}).column('seat');
        const key = query.view.getKey();
        query.and({hall}); // only hall seats
        query.and(['notIn', key, seats]); // not in ticket seats
        return query;
    }
};