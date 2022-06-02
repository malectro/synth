/* @flow */

import React, {PureComponent} from 'react';


export default class Canvas extends PureComponent {
  props: {
    size: {
      width: number | 'auto',
      height: number | 'auto',
    },
    onResize: () => void,
  };

  static defaultProps = {
    size: {
      width: 'auto',
      height: 'auto',
    },
    onResize: () => {},
  };

  constructor(props) {
    super(props);

    const {width, height} = this.props.size;
    this.state = {
      size: {
        width: width === 'auto' ? null : width,
        height: height === 'auto' ? null : height,
      },
      devicePixelRatio: 1,
    };
  }

  componentDidMount() {
    this.ctx = this.el.getContext('2d');
    this.ctx.save();
    this.resize(this.props);
  }

  componentDidUpdate(props) {
    if (props.size !== this.props.size) {
      this.resize(props);
    }
  }

  render() {
    const {devicePixelRatio} = this.state;
    const {width, height} = this.state.size;
    const {size, onResize, ...props} = this.props;
    return (
      <canvas {...props} ref={el => this.el = el} width={width * devicePixelRatio} height={height * devicePixelRatio} />
    );
  }

  resize({size}) {
    const {width, height} = size;
    this.setState({
      size: {
        width: width === 'auto' ? this.el.offsetWidth : width,
        height: height === 'auto' ? this.el.offsetHeight : height,
      },
      devicePixelRatio: window.devicePixelRatio,
    }, () => {
      const {size, devicePixelRatio} = this.state;

      this.ctx.restore();
      this.ctx.save();
      this.ctx.scale(devicePixelRatio, devicePixelRatio);

      this.props.onResize(size);
    });
  }

  get size() {
    return this.state.size;
  }
}

