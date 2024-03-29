/* @flow */

import React, {PureComponent} from 'react';

import Canvas from '../ui/canvas.tsx';


export default class XYPlot extends PureComponent {
  props: {
    className?: string | null,
    points: {
      x: number,
      y: number,
    }[],
    sample: 'average' | 'one',
    choose: 'peak' | 'one',
    scale: number,
    limit: number,
    repeatAt: number,
  };

  static defaultProps = {
    sample: 'average',
    scale: 0.05,
    limit: 200,
    repeatAt: 200,
  };

  constructor(...args) {
    super(...args);

    this.draw = this.draw.bind(this);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    return (
      <Canvas className={this.props.className} ref={canvas => this.canvas = canvas} onResize={this.draw} />
    );
  }

  draw() {
    const {ctx} = this.canvas;
    const {width, height} = this.canvas.size;
    const {limit, points} = this.props;

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
    ctx.fillStyle = 'rgb(150, 150, 150)';

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

    const sampler = sample === 'average' ? this.sampleAverage.bind(this) : this.sampleOne.bind(this);

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

