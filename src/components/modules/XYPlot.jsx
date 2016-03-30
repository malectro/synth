/* @flow */

import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';


export default class XYPlot extends Component {
  props: {
    points: Array<{
      x: number,
      y: number,
    }>,
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
    const {points, scale, repeatAt, limit} = props;
    const count = 200;
    const halfHeight = height / 2;
    const margin = 2;
    const stepSize = (width / limit);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgb(150, 150, 150)`;

    if (points.length * scale > limit) {
      const ratio = points.length / limit;
      const blurRadius = Math.floor(ratio);
      for (let i = 0; i < limit; i++) {
        const index = Math.floor(i * ratio);
        const avg = this.getBlur(index, blurRadius);
        const pos = i * stepSize;
        this.ctx.fillRect(pos, halfHeight, stepSize - margin, avg * halfHeight);
      }
    } else {
      const ratio = 1 / scale;
      const radius = Math.floor(ratio);
      for (let i = 0, j = 0; i < limit; i++, j++) {
        if (j >= points.length * scale) {
          j = 0;
        }
        const index = Math.floor(j * ratio);
        const avg = this.getBlur(index, radius);
        const {x, y} = points[index];
        const pos = i * stepSize;
        this.ctx.fillRect(pos, halfHeight, stepSize - margin, avg * halfHeight);
      }
    }
  }

  getBlur(index, radius) {
    const {points} = this.props;
    const min = Math.max(0, index - radius);
    const max = Math.min(points.length, index + radius);
    let total = 0;

    for (let i = min; i < max; i++) {
      total += points[i].y;
    }

    return total / (radius * 2 + 1);
  }
}

