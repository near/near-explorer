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
      };

      bubble.latitude = geoData[index].lat;
      bubble.longitude = geoData[index].lon;
      bubble.name = element.accountId;
      bubble.isValidator = element.isValidator;
      bubble.peerCount = element.peerCount;
      bubble.radius = 10;
      bubble.fillKey = element.isValidator ? 'validatorBubbleFill' : 'nonValidatorBubbleFill';

      bubbles.push(bubble);
    });

    this.setState({ nodesData: bubbles });
  }
  
 

  render() {
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
          bubbles={this.state.nodesData}
          bubbleOptions={{
            borderWidth: 1,
            borderColor: '#a5a5a5',
            popupTemplate: (data: IBubble) => { // This function should just return a string
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
