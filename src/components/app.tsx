import React from 'react';

import appCss from './app.module.css';


type Props = {
  children: Object,
};

export default function App({children}: Props) {
  return <div className={appCss.top}>
    {children}
  </div>;
}

