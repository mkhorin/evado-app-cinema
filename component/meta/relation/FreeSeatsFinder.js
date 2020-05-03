/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado-meta-base/attr/RelationFinder');

module.exports = class FreeSeatsFinder extends Base {

    async execute (query, model) {
        const hall = model.get('hall');
        const screening = model.getId();
        const ticket = model.class.meta.getClass('ticket');
        const seats = await ticket.find().and({screening}).column('seat');
        query.and({hall}); // only hall seats
        query.and(['NOT IN', query.view.getKey(), seats]); // not in ticket seats
        return query;
    }
};