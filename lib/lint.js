'use strict';

const process = require('node:process');
const {lint} = require('samadhi');
const putout = require('putout');
const parseOptions = require('putout/parse-options');
const tryCatch = require('try-catch');
const {ignores} = putout;

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

module.exports.lint = async (source, {name, fix}) => {
    const {rules, ...options} = parseOptions({
        name,
    });
    
    if (ignores(process.cwd(), name, options))
        return [null, {
            code: source,
            places: [],
        }];
    
    const [error, result] = tryCatch(putout, source, {
        ...options,
        fix,
        rules: {
            ...rules,
            ...disabledRules,
        },
    });
    
    if (!error)
        return [null, result];
    
    const [fixed, places] = await lint(source, {
        fix,
    });
    
    if (!fix && !places.length)
        return [error];
    
    return [null, {
        code: fixed,
        places,
    }];
};
