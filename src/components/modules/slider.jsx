/* @flow */

import React from 'react';

import css from './slider.css';


class Slider extends Component {
  props: {
    value: number,
  };

  render() {
    return (
      <div className={css.container}>
        <div className={css.amount}></div>
      </div>
    );
  }

  _handleMouseDown(event) {

  }
  handleMouseDown = this._handleMouseDown.bind(this);
);
