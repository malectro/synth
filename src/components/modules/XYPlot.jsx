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
    this.drawScaled();
  }

  componentWillReceiveProps(props) {
    if (props.size !== this.props.size) {
      this.resize(props);
    }
  }

  componentDidUpdate() {
    this.drawScaled();
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
    const {repeatAt, limit} = props;
    const length = Math.min(repeatAt, limit, props.points.length);
    const points = props.points;
    const halfHeight = height / 2;
    const margin = 2;
    const stepSize = (width / points.length);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(150, 150, 150, 0.1)`;

    for (let i = 0, j = 0; i < points.length; i++, j++) {
      const {x, y} = points[j];
      const pos = i * stepSize;
      this.ctx.fillRect(pos, halfHeight, stepSize - margin, y * halfHeight);
    }
  }

  drawScaled() {
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
      for (let i = 0, j = 0; i < limit; i++, j++) {
        const index = Math.floor(i * points.length * scale / limit);
        const {x, y} = points[Math.floor(index / scale)];
        const pos = i * stepSize;
        this.ctx.fillRect(pos, halfHeight, stepSize - margin, y * halfHeight);
      }
    } else {
      for (let i = 0, j = 0; i < limit; i++, j++) {
        if (j >= points.length * scale) {
          j = 0;
        }
        const {x, y} = points[Math.floor(j / scale)];
        const pos = i * stepSize;
        this.ctx.fillRect(pos, halfHeight, stepSize - margin, y * halfHeight);
      }
    }
  }
}

