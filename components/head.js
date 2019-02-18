import React from 'react';
import Head from 'next/head';

export default () => (
  <div>
    <Head>
      <title>Little Bar Book</title>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
        integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
        crossOrigin="anonymous"
      />
      <link href="/static/base.css" rel="stylesheet" />
    </Head>
  </div>
);