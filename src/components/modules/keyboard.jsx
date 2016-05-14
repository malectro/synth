/* @flow */

import _ from 'lodash';
import React from 'react';

import css from './keyboard.css';



type Props = {
  onPress: Function,
  onRelease: Function,
};

const keys = _.range(88).map(index => (
  Math.pow(2, (index + 1 - 49) / 12) * 440
));

console.log('keys', keys);

const Keyboard = ({onPress, onRelease}) => (
  <div className={css.keyboard}>
    { keys.map(freq => (
      <div className={css.key} key={freq} onMouseDown={() => onPress(freq)} onMouseUp={() => onRelease(freq)}></div>
    )) }
  </div>
);

export default Keyboard;

