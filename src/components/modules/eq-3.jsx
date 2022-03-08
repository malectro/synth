/* @flow */

import React, {Component} from 'react';

import audio, {SAMPLE_RATE} from '../../audio.ts';

import Slider from '../ui/slider.tsx';

import css from './eq-3.module.css';


export default class EQ3 extends Component {
  state = {
    highshelf: null,
    peaking: null,
    lowshelf: null,
    mounted: false,
  };

  componentDidMount() {
    const highshelf = audio.createBiquadFilter();
    highshelf.type = 'highshelf';
    highshelf.frequency.value = 10000;
    highshelf.gain.value = 0;

    const peaking = audio.createBiquadFilter();
    peaking.type = 'peaking';
    peaking.frequency.value = 1000;
    peaking.gain.value = 0;
    // TODO not sure what default is here
    //peaking.Q.value = 0;

    const lowshelf = audio.createBiquadFilter();
    lowshelf.type = 'lowshelf';
    lowshelf.frequency.value = 100;
    lowshelf.gain.value = 0;

    highshelf.connect(peaking);
    peaking.connect(lowshelf);

    console.log('ho');
    this.setState({
      highshelf,
      peaking,
      lowshelf,
      mounted: true,
    }, () => {
      console.log('het', this.state);
      this.connectSource(this.props.source);
      this.connectOutput(this.props.output);
    });
  }

  componentWillReceiveProps({source, output}) {
    if (source !== this.props.source) {
      this.disconnectSource(this.props.source);
      this.connectSource(source);
    }
    if (output !== this.props.output) {
      this.disconnectOutput(this.props.output);
      this.connectOutput(output);
    }
  }

  componentWillUnmount() {
    this.disconnectSource(this.props.source);
    this.disconnectOutput(this.props.output);
  }

  connectSource(source) {
    const {highshelf} = this.state;
    if (source && highshelf) {
      console.log('hi', source, this.state.highshelf);
      source.connect(highshelf);
    }
  }
  connectOutput(output) {
    const {lowshelf} = this.state;
    if (output && lowshelf) {
      lowshelf.connect(output);
    }
  }
  disconnectSource(source) {
    const {highshelf} = this.state;
    if (source && highshelf) {
      source.connect(highshelf);
    }
  }
  disconnectOutput(output) {
    const {lowshelf} = this.state;
    if (output && lowshelf) {
      output.connect(lowshelf);
    }
  }

  render() {
    const {mounted, highshelf, peaking, lowshelf} = this.state;

    if (!mounted) {
      return null;
    }

    return (
      <div className={css.container}>
        <Slider orientation="vertical" min={-10} max={10} value={lowshelf.gain.value} onChange={this.handleLowshelfSliderChange} />
        <Slider orientation="vertical" min={-10} max={10} value={peaking.gain.value} onChange={this.handlePeakingSliderChange} />
        <Slider orientation="vertical" min={-10} max={10} value={highshelf.gain.value} onChange={this.handleHighshelfSliderChange} />
      </div>
    );
  }

  handleSliderChange(filterType, value) {
    const filter = this.state[filterType];
    filter.gain.value = value;
    this.setState({
      [filterType]: filter,
    });
  }
  handleLowshelfSliderChange = this.handleSliderChange.bind(this, 'lowshelf');
  handlePeakingSliderChange = this.handleSliderChange.bind(this, 'peaking');
  handleHighshelfSliderChange = this.handleSliderChange.bind(this, 'highshelf');
}
