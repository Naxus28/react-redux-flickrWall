/* */ 
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = thunkMiddleware;
function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return typeof action === 'function' ? action(dispatch, getState) : next(action);
    };
  };
}
module.exports = exports['default'];