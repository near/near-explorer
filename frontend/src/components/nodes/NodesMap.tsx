import React from "react";
import dynamic from 'next/dynamic'

const Datamap = dynamic(() => import("react-datamaps"), { ssr: false });

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import autoRefreshHandler from "../utils/autoRefreshHandler";

import { OuterProps } from "../accounts/Accounts";

const radius = 4;

interface Props extends OuterProps {
  role: string;
}
export default class extends React.Component<Props> {
  static defaultProps = {
    count: 15,
  };

  fetchNodes = async (count: number, paginationIndexer?: string) => {
    return await new NodesApi().getNodes(
      count,
      this.props.role,
      paginationIndexer
    );
  };

  componentDidUpdate(prevProps: any) {
    if (this.props.role !== prevProps.role) {
      this.autoRefreshNodes = autoRefreshHandler(NodesMap, this.config);
    }
  }

  config = {
    fetchDataFn: this.fetchNodes,
    count: this.props.count,
    category: "Node",
  };

  autoRefreshNodes = autoRefreshHandler(NodesMap, this.config);

  render() {
    return <this.autoRefreshNodes />;
  }
}

interface InnerProps {
  items: N.NodeInfo[];
}

const dummyNodes = [
  {
    accountId: "node3",
    agentBuild: "db7845e7",
    agentName: "near-rs",
    agentVersion: "1.0.0",
    ipAddress: "188.166.23.89",
    isValidator: 1,
    lastHash: "3zEcSuvoSfDBvAZRNWqhLDD9UAPVVvPzctGrDvZdwkXa",
    lastHeight: 81426,
    lastSeen: 1591117160604,
    moniker: "node3",
    nodeId: "ed25519:ydgzeXHJ5Xyt7M1gXLxqLBW1Ejx6scNV5Nx2pxFM8su",
    peerCount: "7",
    signature: "ed25519:6KGJTy2mGwfj7jVqx79sHDAijUCUXXeDmqrYi439ZTyCsw2HB3AYDscnFkeDuKu8ZmkWMry3F3PrGU7fEvtbjw9",
    status: "NoSync",
    latitude: 37.2966853,
    longitude: -122.0975973,
  },
  {
    accountId: "node4",
    agentBuild: "db7125e7",
    agentName: "near-rs-pv",
    agentVersion: "1.0.0",
    ipAddress: "188.166.23.82",
    isValidator: 0,
    lastHash: "3zEcSuvoSfDBvAZRNWqhLDD9UAPVVvPzctGrDvZdwkXa",
    lastHeight: 81426,
    lastSeen: 1591117160604,
    moniker: "node4",
    nodeId: "ed25519:ydgzeXHJ5Xyt7M1gXLxqLBW1Ejx6scNV5Nx2pxFM8su",
    peerCount: "12",
    signature: "ed25519:6KGJTy2mGwfj7jVqx79sHDAijUCUXXeDmqrYi439ZTyCsw2HB3AYDscnFkeDuKu8ZmkWMry3F3PrGU7fEvtbjw9",
    status: "NoSync",
    latitude: 38.9541077,
    longitude: -77.496101,
  },
  {
    accountId: "node1",
    agentBuild: "db7845e7",
    agentName: "near-rs-other",
    agentVersion: "1.0.0",
    ipAddress: "188.166.23.80",
    isValidator: 1,
    lastHash: "3zEcSuvoSfDBvAZRNWqhLDD9UAPVVvPzctGrDvZdwkXa",
    lastHeight: 81426,
    lastSeen: 1591117160604,
    moniker: "node1",
    nodeId: "ed25519:ydgzeXHJ5Xyt7M1gXLxqLBW1Ejx6scNV5Nx2pxFM8su",
    peerCount: "1",
    signature: "ed25519:6KGJTy2mGwfj7jVqx79sHDAijUCUXXeDmqrYi439ZTyCsw2HB3AYDscnFkeDuKu8ZmkWMry3F3PrGU7fEvtbjw9",
    status: "NoSync",
    latitude: 51.501364,
    longitude: -0.1440787,
  },
  {
    accountId: "test",
    agentBuild: "db7845e7",
    agentName: "near-rs-backup",
    agentVersion: "1.0.0",
    ipAddress: "188.166.23.19",
    isValidator: 1,
    lastHash: "3zEcSuvoSfDBvAZRNWqhLDD9UAPVVvPzctGrDvZdwkXa",
    lastHeight: 81426,
    lastSeen: 1591117160604,
    moniker: "test",
    nodeId: "ed25519:ydgzeXHJ5Xyt7M1gXLxqLBW1Ejx6scNV5Nx2pxFM8su",
    peerCount: "23",
    signature: "ed25519:6KGJTy2mGwfj7jVqx79sHDAijUCUXXeDmqrYi439ZTyCsw2HB3AYDscnFkeDuKu8ZmkWMry3F3PrGU7fEvtbjw9",
    status: "NoSync",
    latitude: -34.6157142,
    longitude: -58.5033602,
  },
  {
    accountId: "test2",
    agentBuild: "db7845e7",
    agentName: "near-rs-boom",
    agentVersion: "1.0.0",
    ipAddress: "188.166.23.89",
    isValidator: 1,
    lastHash: "3zEcSuvoSfDBvAZRNWqhLDD9UAPVVvPzctGrDvZdwkXa",
    lastHeight: 81426,
    lastSeen: 1591117160604,
    moniker: "test2",
    nodeId: "ed25519:ydgzeXHJ5Xyt7M1gXLxqLBW1Ejx6scNV5Nx2pxFM8su",
    peerCount: "14",
    signature: "ed25519:6KGJTy2mGwfj7jVqx79sHDAijUCUXXeDmqrYi439ZTyCsw2HB3AYDscnFkeDuKu8ZmkWMry3F3PrGU7fEvtbjw9",
    status: "NoSync",
    latitude: 22.3574372,
    longitude: 113.8408289,
  },
];

class NodesMap extends React.Component<InnerProps> {
  
  prepareBubbles(nodes: any[]) {
    const bubbles: { latitude: string; longitude: string; name: string; isValidator: number; peerCount: string; radius: number; fillKey: string; }[] = [];
    nodes.forEach(item => {
      const bubble = {
        latitude: '',
        longitude: '',
        name: '',
        isValidator: 0,
        peerCount: '',
        radius: 0,
        fillKey: '',
      };
      bubble.latitude = item.latitude;
      bubble.longitude = item.longitude;
      bubble.name = item.agentName;
      bubble.isValidator = item.isValidator;
      bubble.peerCount = item.peerCount;
      bubble.radius = 10;
      bubble.fillKey = item.isValidator ? 'validatorBubbleFill' : 'nonValidatorBubbleFill';

      bubbles.push(bubble);
    });
    return bubbles;
  }

  render() {
    const { items } = this.props;
    console.log(items);
    return (
      <div>
        <Datamap
          responsive
          geographyConfig={{
            popupOnHover: false,
            highlightOnHover: false
          }}
          fills={{
            defaultFill: '#24272a',
            validatorBubbleFill: '#00ff00',
            nonValidatorBubbleFill: '#0000ff',
          }}
          bubbles={this.prepareBubbles(dummyNodes)}
          bubbleOptions={{
            borderWidth: 1,
            borderColor: '#a5a5a5',
            popupTemplate: (data) => { // This function should just return a string
              return `
              <div class="hoverinfo" style="border: none; text-align: left; padding: 6px 10px; box-shadow: 0 2px 30px 0 rgba(0,0,0,0.40); border-radius: 4px; color: white; background-color: #24272a;">` +
                `<div>` + `Name: ` + data.name + '</div> ' +
                `<div>` + `Peers: ` + data.peerCount + `</div>` + 
                `<div>` + `Is validator: ` + `${data.isValidator ? 'Yes' : 'No'}` + `</div>` + 
              `</div>`;
            },
          }}
        />
      </div>
    );
  }
}
