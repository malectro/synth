/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {absolutePosition} from 'src/services/utils';
import css from './slider.css';


export default class Slider extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    value: number,
    max: number,
    min: number,
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
  }

  render() {
    const {value, max, min} = this.props;
    const percent = (value - min) * 100 / (max - min);
    return (
      <div className={css.slider} ref={el => this.el = el}>
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
}

