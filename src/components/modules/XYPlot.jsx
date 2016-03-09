/* @flow */

import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';


const limit = 200;
export default class XYPlot extends Component {
  props: {
    points: Array<{
      x: number,
      y: number,
    }>,
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
    const points = props.points.slice(0, limit);
    const halfHeight = height / 2;
    const margin = 2;
    const stepSize = (width / points.length);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'gray';
    points.forEach(({x, y}) => {
      const pos = x * stepSize;
      this.ctx.fillRect(pos, halfHeight, stepSize - margin, y * halfHeight);
    });
  }
}

