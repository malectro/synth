/* @flow */

import _ from 'lodash';
import React, {PropTypes} from 'react';
import PureComponent from 'react-pure-render/component';
import audio, {SAMPLE_RATE} from 'src/audio';


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
      <figure>
        <XYPlot points={this.state.points} />
        <button onClick={this.play}>Play</button>
      </figure>
    );
  }

  play() {
    const source = audio.createBufferSource();
    source.buffer = this.buffer;
    source.connect(audio.destination);
    source.start(0);
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

