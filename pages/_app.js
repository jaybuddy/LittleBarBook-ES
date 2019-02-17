import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import App, {Container} from "next/app";
import {Provider} from "react-redux";
import withRedux from "next-redux-wrapper";
import reducer from '../reducer';

const exampleInitialState = {
  count: 0,
};

const initStore = (initialState = exampleInitialState) => {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
};

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
      // // we can dispatch from here too
      // ctx.store.dispatch({type: 'FOO', payload: 'foo'});
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return {pageProps};
  }

  render() {
    const {Component, pageProps, store} = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withRedux(initStore)(MyApp);