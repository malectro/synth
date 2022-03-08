/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import audio from '../../audio.ts';
import css from '../synths/synth.module.css';


export default class SoundPlayer extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    onGetSource?: Function,
    source?: Object,
    destination?: Object,
    duration: number,
    loop: boolean,
  };

  static defaultProps = {
    loop: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      playing: null,
    };

    this.play = this.play.bind(this);
  }

  render() {
    return (
      <div className={css.player}>
        {this.props.children}
        <button onClick={this.play}>
          <div>
            { !this.state.playing ?
              <svg viewBox="0 0 100 100">
                <path d="M 0 0 L 100 50 L 0 100 z" />
              </svg>
            :
              <svg viewBox="0 0 100 100">
                <rect x="0" y="0" width="100" height="100" />
              </svg>
            }
          </div>
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
    const {loop, duration} = this.props;
    const source = this.props.source || this.props.onGetSource();
    if (this.props.destination !== null) {
      source.connect(this.props.destination || audio.destination);
    }
    source.loop = loop;
    source.start();

    let timeout;
    if (!loop) {
      timeout = _.delay(() => {
        this.stop();
      }, duration * 1000);
    }

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

  refresh() {
    if (this.state.playing) {
      this.stop();
      this.start();
    }
  }
}

