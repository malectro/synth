import React, {Component} from 'react';

import css from './envelope.css';

import Canvas from 'src/components/ui/canvas.jsx';


export default class Envelope extends Component {
  render() {
    return (
      <div className={css.container}>
        <Canvas />
      </div>
    );
  }
}

