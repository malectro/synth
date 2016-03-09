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

    this.state = {
      points,
    };

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
    const {points} = this.state;
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <XYPlot points={points} />
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
          <figcaption>Because this noise was generated randomly by your computer, we can safely assume it's never been seen before in the history of humanity.</figcaption>
        </div>
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
class XYPlot extends PureComponent {
  props: {
    points: Array<{
      x: number,
      y: number,
    }>,
    size: {
      width: number | 'auto',
      height: number | 'auto',
    },
  };

  static defaultProps = {
    size: {
      width: 'auto',
      height: 'auto',
    },
  };

  constructor(props) {
    super(props);

    const {width, height} = this.props.size;
    this.state = {
      size: {
        width: width === 'auto' ? 0 : width,
        height: height === 'auto' ? 0 : height,
      },
    };
  }

  componentDidMount() {
    this.ctx = this.el.getContext('2d');
    this.resize(this.props);
    this.draw();
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
    console.log('rendering', this.state.size);
    return (
      <canvas ref={el => this.el = el} width={width} height={height} />
    );
  }

  resize({size}) {
    const {width, height} = size;
    this.setState({
      size: {
        width: width === 'auto' ? this.el.offsetWidth : width,
        height: height === 'auto' ? this.el.offsetHeight : height,
      },
    });
  }

  draw() {
    console.log('drawing');
    const {ctx, props, state} = this;
    const {width, height} = state.size;
    const points = props.points.slice(0, limit);
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

