/* @flow */

import React, {PureComponent} from 'react';

import css from './envelope.css';

import Canvas from 'src/components/ui/canvas.jsx';


const nodeWidth = 10;
const inset = nodeWidth / 2;

export default class Envelope extends PureComponent {
  props: {
    points: {
      x: number,
      y: number,
    }[],
  };

  static defaultProps = {
    points: [],
  };

  constructor(...args) {
    super(...args);

    this.state = {
      size: {
        width: 0,
        height: 0,
      },
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    const {width, height} = this.state.size;

    const insetWidth = width - inset * 2;
    const insetHeight = height - inset * 2;

    console.log('render', width, height);

    return (
      <div className={css.container}>
        <Canvas ref={canvas => this.canvas = canvas} onResize={this.handleResize} />
        { this.props.points.map(({x, y}, i) => (
          <div className={css.handle} key={i} style={{left: x * insetWidth, top: insetHeight - y * insetHeight}} />
        )) }
      </div>
    );
  }

  handleResize(size, ho) {
    console.log('hi', size);
    this.setState({size});
  }

  draw() {
    const {el, ctx} = this.canvas;
    const {width, height} = el;

    const insetWidth = width - inset * 2;
    const insetHeight = height - inset * 2;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    ctx.clearRect(0, 0, width, height);

    ctx.save();

    ctx.translate(inset, inset);
    ctx.moveTo(0, insetHeight);

    this.props.points.forEach(({x, y}) => {
      console.log('line', x, y, x * insetWidth, y * -insetHeight);
      ctx.lineTo(x * insetWidth, insetHeight - y * insetHeight);
    });

    ctx.lineTo(insetWidth, insetHeight);
    ctx.stroke();

    ctx.restore();
  }
}

