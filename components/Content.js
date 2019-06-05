import { Container } from "react-bootstrap";

const Content = () => (
  <Container className="content-container near-main-container" fluid="true">
    <style jsx global>{`
      .content-container {
        background: white;
      }
    `}</style>
  </Container>
);

export default Content;
