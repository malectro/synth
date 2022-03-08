/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function';

import css from './keyboard.module.css';



type Props = {
  onPress: Function,
  onRelease: Function,
  onMove: Function,
};

const keys = _.range(88).map(index => (
  Math.pow(2, (index + 1 - 49) / 12) * 440
));

class Keyboard extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  componentDidMount() {
    this.el = findDOMNode(this);
    this.width = this.el.offsetWidth;
  }

  render() {
    const {onPress, onRelease, onMove} = this.props;
    return (
      <div className={css.keyboard} onMouseLeave={handleEvent(onRelease)} onTouchCancel={handleEvent(onRelease)} onTouchEnd={handleEvent(onRelease)} onTouchMove={this.handleTouchMove}>
        { keys.map(freq => (
          <div className={css.key} key={freq} onMouseDown={handleEvent(onPress, freq)} onMouseOver={handleEvent(onMove, freq)} onMouseUp={handleEvent(onRelease, freq)} onTouchStart={handleEvent(onPress, freq)}></div>
        )) }
      </div>
    );
  }

  handleTouchMove(event) {
    event.preventDefault();
    const touch = event.targetTouches[0];
    const box = this.el.getBoundingClientRect();
    const elementX = touch.clientX - box.left;
    const index = Math.floor(keys.length * elementX / this.width);
    this.props.onMove(keys[index]);
  }
}

export default Keyboard;

const handleEvent = (handler, ...args) => (
  (event) => {
    event.preventDefault();
    handler(...args);
  }
);

