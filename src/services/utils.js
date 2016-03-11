/* @flow */

import _ from 'lodash';


export function classify() {
  return _(arguments).map(arg => {
    if (_.isPlainObject(arg)) {
      arg = _.map(arg, (test, name) => (
        test ? name : null
      ));
    }
    return arg;
  }).flatten().without(null).join(' ');
}

export function cloneWith() {
  return _.assign.call(_, {}, ...arguments);
}

export function absolutePosition(el) {
  var pos = {
    left: 0,
    top: 0,
  };
  while (el) {
    pos.left += el.offsetLeft;
    pos.top += el.offsetTop;
    el = el.offsetParent;
  }
  return pos;
}

