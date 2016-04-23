/* @flow */

import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';


export default class XYPlot extends Component {
  props: {
    className: ?string,
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
      <canvas className={this.props.className} ref={el => this.el = el} width={width} height={height} />
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
    const {limit, points} = props;

    const halfHeight = height / 2;
    const margin = 2;
    const stepSize = (width / limit);

    const {minPeaks, maxPeaks} = this.samplePoints();
    const range = {
      positive: this.getRange(maxPeaks),
      negative: this.getRange(minPeaks),
    };

    const positiveScale = 1 / (range.positive.max - range.positive.min);
    const negativeScale = 1 / (range.negative.max - range.negative.min);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgb(150, 150, 150)`;

    for (let i = 0; i < limit; i++) {
      const maxPeak = (maxPeaks[i] - range.positive.min) * positiveScale;
      const minPeak = (range.negative.max - minPeaks[i]) * -negativeScale;
      const diff = maxPeak - minPeak;
      ctx.fillRect(i * stepSize,
                   minPeak * halfHeight + halfHeight,
                   stepSize - margin, diff * halfHeight);
    }
  }

  samplePoints() {
    const maxPeaks = [];
    const minPeaks = [];

    const {points, limit, sample} = this.props;
    const ratio = points.length / limit;
    const span = Math.floor(ratio);

    const sampler = sample === 'average' ? ::this.sampleAverage : ::this.sampleOne;

    if (limit < points.length) {
      for (let i = 0; i < limit; i++) {
        const index = Math.floor(i * ratio);
        sampler(i, index, span, minPeaks, maxPeaks);
      }
    } else {
      for (let i = 0, j = 0; i < limit; i++, j++) {
        if (j === points.length) {
          j = 0;
        }
        this.sampleOne(i, j, 1, minPeaks, maxPeaks);
      }
    }

    return {maxPeaks, minPeaks};
  }

  sampleOne(i, index, span, minPeaks, maxPeaks) {
    const val = this.props.points[index].y;
    if (val > 0) {
      maxPeaks[i] = val;
      minPeaks[i] = 0;
    } else {
      minPeaks[i] = val;
      maxPeaks[i] = 0;
    }
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

    if (maxCount) {
      maxPeaks[i] = maxPeaks[i] / maxCount;
    }
    if (minCount) {
      minPeaks[i] = minPeaks[i] / minCount;
    }
  }

  getRange(points) {
    let min = Infinity;
    let max = -Infinity;

    const limit = points.length;

    for (let i = 0; i < limit; i++) {
      const val = points[i];
      if (val > max) {
        max = val;
      }
      if (val < min) {
        min = val;
      }
    }

    return {max, min};
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

