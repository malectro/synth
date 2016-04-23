/* @flow */

import React from 'react';

import './base.global.css';
import appCss from './app.css';


type Props = {
  children: Object,
};

export default function App({children}: Props) {
  return <div className={appCss.top}>
    {children}
  </div>;
}

