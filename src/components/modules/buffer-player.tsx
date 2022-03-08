/* @flow */

import _ from 'lodash';
import {assign} from 'sculpt';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import audio, {SAMPLE_RATE} from '../../audio.ts';

import XYPlot from './XYPlot.tsx';
import SourcePlayer from './player.tsx';


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
    return (
      <SourcePlayer {...playerProps} onGetSource={this.handleGetSource.bind(this)} ref={el => this.player = el}>
        <XYPlot {...xyProps} points={points} />
      </SourcePlayer>
    );
  }

  adjust(points) {
    this.createBuffer(points);
    this.player.refresh();
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

