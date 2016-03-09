/* @flow */

import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import audio, {SAMPLE_RATE} from 'src/audio';
import css from 'src/components/synths/synth.css';
import XYPlot from './XYPlot.jsx';


export default class SoundPlayer extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    points: Array<{
      x: number,
      y: number,
    }>,
  };

  constructor(props) {
    super(props);

    this.state = {
      playing: null,
    };

    this.play = this.play.bind(this);
  }

  componentDidMount() {
    const {points} = this.props;
    const buffer = audio.createBuffer(1, points.length, SAMPLE_RATE);
    const data = buffer.getChannelData(0);

    points.forEach(({x, y}, i) => {
      data[i] = y;
    });

    this.buffer = buffer;
  }

  render() {
    return (
      <div className={css.player}>
        <XYPlot points={this.props.points} />
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
      </div>
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
