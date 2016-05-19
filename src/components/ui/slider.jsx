/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import classify from 'classify';

import {absolutePosition} from 'src/services/utils';
import css from './slider.css';


export default class Slider extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    value: number,
    max: number,
    min: number,
    className: ?string,
    onChange: (value: number) => void,
  };

  static defaultProps = {
    value: 0,
    max: 100,
    min: 0,
    onChange: _.noop,
  };

  constructor(props) {
    super(props);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  render() {
    const {value, max, min, className} = this.props;
    const percent = (value - min) * 100 / (max - min);
    return (
      <div className={classify(css.slider, className)} ref={el => this.el = el} onTouchStart={this.handleTouchStart}>
        <div className={css.progress} style={{width: `${percent}%`}}>
          <div className={css.handle} onMouseDown={this.handleMouseDown}></div>
        </div>
      </div>
    );
  }

  handleMouseDown() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);

    this.rect = this.el.getBoundingClientRect();
  }

  handleMouseMove(event) {
    const {max, min} = this.props;
    const percent = _.clamp((event.clientX - this.rect.left) / this.rect.width, 0, 1);
    const newValue = percent * (max - min) + min;

    this.props.onChange(newValue);
  }

  handleMouseUp() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleTouchStart(event) {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);

    this.rect = this.el.getBoundingClientRect();

    const touch = event.touches[0];
    this.handleMouseMove(touch);
  }

  handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    this.handleMouseMove(touch);
  }

  handleTouchEnd() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }
}

