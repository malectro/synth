/* @flow */

import _ from 'lodash';
import React, {PropTypes} from 'react';
import PureComponent from 'react-pure-render/component';


const count = 200;
export default class Module extends PureComponent {
  constructor(props) {
    super(props);

    const points = (new Array(count)).map(() => Math.random() * 2 - 1);

    this.state = {points};
  }

  render() {
    return (
      <figure>
        <XYPlot points={this.state.points} />
      </figure>
    );
  }
}


const [width, height] = [800, 200];
class XYPlot extends PureComponent {
  props: {
    points: Array<{
      x: number,
      y: number,
    }>,
  };

  componentDidMount() {
    this.ctx = this.el.getContext('2d');
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    return (
      <canvas ref={(el) => this.el = el} width={width} height={height} />
    );
  }

  draw() {
    const {ctx} = this;
    const {points} = this.props;
    const halfHeight = height / 2;
    const margin = 2;
    const stepSize = (width / points.length) - margin;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'gray';
    points.forEach(({x, y}) => (
      this.ctx.fillRect(x, y + halfHeight, x + stepSize, halfHeight)
    ));
  }
}

