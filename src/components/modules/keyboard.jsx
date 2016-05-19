/* @flow */

import _ from 'lodash';
import React from 'react';

import css from './keyboard.css';



type Props = {
  onPress: Function,
  onRelease: Function,
  onMove: Function,
};

const keys = _.range(88).map(index => (
  Math.pow(2, (index + 1 - 49) / 12) * 440
));

const Keyboard = ({onPress, onRelease, onMove}) => (
  <div className={css.keyboard}>
    { keys.map(freq => (
      <div className={css.key} key={freq} onMouseDown={() => onPress(freq)} onMouseOver={() => onMove(freq)} onMouseUp={() => onRelease(freq)}></div>
    )) }
  </div>
);

export default Keyboard;

