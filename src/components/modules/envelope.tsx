/* @flow */

import React, {PureComponent} from 'react';
import clamp from 'lodash/clamp';
import sculpt from 'sculpt';

import css from './envelope.module.css';

import Canvas from '../ui/canvas.tsx';


const nodeWidth = 10;
const inset = nodeWidth / 2;

type Points = {
  x: number,
  y: number,
}[];

export default class Envelope extends PureComponent {
  props: {
    points: Points,
    progress?: number,
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

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
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
          <div className={css.handle} key={i} style={{left: x * insetWidth, top: insetHeight - y * insetHeight}} onMouseDown={this.handleMouseDown.bind(this, i)} onTouchStart={this.handleTouchStart.bind(this, i)} />
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
    if (event.preventDefault) {
      event.preventDefault();
    }

    const {movingPoint} = this;
    const {x, y} = this.mouseDownHandlePosition;
    const {clientX, clientY} = event;
    const {width, height} = this.state.size;

    const clientDeltaX = clientX - this.mouseDownPosition.clientX;
    const clientDeltaY = clientY - this.mouseDownPosition.clientY;

    const deltaX = clientDeltaX / width;
    const deltaY = clientDeltaY / height;

    const newPoint = {
      x: clamp(x + deltaX, 0, 1),
      y: clamp(y - deltaY, 0, 1),
    };

    const newPoints = this.props.points.map((point, i) => {
      if (i < movingPoint) {
        if (point.x > newPoint.x) {
          point = {...point, x: newPoint.x};
        }
      } else if (i === movingPoint) {
        point = newPoint;
      } else if (i > movingPoint) {
        if (point.x < newPoint.x) {
          point = {...point, x: newPoint.x};
        }
      }
      return point;
    });

    this.props.onChange(newPoints);
  }

  handleMouseUp() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleTouchStart(pointIndex, event) {
    event.preventDefault();

    const point = this.props.points[pointIndex];
    const touch = event.changedTouches[0];
    const {clientX, clientY} = touch;

    this.mouseDownPosition = {clientX, clientY};
    this.mouseDownHandlePosition = point;
    this.movingPoint = pointIndex;

    window.addEventListener('touchmove', this.handleTouchMove, {passive: false});
    window.addEventListener('touchend', this.handleTouchEnd, {passive: false});
  }

  handleTouchMove(event) {
    event.preventDefault();

    const touch = event.changedTouches[0];
    this.handleMouseMove(touch);
  }

  handleTouchEnd(event) {
    event.preventDefault();

    const touch = event.changedTouches[0];

    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  draw() {
    const {el, ctx} = this.canvas;
    const {width, height} = this.state.size;
    const {points, progress} = this.props;

    const insetWidth = width - inset * 2;
    const insetHeight = height - inset * 2;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(inset, inset);

    ctx.beginPath();
    ctx.moveTo(0, insetHeight);

    points.forEach(({x, y}) => {
      ctx.lineTo(x * insetWidth, insetHeight - y * insetHeight);
    });

    ctx.lineTo(insetWidth, insetHeight);
    ctx.stroke();

    if (progress) {
      ctx.clip();
      ctx.fillStyle = '#444';
      ctx.beginPath();

      ctx.fillRect(0, 0, insetWidth * progress, insetHeight);
    }

    ctx.restore();
  }
}

