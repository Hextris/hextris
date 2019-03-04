'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

var _jestGetType = _interopRequireDefault(require('jest-get-type'));

var _jestRegexUtil = require('jest-regex-util');

var _jestMatcherUtils = require('jest-matcher-utils');

var _utils = require('./utils');

var _jasmineUtils = require('./jasmineUtils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const matchers = {
  toBe(received, expected) {
    const comment = 'Object.is equality';
    const pass = Object.is(received, expected);
    const message = pass
      ? () =>
          (0, _jestMatcherUtils.matcherHint)('.toBe', undefined, undefined, {
            comment,
            isNot: true
          }) +
          '\n\n' +
          `Expected: ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
          `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`
      : () => {
          const receivedType = (0, _jestGetType.default)(received);
          const expectedType = (0, _jestGetType.default)(expected);
          const suggestToEqual =
            receivedType === expectedType &&
            (receivedType === 'object' || expectedType === 'array') &&
            (0, _jasmineUtils.equals)(received, expected, [
              _utils.iterableEquality
            ]);
          const oneline = (0, _utils.isOneline)(expected, received);
          const diffString = (0, _jestMatcherUtils.diff)(expected, received, {
            expand: this.expand
          });
          return (
            (0, _jestMatcherUtils.matcherHint)('.toBe', undefined, undefined, {
              comment,
              isNot: false
            }) +
            '\n\n' +
            `Expected: ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
            `Received: ${(0, _jestMatcherUtils.printReceived)(received)}` +
            (diffString && !oneline ? `\n\nDifference:\n\n${diffString}` : '') +
            (suggestToEqual ? ` ${_jestMatcherUtils.SUGGEST_TO_EQUAL}` : '')
          );
        }; // Passing the actual and expected objects so that a custom reporter
    // could access them, for example in order to display a custom visual diff,
    // or create a different error message

    return {
      actual: received,
      expected,
      message,
      name: 'toBe',
      pass
    };
  },

  toBeCloseTo(actual, expected, precision = 2) {
    const secondArgument = arguments.length === 3 ? 'precision' : null;
    (0, _jestMatcherUtils.ensureNumbers)(actual, expected, '.toBeCloseTo');
    let pass = false;
    if (actual == Infinity && expected == Infinity) pass = true;
    else if (actual == -Infinity && expected == -Infinity) pass = true;
    else pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)('.toBeCloseTo', undefined, undefined, {
        isNot: this.isNot,
        secondArgument
      }) +
      '\n\n' +
      `Precision: ${(0, _jestMatcherUtils.printExpected)(precision)}-digit\n` +
      `Expected:  ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
      `Received:  ${(0, _jestMatcherUtils.printReceived)(actual)}`;

    return {
      message,
      pass
    };
  },

  toBeDefined(received, expected) {
    const options = {
      isNot: this.isNot,
      promise: this.promise
    };
    (0, _jestMatcherUtils.ensureNoExpected)(expected, 'toBeDefined', options);
    const pass = received !== void 0;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)(
        'toBeDefined',
        undefined,
        '',
        options
      ) +
      '\n\n' +
      `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`;

    return {
      message,
      pass
    };
  },

  toBeFalsy(received, expected) {
    const options = {
      isNot: this.isNot,
      promise: this.promise
    };
    (0, _jestMatcherUtils.ensureNoExpected)(expected, 'toBeFalsy', options);
    const pass = !received;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)('toBeFalsy', undefined, '', options) +
      '\n\n' +
      `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`;

    return {
      message,
      pass
    };
  },

  toBeGreaterThan(actual, expected) {
    (0, _jestMatcherUtils.ensureNumbers)(actual, expected, '.toBeGreaterThan');
    const pass = actual > expected;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)(
        '.toBeGreaterThan',
        undefined,
        undefined,
        {
          isNot: this.isNot
        }
      ) +
      '\n\n' +
      `Expected: ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
      `Received: ${(0, _jestMatcherUtils.printReceived)(actual)}`;

    return {
      message,
      pass
    };
  },

  toBeGreaterThanOrEqual(actual, expected) {
    (0, _jestMatcherUtils.ensureNumbers)(
      actual,
      expected,
      '.toBeGreaterThanOrEqual'
    );
    const pass = actual >= expected;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)(
        '.toBeGreaterThanOrEqual',
        undefined,
        undefined,
        {
          isNot: this.isNot
        }
      ) +
      '\n\n' +
      `Expected: ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
      `Received: ${(0, _jestMatcherUtils.printReceived)(actual)}`;

    return {
      message,
      pass
    };
  },

  toBeInstanceOf(received, constructor) {
    const constType = (0, _jestGetType.default)(constructor);

    if (constType !== 'function') {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)(
            '.toBeInstanceOf',
            undefined,
            undefined,
            {
              isNot: this.isNot
            }
          ),
          `${(0, _jestMatcherUtils.EXPECTED_COLOR)(
            'expected'
          )} value must be a function`,
          (0, _jestMatcherUtils.printWithType)(
            'Expected',
            constructor,
            _jestMatcherUtils.printExpected
          )
        )
      );
    }

    const pass = received instanceof constructor;
    const message = pass
      ? () =>
          (0, _jestMatcherUtils.matcherHint)(
            '.toBeInstanceOf',
            'value',
            'constructor',
            {
              isNot: this.isNot
            }
          ) +
          '\n\n' +
          `Expected constructor: ${(0, _jestMatcherUtils.EXPECTED_COLOR)(
            constructor.name || String(constructor)
          )}\n` +
          `Received value: ${(0, _jestMatcherUtils.printReceived)(received)}`
      : () =>
          (0, _jestMatcherUtils.matcherHint)(
            '.toBeInstanceOf',
            'value',
            'constructor',
            {
              isNot: this.isNot
            }
          ) +
          '\n\n' +
          `Expected constructor: ${(0, _jestMatcherUtils.EXPECTED_COLOR)(
            constructor.name || String(constructor)
          )}\n` +
          `Received constructor: ${(0, _jestMatcherUtils.RECEIVED_COLOR)(
            received != null
              ? received.constructor && received.constructor.name
              : ''
          )}\n` +
          `Received value: ${(0, _jestMatcherUtils.printReceived)(received)}`;
    return {
      message,
      pass
    };
  },

  toBeLessThan(actual, expected) {
    (0, _jestMatcherUtils.ensureNumbers)(actual, expected, '.toBeLessThan');
    const pass = actual < expected;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)(
        '.toBeLessThan',
        undefined,
        undefined,
        {
          isNot: this.isNot
        }
      ) +
      '\n\n' +
      `Expected: ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
      `Received: ${(0, _jestMatcherUtils.printReceived)(actual)}`;

    return {
      message,
      pass
    };
  },

  toBeLessThanOrEqual(actual, expected) {
    (0, _jestMatcherUtils.ensureNumbers)(
      actual,
      expected,
      '.toBeLessThanOrEqual'
    );
    const pass = actual <= expected;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)(
        '.toBeLessThanOrEqual',
        undefined,
        undefined,
        {
          isNot: this.isNot
        }
      ) +
      '\n\n' +
      `Expected: ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
      `Received: ${(0, _jestMatcherUtils.printReceived)(actual)}`;

    return {
      message,
      pass
    };
  },

  toBeNaN(received, expected) {
    const options = {
      isNot: this.isNot,
      promise: this.promise
    };
    (0, _jestMatcherUtils.ensureNoExpected)(expected, 'toBeNaN', options);
    const pass = Number.isNaN(received);

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)('toBeNaN', undefined, '', options) +
      '\n\n' +
      `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`;

    return {
      message,
      pass
    };
  },

  toBeNull(received, expected) {
    const options = {
      isNot: this.isNot,
      promise: this.promise
    };
    (0, _jestMatcherUtils.ensureNoExpected)(expected, 'toBeNull', options);
    const pass = received === null;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)('toBeNull', undefined, '', options) +
      '\n\n' +
      `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`;

    return {
      message,
      pass
    };
  },

  toBeTruthy(received, expected) {
    const options = {
      isNot: this.isNot,
      promise: this.promise
    };
    (0, _jestMatcherUtils.ensureNoExpected)(expected, 'toBeTruthy', options);
    const pass = !!received;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)('toBeTruthy', undefined, '', options) +
      '\n\n' +
      `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`;

    return {
      message,
      pass
    };
  },

  toBeUndefined(received, expected) {
    const options = {
      isNot: this.isNot,
      promise: this.promise
    };
    (0, _jestMatcherUtils.ensureNoExpected)(expected, 'toBeUndefined', options);
    const pass = received === void 0;

    const message = () =>
      (0, _jestMatcherUtils.matcherHint)(
        'toBeUndefined',
        undefined,
        '',
        options
      ) +
      '\n\n' +
      `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`;

    return {
      message,
      pass
    };
  },

  toContain(collection, value) {
    const collectionType = (0, _jestGetType.default)(collection);
    let converted = null;

    if (Array.isArray(collection) || typeof collection === 'string') {
      // strings have `indexOf` so we don't need to convert
      // arrays have `indexOf` and we don't want to make a copy
      converted = collection;
    } else {
      try {
        converted = Array.from(collection);
      } catch (e) {
        throw new Error(
          (0, _jestMatcherUtils.matcherErrorMessage)(
            (0, _jestMatcherUtils.matcherHint)(
              '.toContain',
              undefined,
              undefined,
              {
                isNot: this.isNot
              }
            ),
            `${(0, _jestMatcherUtils.RECEIVED_COLOR)(
              'received'
            )} value must not be null nor undefined`,
            (0, _jestMatcherUtils.printWithType)(
              'Received',
              collection,
              _jestMatcherUtils.printReceived
            )
          )
        );
      }
    } // At this point, we're either a string or an Array,
    // which was converted from an array-like structure.

    const pass = converted.indexOf(value) != -1;

    const message = () => {
      const stringExpected = 'Expected value';
      const stringReceived = `Received ${collectionType}`;
      const printLabel = (0, _jestMatcherUtils.getLabelPrinter)(
        stringExpected,
        stringReceived
      );
      const suggestToContainEqual =
        !pass &&
        converted !== null &&
        typeof converted !== 'string' &&
        converted instanceof Array &&
        converted.findIndex(item =>
          (0, _jasmineUtils.equals)(item, value, [_utils.iterableEquality])
        ) !== -1;
      return (
        (0, _jestMatcherUtils.matcherHint)(
          '.toContain',
          collectionType,
          'value',
          {
            comment: 'indexOf',
            isNot: this.isNot
          }
        ) +
        '\n\n' +
        `${printLabel(stringExpected)}${(0, _jestMatcherUtils.printExpected)(
          value
        )}\n` +
        `${printLabel(stringReceived)}${(0, _jestMatcherUtils.printReceived)(
          collection
        )}` +
        (suggestToContainEqual
          ? `\n\n${_jestMatcherUtils.SUGGEST_TO_CONTAIN_EQUAL}`
          : '')
      );
    };

    return {
      message,
      pass
    };
  },

  toContainEqual(collection, value) {
    const collectionType = (0, _jestGetType.default)(collection);
    let converted = null;

    if (Array.isArray(collection)) {
      converted = collection;
    } else {
      try {
        converted = Array.from(collection);
      } catch (e) {
        throw new Error(
          (0, _jestMatcherUtils.matcherErrorMessage)(
            (0, _jestMatcherUtils.matcherHint)(
              '.toContainEqual',
              undefined,
              undefined,
              {
                isNot: this.isNot
              }
            ),
            `${(0, _jestMatcherUtils.RECEIVED_COLOR)(
              'received'
            )} value must not be null nor undefined`,
            (0, _jestMatcherUtils.printWithType)(
              'Received',
              collection,
              _jestMatcherUtils.printReceived
            )
          )
        );
      }
    }

    const pass =
      converted.findIndex(item =>
        (0, _jasmineUtils.equals)(item, value, [_utils.iterableEquality])
      ) !== -1;

    const message = () => {
      const stringExpected = 'Expected value';
      const stringReceived = `Received ${collectionType}`;
      const printLabel = (0, _jestMatcherUtils.getLabelPrinter)(
        stringExpected,
        stringReceived
      );
      return (
        (0, _jestMatcherUtils.matcherHint)(
          '.toContainEqual',
          collectionType,
          'value',
          {
            comment: 'deep equality',
            isNot: this.isNot
          }
        ) +
        '\n\n' +
        `${printLabel(stringExpected)}${(0, _jestMatcherUtils.printExpected)(
          value
        )}\n` +
        `${printLabel(stringReceived)}${(0, _jestMatcherUtils.printReceived)(
          collection
        )}`
      );
    };

    return {
      message,
      pass
    };
  },

  toEqual(received, expected) {
    const pass = (0, _jasmineUtils.equals)(received, expected, [
      _utils.iterableEquality
    ]);
    const message = pass
      ? () =>
          (0, _jestMatcherUtils.matcherHint)('.toEqual', undefined, undefined, {
            isNot: this.isNot
          }) +
          '\n\n' +
          `Expected: ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
          `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`
      : () => {
          const diffString = (0, _jestMatcherUtils.diff)(expected, received, {
            expand: this.expand
          });
          return (
            (0, _jestMatcherUtils.matcherHint)(
              '.toEqual',
              undefined,
              undefined,
              {
                isNot: this.isNot
              }
            ) +
            '\n\n' +
            (diffString && diffString.includes('- Expect')
              ? `Difference:\n\n${diffString}`
              : `Expected: ${(0, _jestMatcherUtils.printExpected)(
                  expected
                )}\n` +
                `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`)
          );
        }; // Passing the actual and expected objects so that a custom reporter
    // could access them, for example in order to display a custom visual diff,
    // or create a different error message

    return {
      actual: received,
      expected,
      message,
      name: 'toEqual',
      pass
    };
  },

  toHaveLength(received, length) {
    if (
      typeof received !== 'string' &&
      (!received || typeof received.length !== 'number')
    ) {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)(
            '.toHaveLength',
            undefined,
            undefined,
            {
              isNot: this.isNot
            }
          ),
          `${(0, _jestMatcherUtils.RECEIVED_COLOR)(
            'received'
          )} value must have a length property whose value must be a number`,
          (0, _jestMatcherUtils.printWithType)(
            'Received',
            received,
            _jestMatcherUtils.printReceived
          )
        )
      );
    }

    if (typeof length !== 'number') {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)(
            '.toHaveLength',
            undefined,
            undefined,
            {
              isNot: this.isNot
            }
          ),
          `${(0, _jestMatcherUtils.EXPECTED_COLOR)(
            'expected'
          )} value must be a number`,
          (0, _jestMatcherUtils.printWithType)(
            'Expected',
            length,
            _jestMatcherUtils.printExpected
          )
        )
      );
    }

    const pass = received.length === length;

    const message = () => {
      const stringExpected = 'Expected length';
      const stringReceivedLength = 'Received length';
      const stringReceivedValue = `Received ${(0, _jestGetType.default)(
        received
      )}`;
      const printLabel = (0, _jestMatcherUtils.getLabelPrinter)(
        stringExpected,
        stringReceivedLength,
        stringReceivedValue
      );
      return (
        (0, _jestMatcherUtils.matcherHint)(
          '.toHaveLength',
          'received',
          'length',
          {
            isNot: this.isNot
          }
        ) +
        '\n\n' +
        `${printLabel(stringExpected)}${(0, _jestMatcherUtils.printExpected)(
          length
        )}\n` +
        `${printLabel(stringReceivedLength)}${(0,
        _jestMatcherUtils.printReceived)(received.length)}\n` +
        `${printLabel(stringReceivedValue)}${(0,
        _jestMatcherUtils.printReceived)(received)}`
      );
    };

    return {
      message,
      pass
    };
  },

  toHaveProperty(object, keyPath, value) {
    const valuePassed = arguments.length === 3;
    const secondArgument = valuePassed ? 'value' : null;

    if (object === null || object === undefined) {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)(
            '.toHaveProperty',
            undefined,
            'path',
            {
              isNot: this.isNot,
              secondArgument
            }
          ),
          `${(0, _jestMatcherUtils.RECEIVED_COLOR)(
            'received'
          )} value must not be null nor undefined`,
          (0, _jestMatcherUtils.printWithType)(
            'Received',
            object,
            _jestMatcherUtils.printReceived
          )
        )
      );
    }

    const keyPathType = (0, _jestGetType.default)(keyPath);

    if (keyPathType !== 'string' && keyPathType !== 'array') {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)(
            '.toHaveProperty',
            undefined,
            'path',
            {
              isNot: this.isNot,
              secondArgument
            }
          ),
          `${(0, _jestMatcherUtils.EXPECTED_COLOR)(
            'expected'
          )} path must be a string or array`,
          (0, _jestMatcherUtils.printWithType)(
            'Expected',
            keyPath,
            _jestMatcherUtils.printExpected
          )
        )
      );
    }

    const result = (0, _utils.getPath)(object, keyPath);
    const lastTraversedObject = result.lastTraversedObject,
      hasEndProp = result.hasEndProp;
    const pass = valuePassed
      ? (0, _jasmineUtils.equals)(result.value, value, [
          _utils.iterableEquality
        ])
      : hasEndProp;
    const traversedPath = result.traversedPath.join('.');
    const message = pass
      ? () =>
          (0, _jestMatcherUtils.matcherHint)(
            '.not.toHaveProperty',
            'object',
            'path',
            {
              secondArgument
            }
          ) +
          '\n\n' +
          `Expected the object:\n` +
          `  ${(0, _jestMatcherUtils.printReceived)(object)}\n` +
          `Not to have a nested property:\n` +
          `  ${(0, _jestMatcherUtils.printExpected)(keyPath)}\n` +
          (valuePassed
            ? `With a value of:\n  ${(0, _jestMatcherUtils.printExpected)(
                value
              )}\n`
            : '')
      : () => {
          const diffString =
            valuePassed && hasEndProp
              ? (0, _jestMatcherUtils.diff)(value, result.value, {
                  expand: this.expand
                })
              : '';
          return (
            (0, _jestMatcherUtils.matcherHint)(
              '.toHaveProperty',
              'object',
              'path',
              {
                secondArgument
              }
            ) +
            '\n\n' +
            `Expected the object:\n` +
            `  ${(0, _jestMatcherUtils.printReceived)(object)}\n` +
            `To have a nested property:\n` +
            `  ${(0, _jestMatcherUtils.printExpected)(keyPath)}\n` +
            (valuePassed
              ? `With a value of:\n  ${(0, _jestMatcherUtils.printExpected)(
                  value
                )}\n`
              : '') +
            (hasEndProp
              ? `Received:\n` +
                `  ${(0, _jestMatcherUtils.printReceived)(result.value)}` +
                (diffString ? `\n\nDifference:\n\n${diffString}` : '')
              : traversedPath
              ? `Received:\n  ${(0, _jestMatcherUtils.RECEIVED_COLOR)(
                  'object'
                )}.${traversedPath}: ${(0, _jestMatcherUtils.printReceived)(
                  lastTraversedObject
                )}`
              : '')
          );
        };

    if (pass === undefined) {
      throw new Error('pass must be initialized');
    }

    return {
      message,
      pass
    };
  },

  toMatch(received, expected) {
    if (typeof received !== 'string') {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)('.toMatch', undefined, undefined, {
            isNot: this.isNot
          }),
          `${(0, _jestMatcherUtils.RECEIVED_COLOR)(
            'received'
          )} value must be a string`,
          (0, _jestMatcherUtils.printWithType)(
            'Received',
            received,
            _jestMatcherUtils.printReceived
          )
        )
      );
    }

    if (
      !(expected && typeof expected.test === 'function') &&
      !(typeof expected === 'string')
    ) {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)('.toMatch', undefined, undefined, {
            isNot: this.isNot
          }),
          `${(0, _jestMatcherUtils.EXPECTED_COLOR)(
            'expected'
          )} value must be a string or regular expression`,
          (0, _jestMatcherUtils.printWithType)(
            'Expected',
            expected,
            _jestMatcherUtils.printExpected
          )
        )
      );
    }

    const pass = new RegExp(
      typeof expected === 'string'
        ? (0, _jestRegexUtil.escapeStrForRegex)(expected)
        : expected
    ).test(received);
    const message = pass
      ? () =>
          (0, _jestMatcherUtils.matcherHint)('.not.toMatch') +
          `\n\nExpected value not to match:\n` +
          `  ${(0, _jestMatcherUtils.printExpected)(expected)}` +
          `\nReceived:\n` +
          `  ${(0, _jestMatcherUtils.printReceived)(received)}`
      : () =>
          (0, _jestMatcherUtils.matcherHint)('.toMatch') +
          `\n\nExpected value to match:\n` +
          `  ${(0, _jestMatcherUtils.printExpected)(expected)}` +
          `\nReceived:\n` +
          `  ${(0, _jestMatcherUtils.printReceived)(received)}`;
    return {
      message,
      pass
    };
  },

  toMatchObject(receivedObject, expectedObject) {
    if (typeof receivedObject !== 'object' || receivedObject === null) {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)(
            '.toMatchObject',
            undefined,
            undefined,
            {
              isNot: this.isNot
            }
          ),
          `${(0, _jestMatcherUtils.RECEIVED_COLOR)(
            'received'
          )} value must be a non-null object`,
          (0, _jestMatcherUtils.printWithType)(
            'Received',
            receivedObject,
            _jestMatcherUtils.printReceived
          )
        )
      );
    }

    if (typeof expectedObject !== 'object' || expectedObject === null) {
      throw new Error(
        (0, _jestMatcherUtils.matcherErrorMessage)(
          (0, _jestMatcherUtils.matcherHint)(
            '.toMatchObject',
            undefined,
            undefined,
            {
              isNot: this.isNot
            }
          ),
          `${(0, _jestMatcherUtils.EXPECTED_COLOR)(
            'expected'
          )} value must be a non-null object`,
          (0, _jestMatcherUtils.printWithType)(
            'Expected',
            expectedObject,
            _jestMatcherUtils.printExpected
          )
        )
      );
    }

    const pass = (0, _jasmineUtils.equals)(receivedObject, expectedObject, [
      _utils.iterableEquality,
      _utils.subsetEquality
    ]);
    const message = pass
      ? () =>
          (0, _jestMatcherUtils.matcherHint)('.not.toMatchObject') +
          `\n\nExpected value not to match object:\n` +
          `  ${(0, _jestMatcherUtils.printExpected)(expectedObject)}` +
          `\nReceived:\n` +
          `  ${(0, _jestMatcherUtils.printReceived)(receivedObject)}`
      : () => {
          const diffString = (0, _jestMatcherUtils.diff)(
            expectedObject,
            (0, _utils.getObjectSubset)(receivedObject, expectedObject),
            {
              expand: this.expand
            }
          );
          return (
            (0, _jestMatcherUtils.matcherHint)('.toMatchObject') +
            `\n\nExpected value to match object:\n` +
            `  ${(0, _jestMatcherUtils.printExpected)(expectedObject)}` +
            `\nReceived:\n` +
            `  ${(0, _jestMatcherUtils.printReceived)(receivedObject)}` +
            (diffString ? `\nDifference:\n${diffString}` : '')
          );
        };
    return {
      message,
      pass
    };
  },

  toStrictEqual(received, expected) {
    const pass = (0, _jasmineUtils.equals)(
      received,
      expected,
      [
        _utils.iterableEquality,
        _utils.typeEquality,
        _utils.sparseArrayEquality
      ],
      true
    );
    const hint = (0, _jestMatcherUtils.matcherHint)(
      '.toStrictEqual',
      undefined,
      undefined,
      {
        isNot: this.isNot
      }
    );
    const message = pass
      ? () =>
          hint +
          '\n\n' +
          `Expected: ${(0, _jestMatcherUtils.printExpected)(expected)}\n` +
          `Received: ${(0, _jestMatcherUtils.printReceived)(received)}`
      : () => {
          const diffString = (0, _jestMatcherUtils.diff)(expected, received, {
            expand: this.expand
          });
          return hint + (diffString ? `\n\nDifference:\n\n${diffString}` : '');
        }; // Passing the actual and expected objects so that a custom reporter
    // could access them, for example in order to display a custom visual diff,
    // or create a different error message

    return {
      actual: received,
      expected,
      message,
      name: 'toStrictEqual',
      pass
    };
  }
};
var _default = matchers;
exports.default = _default;
