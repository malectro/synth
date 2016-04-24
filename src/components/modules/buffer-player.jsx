/* @flow */

import _ from 'lodash';
import {assign} from 'sculpt';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import audio, {SAMPLE_RATE} from 'src/audio';

import SourcePlayer from 'src/components/modules/player.jsx';


export default class BufferSoundPlayer extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    points: Array<{
      x: number,
      y: number,
    }>,
    xyProps: Object,
    duration: number,
    loop: boolean,
  };

  static defaultProps = {
    xyProps: {},
    loop: false,
  };

  constructor(props) {
    super(props);

    this.adjust = _.debounce(this.adjust.bind(this), 200);
  }

  componentDidMount() {
    this.createBuffer(this.props.points);
  }

  componentWillReceiveProps(newProps) {
    const {points} = newProps;
    if (this.props.points !== points) {
      this.adjust(points);
    }
  }

  render() {
    const {points, xyProps, ...playerProps} = this.props;
    // NOTE (kyle): making a new xyProps object will break pure rendering
    playerProps.xyProps = assign(xyProps, {points});
    return (
      <SourcePlayer {...playerProps} onGetSource={this.handleGetSource.bind(this)} ref={el => this.player = el} />
    );
  }

  adjust(points) {
    this.createBuffer(points);
    if (this.player.playing()) {
      this.player.stop();
      this.player.start();
    }
  }

  createBuffer(points) {
    const buffer = audio.createBuffer(1, points.length, SAMPLE_RATE);
    const data = buffer.getChannelData(0);

    points.forEach(({x, y}, i) => {
      data[i] = y;
    });

    this.buffer = buffer;
  }

  handleGetSource() {
    const {duration} = this.props;
    const source = audio.createBufferSource();
    source.buffer = this.buffer;
    return source;
  }
}

