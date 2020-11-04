import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import NodeStatsProvider from "../context/NodeStatsProvider";

import Search from "../components/utils/Search";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Dashboard</title>
        </Head>
        <Container>
          <h1>
            <span style={{ color: "#00C1DE" }}>Explore</span> the
          </h1>
          <h1>NEAR Blockchain.</h1>
          <div className="inner-content">
            <Search dashboard />
            <NodeStatsProvider>
              <DashboardHeader />
            </NodeStatsProvider>
          </div>
          <style jsx global>{`
            .inner-content {
              margin: 32px 80px;
            }
          `}</style>
        </Container>
      </>
    );
  }
}
