/* @flow */

import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';


export default class XYPlot extends Component {
  props: {
    points: {
      x: number,
      y: number,
    }[],
    sample: 'average' | 'one',
    choose: 'peak' | 'one',
    scale: number,
    limit: number,
    repeatAt: number,
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
    sample: 'average',
    scale: 0.05,
    limit: 200,
    repeatAt: 200,
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

  shouldComponentUpdate = shouldPureComponentUpdate;

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
    const {ctx, props, state} = this;
    const {width, height} = state.size;
    const {limit} = props;

    const halfHeight = height / 2;
    const margin = 2;
    const stepSize = (width / limit);

    const {minPeaks, maxPeaks} = this.samplePoints();

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgb(150, 150, 150)`;

    for (let i = 0; i < limit; i++) {
      const diff = maxPeaks[i] - minPeaks[i];
      ctx.fillRect(i * stepSize, minPeaks[i] * halfHeight + halfHeight, stepSize - margin, diff * halfHeight);
    }
  }

  samplePoints() {
    const maxPeaks = [];
    const minPeaks = [];

    const {points, limit, sample} = this.props;
    const ratio = points.length / limit;
    const span = Math.floor(ratio);

    console.log('sample', sample);

    const sampler = sample === 'average' ? ::this.sampleAverage : ::this.sampleOne;

    for (let i = 0; i < limit; i++) {
      const index = Math.floor(i * ratio);
      sampler(i, index, span, minPeaks, maxPeaks);
    }

    return {maxPeaks, minPeaks};
  }

  sampleOne(i, index, span, minPeaks, maxPeaks) {
    minPeaks[i] = Math.abs(this.props.points[index].y);
    maxPeaks[i] = -minPeaks[i];
  }

  sampleAverage(i, index, span, minPeaks, maxPeaks) {
    const {points} = this.props;
    const spanLimit = Math.min(index + span, points.length);

    let minCount = 0;
    let maxCount = 0;
    minPeaks[i] = maxPeaks[i] = 0;

    for (let j = index; j < spanLimit; j++) {
      const value = points[j].y;
      if (value > 0) {
        maxCount++;
        maxPeaks[i] += value;
      } else {
        minCount++;
        minPeaks[i] += value;
      }
    }

    maxPeaks[i] = maxPeaks[i] / maxCount;
    minPeaks[i] = minPeaks[i] / minCount;
  }

  getPeaks(index, size, peaks) {
    const MIN = 0;
    const MAX = 1;

    const {points} = this.props;
    const limit = Math.min(points.length, index + size);

    let max = 0;
    let min = 0;
    let val;

    for (let i = index; i < limit; i++) {
      val = points[i].y;
      if (val > max) {
        max = val;
      }
      if (val < min) {
        min = val;
      }
    }

    peaks[MIN] = min;
    peaks[MAX] = max;

    return peaks;
  }
}

