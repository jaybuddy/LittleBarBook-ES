// This is the Link API
import Head from '../components/head';
import Navigation from '../components/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link'

const Index = () => (
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
        </Col>
      </Row>
    </Container>
  </div>
);

export default Index