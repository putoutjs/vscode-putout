'use strict';

const {run} = require('madrun');

module.exports = {
    'test': () => `tape 'test/*.js'`,
    'test:vscode': () => 'vscode-test',
    'watch:test': async () => `nodemon -w lib -w test -x ${await run('test')}`,
    'lint': () => `putout .`,
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'coverage': async () => `c8 ${await run('test')}`,
    'patch': () => 'vsce publish patch --allow-star-activation',
    'report': () => 'c8 report --reporter=lcov',
    'package': () => 'vsce package --allow-star-activation',
    'upload': () => `putasset --filename vscode-putout-${readVersion()}.vsix --tag v${readVersion()} --r vscode-putout -o putoutjs`,
};

function readVersion() {
    return require('./package').version;
}
