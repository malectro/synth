/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import audio, {SAMPLE_RATE} from 'src/audio';
import css from './synth.css';


export default class Module extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.analyser = audio.createAnalyser();
    this.analyser.fftSize = 2048;

    this.bufferLength = this.analyser.frequencyBinCount;
    this.buffer = new Float32Array(this.bufferLength);

    const source = this.source = audio.createOscillator();
    source.type = 'sine';
    source.frequency.value = 300;
    source.connect(this.analyser);
    source.start();
    this.draw();
  }

  draw() {
    const {ctx} = this.canvas;
    const {width, height} = this.canvas.el;

    this.analyser.getFloatFrequencyData(this.buffer);

    console.log(this.buffer);

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 100, 100);
  }

  render() {
    return (
      <Canvas ref={canvas => this.canvas = canvas} onResize={this.handleResize} />
    );
  }

  handleResize() {
    this.draw();
  }
}

class Canvas extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    onResize: Function,
  };

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    this.ctx = this.el.getContext('2d');
    this.resize();
  }

  resize() {
    this.setState({
      width: this.el.offsetWidth,
      height: this.el.offsetHeight,
    }, () => {
      this.props.onResize();
    });
  }

  render() {
    const {width, height} = this.state;
    return (
      <canvas ref={el => this.el = el} width={width} height={height} {...this.props} />
    );
  }
}

