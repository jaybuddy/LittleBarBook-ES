// This is the Link API
import Head from '../components/head';
import Navigation from '../components/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link'
import { connect } from "react-redux";
import Actions from "../actions";

const mapDispatchToProps = dispatch => {
  return {
    addCount: () => dispatch(Actions.addCount())
  };
};

const mapStateToProps = state => {
  return {
    count: state.count
  };
};

class Index extends React.Component {
  static getInitialProps({store, isServer, pathname, query}) {
      //store.dispatch({type: 'FOO', payload: 'foo'}); // component will be able to read from store's state when rendered
      return {custom: 'custom'}; // you can pass some custom props to component from here
  }
  render() {
      return (
        <div>
          <Head />
          <Container fluid={true} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Row>
              <Col>
                <Navigation />
                <Link href="/login">
                  <a>Login Page</a>
                </Link>
                <p>Hello Next.js</p>
                <button onClick={() => this.props.addCount()}>Add</button>
                <h1> {this.props.count}</h1>
              </Col>
            </Row>
          </Container>
        </div>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);