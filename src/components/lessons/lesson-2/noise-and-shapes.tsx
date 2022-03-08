import _ from 'lodash';
import React, {Component} from 'react';

import css from './noise-and-shapes.module.css';


export default class NoiseAndShapes extends Component {
  render() {
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <div className={css.row}>
            <NoiseCanvas />
            <NoiseCanvas />
          </div>

          <div className={css.row}>
            <svg className={css.quad} viewBox="0 0 10 10">
              <path d="M2,2 L 8,2 L 8,8 L 2,8z" />
            </svg>
            <svg className={css.quad} viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="3" />
            </svg>
          </div>

          <figcaption>On top there are two pictures of noise that, despite being unique, appear the same. Below them are a circle and square, which are blatantly different.</figcaption>
        </div>
      </figure>
    );
  }
}

class NoiseCanvas extends Component {
  componentDidMount() {
    const width = this.canvas.width = this.canvas.offsetWidth;
    const height = this.canvas.height = this.canvas.offsetHeight;

    const ctx = this.canvas.getContext('2d');
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let i = 0; i < data.length; i += 4) {
      const rando = Math.random();
      if (rando > 0.5) {
        data[i] = data[i+1] = data[i+2] = data[i+3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  render() {
    return <div className={css.quad}>
      <canvas className={css.canvas} ref={el => this.canvas = el}></canvas>
    </div>;
  }
}

