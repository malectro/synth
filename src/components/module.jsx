/* @flow */

import _ from 'lodash';
import React, {PropTypes} from 'react';
import PureComponent from 'react-pure-render/component';
import audio, {SAMPLE_RATE} from 'src/audio';

import css from './module.css';


const noiseTime = 4;
const count = SAMPLE_RATE * noiseTime;
export default class Module extends PureComponent {
  constructor(props) {
    super(props);

    const points = _.times(count, i => ({
      x: i,
      y: Math.random() * 2 - 1,
    }));

    this.state = {points};

    this.play = this.play.bind(this);
  }

  componentDidMount() {
    const {points} = this.state;
    const buffer = audio.createBuffer(1, points.length, SAMPLE_RATE);
    const data = buffer.getChannelData(0);

    points.forEach(({x, y}, i) => {
      data[i] = y;
    });

    this.buffer = buffer;
  }

  render() {
    return (
      <figure className={css.module}>
        <XYPlot points={this.state.points} />
        <button onClick={this.play}>
          { !this.state.playing ?
            <svg viewBox="0 0 100 100">
              <path d="M 0 0 L 100 50 L 0 100 z" />
            </svg>
          :
            <svg viewBox="0 0 100 100">
              <rect x="0" y="0" width="40" height="100" />
              <rect x="60" y="0" width="40" height="100" />
            </svg>
          }
        </button>
      </figure>
    );
  }

  play() {
    if (!this.state.playing) {
      this.start();
    } else {
      this.stop();
    }
  }

  start() {
    const source = audio.createBufferSource();
    source.buffer = this.buffer;
    source.connect(audio.destination);
    source.start();

    const timeout = _.delay(() => {
      this.stop();
    }, noiseTime * 1000);

    this.setState({
      playing: source,
      timeout: timeout,
    });

  }

  stop() {
    const source = this.state.playing;
    if (source) {
      clearTimeout(this.state.timeout);
      source.stop();
      this.setState({
        playing: null,
      });
    }
  }
}


const limit = 200;
const [width, height] = [800, 200];
class XYPlot extends PureComponent {
  props: {
    points: Array<{
      x: number,
      y: number,
    }>,
  };

  componentDidMount() {
    this.ctx = this.el.getContext('2d');
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    return (
      <canvas ref={el => this.el = el} width={width} height={height} />
    );
  }

  draw() {
    const {ctx} = this;
    const points = this.props.points.slice(0, limit);
    const halfHeight = height / 2;
    const margin = 2;
    const stepSize = (width / points.length);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'gray';
    points.forEach(({x, y}) => {
      const pos = x * stepSize;
      this.ctx.fillRect(pos, halfHeight, stepSize - margin, y * halfHeight);
    });
  }
}

