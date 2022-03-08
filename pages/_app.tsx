import '../src/styles/base.global.css'
import appCss from '../src/components/app.module.css';

export default function MyApp({ Component, pageProps }) {
  return <div className={appCss.top}>
    <Component {...pageProps} />
  </div>;
}
