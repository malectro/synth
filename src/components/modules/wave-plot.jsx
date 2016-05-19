/* @flow */

import type {WaveType} from 'src/audio';

import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';


class SimpleWaveformPlot extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    type: WaveType,
    repeat: number,
  };

  state: {
    size: {
      width: ?number,
      height: ?number,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      size: {
        width: null,
        height: null,
      },
    };
  }

  componentDidMount() {
    this.ctx = this.el.getContext('2d');
    this.resize(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.size !== this.props.size) {
      this.resize(props);
    }
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    const {width, height} = this.state.size;
    const {type, repeat, ...props} = this.props;
    return (
      <canvas {...props} ref={el => this.el = el} width={width} height={height} />
    );
  }

  resize() {
    this.setState({
      size: {
        width: this.el.offsetWidth,
        height: this.el.offsetHeight,
      },
    });
  }

  draw() {
    const {ctx, state, props} = this;
    const {repeat} = props;
    const {width, height} = state.size;
    const lineWidth = 2;
    const padding = Math.ceil(lineWidth / 2);

    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;
    const halfHeight = Math.round(drawHeight / 2);
    const halfWidth = Math.round(drawWidth / 2);
    const period = Math.round(repeat * drawWidth);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = lineWidth;

    ctx.clearRect(0, 0, width, height);

    ctx.translate(padding, padding);
    ctx.beginPath();
    ctx.moveTo(0, halfHeight);

    const drawer = waves[props.type];

    for (let x = 0; x < drawWidth; x += period) {
      drawer(ctx, x, period, halfHeight);
    }
    /*
    drawer(ctx, 0, halfWidth, halfHeight);
    drawer(ctx, halfWidth, halfWidth, halfHeight);
    */

    ctx.stroke();
    ctx.translate(-padding, -padding);
  }
}

export default SimpleWaveformPlot;


const waves = {
  'square': (ctx, start, width, amp) => {
    const halfWidth = Math.round(width / 2);

    ctx.lineTo(start, 0);
    ctx.lineTo(start + halfWidth, 0);
    ctx.lineTo(start + halfWidth, amp * 2);
    ctx.lineTo(start + width, amp * 2);
    ctx.lineTo(start + width, amp);
  },

  'sine': (ctx, start, width, amp) => {
    const unit = 2;

    for (let x = 0; x < width; x += unit) {
      let y = Math.sin(x * Math.PI * 2 / width) * amp + amp;
      ctx.lineTo(start + x, y);
    }
  },

  'triangle': (ctx, start, width, amp) => {
    const quarterWidth = Math.round(width / 4);
    ctx.lineTo(start + quarterWidth, 0);
    ctx.lineTo(start + quarterWidth * 3, amp * 2);
    ctx.lineTo(start + width, amp);
  },

  'sawtooth': (ctx, start, width, amp) => {
    const halfWidth = Math.round(width / 2);
    ctx.lineTo(start + halfWidth, 0);
    ctx.lineTo(start + halfWidth, amp * 2);
    ctx.lineTo(start + width, amp);
  },
};

