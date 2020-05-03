'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Full access to data',
        type: 'allow',
        roles: ['administrator'],
        actions: ['all'],
        targets: [{type: 'all'}]
    }, {
        description: 'Guest user access to read public data',
        type: 'allow',
        roles: ['guest'],
        actions: ['read'],
        targets: [{
            type: 'class',
            class: ['hall', 'movie', 'poster', 'screening', 'seat', 'pricing', 'ticket']
        }]
    }, {
        description: 'Guest user access to create ticket',
        type: 'allow',
        roles: ['guest'],
        actions: ['create'],
        targets: [{
            type: 'view',
            class: 'ticket',
            view: 'publicCreate'
        }]
    }],

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Admin module',
            description: 'Access to Admin module'
        },
        'moduleOffice': {
            label: 'Office module',
            description: 'Access to Office module'
        },
        'moduleStudio': {
            label: 'Studio module',
            description: 'Access to Studio module'
        }
    },

    roles: {
        'administrator': {
            label: 'Administrator',
            description: 'Full access to all',
            children: [
                'moduleAdmin',
                'moduleOffice',
                'moduleStudio',
                'upload'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for unauthenticated users'
        },
        'user': {
            label: 'User',
            description: 'Default role for new user'
        }
    },

    assignments: {
        'Adam': ['administrator']
    },

    rules: {
    }
};