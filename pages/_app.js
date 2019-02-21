import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import withRedux from 'next-redux-wrapper';
import reducer from '../reducers';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

const initStore = () => createStore(
  reducer,
  {},
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
);

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <ReduxToastr
            timeOut={4000}
            newestOnTop={true}
            preventDuplicates
            position="top-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
            closeOnToastrClick
          />
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(MyApp);
