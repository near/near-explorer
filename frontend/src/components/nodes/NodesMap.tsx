import dynamic from 'next/dynamic'
import React from "react";

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import autoRefreshHandler from "../utils/autoRefreshHandler";

import { OuterProps } from "../accounts/Accounts";

const Datamap = dynamic(() => import("react-datamaps"), { ssr: false });

interface Props extends OuterProps {
  role: string;
}
export default class extends React.Component<Props> {
  static defaultProps = {
    count: 15,
  };

  fetchNodes = async () => {
    console.log('fetchData');
    return await new NodesApi().getNodesForMap();
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

interface IBubble {
  latitude: string;
  longitude: string;
  name: string;
  isValidator: number;
  peerCount: string;
  radius: number;
  fillKey: string;
  agentName: string;
  version: string;
  build: string;
  nodeId: string;
  blockNr: number;
  location: string;
}

class NodesMap extends React.Component<InnerProps> {
  constructor(props: InnerProps) {
    super(props);
    this.state = { nodesData: [] };
  }

  async componentDidMount() {
    const nodes = this.props.items;
    const IPsArray: string[] = [];
    nodes.forEach(item => {
      IPsArray.push(item.ipAddress);
    });

    const url = "http://ip-api.com/batch?fields=status,message,country,city,lat,lon,timezone,query"
    let geoData = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(IPsArray)
    });
    geoData = await geoData.json();
    const bubbles: IBubble[] = [];

    nodes.forEach((element:any, index:number) => {
      const bubble: IBubble = {
        latitude: '',
        longitude: '',
        name: '',
        isValidator: 0,
        peerCount: '',
        radius: 0,
        fillKey: '',
        agentName: '',
        version: '',
        build: '',
        nodeId: '',
        blockNr: 0,
        location: '',
      };

      bubble.latitude = geoData[index].lat;
      bubble.longitude = geoData[index].lon;
      bubble.location = geoData[index].city;
      bubble.name = element.accountId;
      bubble.isValidator = element.isValidator;
      bubble.peerCount = element.peerCount;
      bubble.agentName = element.agentName;
      bubble.version = element.agentVersion;
      bubble.build = element.agentBuild;
      bubble.nodeId = element.nodeId;
      bubble.blockNr = element.lastHeight;
      bubble.radius = 4;
      bubble.fillKey = element.isValidator ? 'validatorBubbleFill' : 'nonValidatorBubbleFill';

      bubbles.push(bubble);
    });

    this.setState({ nodesData: bubbles });
  }
  
 

  render() {
    console.log("nodes data:", this.state.nodesData);
    console.log("items data:", this.props.items);
    return (
      <div className="mapBackground">
        <div className="mapWrapper">
          <Datamap
            responsive
            geographyConfig={{
              popupOnHover: false,
              highlightOnHover: false,
              borderColor: '#1C1D1F',
            }}
            fills={{
              defaultFill: '#1C1D1F',
              validatorBubbleFill: '#8DD4BD',
              nonValidatorBubbleFill: '#0000ff',
            }}
            bubbles={this.state.nodesData}
            bubbleOptions={{
              borderWidth: 1,
              borderColor: '#1C1D1F',
              fillOpacity: 0.6,
              popupTemplate: (data: IBubble) => { // This function should just return a string
                return `
                <div className="hoverinfo" style="border: none; text-align: left; padding: 20px 0px 0px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16); border-radius: 8px; color: white; background-color: #343A40; max-width: 300px">` +
                  `<div style="color: #8DD4BD; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound; padding:0 20px 8px">` + `@` + data.name + '</div> ' +
                  `<div style="display: flex; flex-direction: row; width: 100%; flex-wrap: nowrap; padding: 0 20px 16px">` +
                    `<div style="color: #ffffff; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; white-space: nowrap">` + data.agentName + ' | ver.' + data.version + ' build ' + data.build + `</div>` + 
                    `<div style="color: #ffffff; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; opacity: 0.6; text-overflow: ellipsis; padding-left: 4px; overflow: hidden;">` + data.nodeId.split(':')[1] + `</div>` +
                  `</div>` +
                  `<div style="background-color: rgba(0, 0, 0, 0.2); display: flex; flex-direction: row; justify-content: space-between; padding: 16px 20px; border-radius: 0 0 8px 8px">` +
                    `<div>` + 
                      `<div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">` + 'Block#' + `</div>` +
                      `<div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">` + data.blockNr + `</div>` +
                    `</div>` +
                    `<div>` +
                      `<div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">` + 'Last seen' + `</div>` +
                      `<div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">` + '20s ago' + `</div>` +
                    `</div>` +
                    `<div>` +
                      `<div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">` + 'Location' + `</div>` +
                      `<div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">` + data.location + `</div>` +
                    `</div>` +
                  `</div>` + 
                `</div>`;
              },
            }}
          />
        </div>
        <style jsx global>{`
            .mapWrapper {
              margin: 0 auto;
              max-width: 75%;
            }
            .mapBackground {
              background-color: #24272a;
            }
          `}
        </style>
      </div>
    );
  }
}
