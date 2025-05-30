'use strict';

// Test that the context parameter will be merged in multiple resolve hooks.

const common = require('../common');
const assert = require('assert');
const { registerHooks } = require('module');

const hook1 = registerHooks({
  resolve: common.mustCall(function(specifier, context, nextResolve) {
    assert.strictEqual(context.testProp, 'custom');  // It should be merged from hook 2 and 3.
    const result = nextResolve(specifier, context);
    return result;
  }, 1),
});

const hook2 = registerHooks({
  resolve: common.mustCall(function(specifier, context, nextResolve) {
    assert.strictEqual(context.testProp, 'custom');  // It should be merged from hook 3.
    return nextResolve(specifier);  // Omit the context.
  }, 1),
});

const hook3 = registerHooks({
  resolve: common.mustCall(function(specifier, context, nextResolve) {
    return nextResolve(specifier, { testProp: 'custom' });  // Add a custom property
  }, 1),
});

require('../fixtures/empty.js');

hook3.deregister();
hook2.deregister();
hook1.deregister();
