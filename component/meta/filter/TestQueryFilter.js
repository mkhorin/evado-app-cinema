/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class TestQueryFilter extends Base {

    resolve (query) {
        return query.and({'someAttr': 'someValue'});
    }
};