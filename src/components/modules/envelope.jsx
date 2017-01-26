/* @flow */

import React, {PureComponent} from 'react';
import sculpt from 'sculpt';

import css from './envelope.css';

import Canvas from 'src/components/ui/canvas.jsx';


const nodeWidth = 10;
const inset = nodeWidth / 2;

type Points = {
  x: number,
  y: number,
}[];

export default class Envelope extends PureComponent {
  props: {
    points: Points,
    onChange: (points: Points) => void,
  };

  static defaultProps = {
    points: [],
    onChange: () => {},
  };

  mouseDownPosition = null;
  mouseDownHandlePosition = null;
  movingPoint = null;

  constructor(...args) {
    super(...args);

    this.state = {
      size: {
        width: 0,
        height: 0,
      },
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    // TODO (kyle): handle touch
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    const {width, height} = this.state.size;

    const insetWidth = width - inset * 2;
    const insetHeight = height - inset * 2;

    return (
      <div className={css.container}>
        <Canvas ref={canvas => this.canvas = canvas} onResize={this.handleResize} />
        { this.props.points.map(({x, y}, i) => (
          <div className={css.handle} key={i} style={{left: x * insetWidth, top: insetHeight - y * insetHeight}} onMouseDown={this.handleMouseDown.bind(this, i)} />
        )) }
      </div>
    );
  }

  handleResize(size, ho) {
    this.setState({size});
  }

  handleMouseDown(pointIndex, event) {
    const point = this.props.points[pointIndex];
    const {clientX, clientY} = event;

    this.mouseDownPosition = {clientX, clientY};
    this.mouseDownHandlePosition = point;
    this.movingPoint = pointIndex;

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(event) {
    const {x, y} = this.mouseDownHandlePosition;
    const {clientX, clientY} = event;
    const {width, height} = this.state.size;

    const clientDeltaX = clientX - this.mouseDownPosition.clientX;
    const clientDeltaY = clientY - this.mouseDownPosition.clientY;

    const deltaX = clientDeltaX / width;
    const deltaY = clientDeltaY / height;

    const points = sculpt(this.props.points, {
      [this.movingPoint]: {
        $assign: {
          x: x + deltaX,
          y: y - deltaY,
        },
      },
    });

    this.props.onChange(points);
  }

  handleMouseUp() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  draw() {
    const {el, ctx} = this.canvas;
    const {width, height} = this.state.size;

    const insetWidth = width - inset * 2;
    const insetHeight = height - inset * 2;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    ctx.clearRect(0, 0, width, height);

    ctx.save();

    ctx.translate(inset, inset);
    ctx.moveTo(0, insetHeight);

    this.props.points.forEach(({x, y}) => {
      ctx.lineTo(x * insetWidth, insetHeight - y * insetHeight);
    });

    ctx.lineTo(insetWidth, insetHeight);
    ctx.stroke();

    ctx.restore();
  }
}

