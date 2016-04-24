/* @flow */

import type {WaveType} from 'src/audio';

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import css from './synth.css';
import audio from 'src/audio';

import SoundPlayer from 'src/components/modules/player.jsx';


const noiseTime = 4;
export default class SimpleWaveform extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    type: WaveType,
  };

  componentDidMount() {
    this.createSource();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type) {
      this.player.refresh();
    }
  }

  render() {
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <SoundPlayer duration={noiseTime} onGetSource={this.handleGetSource.bind(this)} loop={true} ref={el => this.player = el}>
            <SimpleWaveformPlot type="square" />
          </SoundPlayer>
        </div>
      </figure>
    );
  }

  handleGetSource() {
    const source = audio.createOscillator();
    source.type = this.props.type;
    source.frequency.value = 300;
    return source;
  }
}


class SimpleWaveformPlot extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    type: WaveType,
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
    this.resize(this.props, () => {
      this.draw();
    });
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
    return (
      <canvas className={css.quad} ref={el => this.el = el} width={width} height={height} />
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
    const {width, height} = state.size;
    const halfHeight = Math.round(height / 2);
    const halfWidth = Math.round(width / 2);

    ctx.strokeStyle = 'white';

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    this.drawSquare(ctx, 0, halfWidth, halfHeight);
    this.drawSquare(ctx, halfWidth, halfWidth, halfHeight);

    ctx.stroke();
  }

  drawSquare(ctx, start, width, amp) {
    const halfWidth = Math.round(width / 2);

    ctx.moveTo(start, amp);
    ctx.lineTo(start, 0);
    ctx.lineTo(start + halfWidth, 0);
    ctx.lineTo(start + halfWidth, amp * 2);
    ctx.lineTo(start + width, amp * 2);
    ctx.lineTo(start + width, amp);
  }
}

