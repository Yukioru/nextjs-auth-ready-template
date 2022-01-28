import '@/styles/globals.css';

import App from 'next/app';
import { useState } from 'react';

import withSession from '@/lib/withSession';

function MyApp({ Component, pageProps, user }) {
  const [state] = useState({ user });
  return <Component {...pageProps} user={state.user} />
}

MyApp.getInitialProps = withSession(async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  let user = null;
  if (appContext.ctx.req) {
    const res = await fetch('http://localhost:3000/api/auth/user', {
      headers: {
        cookie: appContext.ctx.req ? appContext.ctx.req.headers.cookie : undefined,
      },
    }).then(res => res.json());
    ({ user } = res?.data || {});
  }
  return {
    ...appProps,
    user,
  };
});

export default MyApp
