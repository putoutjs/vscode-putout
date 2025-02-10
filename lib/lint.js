'use strict';

const process = require('node:process');
const {join, sep} = require('node:path');
const tryToCatch = require('try-to-catch');
const {workspace} = require('vscode');

const initProcessFile = require('@putout/cli-process-file');
const parseOptions = require('putout/parse-options');
const {ignores} = require('putout');

const disabledRules = {
    'apply-template-literals': 'off',
    'remove-empty': 'off',
    'nodejs/remove-process-exit': 'off',
    'remove-unused-variables': 'off',
    'typescript/remove-unused-types': 'off',
    'remove-unused-expressions': 'off',
    'remove-unreferenced-variables': 'off',
    'remove-useless-arguments': 'off',
    'return/remove-useless': 'off',
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
    
    const {fsPath} = workspace.workspaceFolders[0].uri;
    
    process.env.PUTOUT_LOAD_DIR = join(fsPath, sep, 'node_modules');
    process.env.NO_ESLINT = 1;
    
    const processFile = initProcessFile({
        fix,
    });
    
    const [error, result] = await tryToCatch(processFile, {
        name,
        source,
        options: {
            ...options,
            fix,
            rules: {
                ...rules,
                ...disabledRules,
            },
        },
    });
    
    if (error)
        return [error];
    
    return [null, result];
};
