import React, {PureComponent} from 'react';

import css from './envelope.css';

import Canvas from 'src/components/ui/canvas.jsx';


export default class Envelope extends PureComponent {
  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    return (
      <div className={css.container}>
        <Canvas ref={canvas => this.canvas = canvas} />
      </div>
    );
  }

  draw() {
    const {el, ctx} = this.canvas;
  }
}

