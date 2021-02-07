'use strict';

module.exports = {

    title: 'Cinema',

    components: {
        'db': {
            settings: {
                'database': process.env.MONGO_NAME || 'evado-cinema',
            }
        },
        'cookie': {
            secret: 'cinema.evado'
        },
        'session': {
            secret: 'cinema.evado'
        },
        'i18n': {
            language: 'en'
        },
        'router': {
            // defaultModule: 'front'
        },
        'fileStorage': {
            thumbnail: {
                sizes: {
                    'large': {
                        composite: [{
                            input: 'asset/watermark/fileLarge.png',
                            gravity: 'center'
                        }]
                    }
                }
            }
        }
    },
    metaModels: {
        'base': {
            Class: require('evado-meta-base/base/BaseMeta')
        },
        'navigation': {
            Class: require('evado-meta-navigation/base/NavMeta')
        }
    },
    modules: {
        'api': {
            config: {
                modules: {
                    'base': {
                        Class: require('evado-api-base/Module')
                    },
                    'navigation': {
                        Class: require('evado-api-navigation/Module')
                    }
                }
            }
        },
        'studio': {
            Class: require('evado-module-studio/Module')
        },
        'office': {
            Class: require('../module/office/Module')
        },
        'account': {
            Class: require('evado-module-account/Module')
        },
        'admin': {
            Class: require('evado-module-admin/Module')
        },
        'front': {
            Class: require('../module/front/Module')
        }
    },
    users: require('./default-users'),
    security: require('./default-security'),
    tasks: require('./default-tasks'),
    utilities: require('./default-utilities'),
    sideMenu: require('./default-sideMenu'),
    params: {        
        'enablePasswordReset': false,
        'enableSignUp': false
    }
};