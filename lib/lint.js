'use strict';

const putout = require('putout');
const parseOptions = require('putout/parse-options');
const tryCatch = require('try-catch');

const disabledRules = {
    'apply-template-literals': 'off',
    'remove-empty': 'off',
    'nodejs/remove-process-exit': 'off',
    'remove-unused-variables': 'off',
    'typescript/remove-unused-types': 'off',
    'remove-unused-expressions': 'off',
    'remove-unreferenced-variables': 'off',
    'remove-useless-arguments': 'off',
    'remove-useless-return': 'off',
    'remove-useless-spread': 'off',
    'remove-useless-variables/rename': 'off',
    'remove-useless-variables/declaration': 'off',
    'tape/remove-skip': 'off',
    'tape/remove-only': 'off',
    'remove-console': 'off',
    'remove-debugger': 'off',
    'remove-unreachable-code': 'off',
    'for-of/for': 'off',
    'for-of/remove-useless': 'off',
    'for-of/remove-unused-variables': 'off',
    'maybe/noop': 'off',
};

module.exports.lint = (name, source) => {
    const {rules, ...options} = parseOptions({
        name,
    });
    
    return tryCatch(putout, source, {
        ...options,
        rules: {
            ...rules,
            ...disabledRules,
        },
    });
};
