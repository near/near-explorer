import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import NodeStatsProvider from "../context/NodeStatsProvider";

import Search from "../components/utils/Search";
import DashboardNode from "../components/dashboard/DashboardNode";

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>Near Explorer | Dashboard</title>
        </Head>
        <Container>
          <h1 style={{ marginTop: "72px" }}>
            <span style={{ color: "#00C1DE" }}>Explore</span> the
          </h1>
          <h1>NEAR Blockchain.</h1>
          <div className="inner-content">
            <Search dashboard />
            <NodeStatsProvider>
              <DashboardNode />
            </NodeStatsProvider>
          </div>
          <style jsx global>{`
            .inner-content {
              margin: 32px 100px;
            }
            h1 {
              font-size: 38px;
              line-height: 46px;
            }
          `}</style>
        </Container>
      </>
    );
  }
}
