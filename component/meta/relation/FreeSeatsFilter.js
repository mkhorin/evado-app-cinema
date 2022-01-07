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
        query.and({hall}); // only hall seats
        query.and(['notIn', query.view.getKey(), seats]); // not in ticket seats
        return query;
    }
};