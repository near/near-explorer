import dynamic from 'next/dynamic'
import moment from 'moment';
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
  agentName: string;
  version: string;
  build: string;
  nodeId: string;
  blockNr: number;
  lastSeen: number;
  location: string;
}

class NodesMap extends React.Component<InnerProps> {
  constructor(props: InnerProps) {
    super(props);
    this.state = { 
      nodesData: [],
      nodesType: "validators",
    };
  }

  async componentDidUpdate(prevProps: any) {
    if (prevProps.items !== this.props.items) {
      await this.fetchGeo();
    }
  }

  async componentDidMount() {
   await this.fetchGeo();
  }
  
  async fetchGeo() {
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

    nodes.forEach((element: any, index: number) => {
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
        lastSeen: 0,
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
      bubble.lastSeen = element.lastSeen;
      bubble.radius = 4;
      bubble.fillKey = element.isValidator ? 'validatorBubbleFill' : 'nonValidatorBubbleFill';

      bubbles.push(bubble);
    });

    this.setState({ nodesData: bubbles });
  }

  changeToValidators() {
    this.setState({
      nodesType: "validators",
    });
  }

  changeToNonValidators() {
    console.log("change to non");
    this.setState({
      nodesType: "non-validators",
    });
  }

  render() {
    return (
      <div className="mapBackground">
        <div className="mapWrapper">
          {this.state.nodesType === "validators" ? 
            <div className="nodesTypeSelector">              
              <div className="option validator activeValidator" onClick={() => {this.changeToValidators()}}>
                <div className="circle activeCircle"><img className="check" src="/static/images/icon-checkmark.svg" /></div>
                <div className="optionText">Validating nodes </div>
                <div className="counter activeCounter">77</div>
              </div>
              <div className="option nonValidator" onClick={() => { this.changeToNonValidators() }}>
                <div className="circle"></div>
                <div className="optionText">Non-validating nodes </div>
                <div className="counter">12</div>
              </div>
            </div>
            :
            <div className="nodesTypeSelector">
              <div className="option validator" onClick={() => { this.changeToValidators() }}>
                <div className="circle"></div>
                <div className="optionText">Validating nodes </div>
                <div className="counter active">77</div>
              </div>
              <div className="option nonValidator activeNonValidator" onClick={() => { this.changeToNonValidators() }}>
                <div className="circle activeCircle"><img className="check" src="/static/images/icon-checkmark.svg" /></div>
                <div className="optionText">Non-validating nodes </div>
                <div className="counter activeCounter">12</div>
              </div>
            </div>
          }
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
                  `<div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">` + moment.duration(moment().diff(moment(data.lastSeen))).as('seconds').toFixed() + 's ago' + `</div>` +
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
            .nodesTypeSelector {
              position: absolute;
              z-index: 100;
              top: 92px;
              left: 0;
              color: white;
              display: flex;
              flex-direction: row;
              justify-content: center;
              width: 100%;
              height: 48px;
            }
            .option {
              cursor: pointer;
              display: flex;
              flex-direction: row;
              align-items: center;
              background: #343A40;
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.16);
            }
            .circle {
              height: 16px;
              width: 16px;
              border: 1px solid #8DD4BD;
              border-radius: 8px;
              margin-right: 8px;
            }
            .activeCircle {
              width: 20px;
              height: 20px;
              border: none;
              border-radius: 10px;
              background-color: #8DD4BD;
              display: flex;
              justify-content: center;
              margin-right: 6px;
            }
            .check {
              margin: 0 0 0 -1px;
            }
            .validator {
              background: #343A40;
              border-radius: 24px 6px 6px 24px;
              font-size: 12px;
              color: #FFFFFF;
              margin-right: 2px;
              padding: 16px 16px 16px 16px;
            }
            .validator:hover {
              border: 2px solid #8DD4BD;
              padding: 14px 14px 14px 14px;
            }
            .activeValidator {
              border: 2px solid #8DD4BD;
              padding: 14px 14px 14px 12px;
            }
            .activeValidator:hover  {
              padding: 14px 14px 14px 12px;
            }
            .nonValidator {
              padding: 16px 20px 16px 16px;
              margin-left: 2px;
              border-radius: 6px 24px 24px 6px;
            }
            .nonValidator:hover {
              border: 2px solid #8DD4BD;
              padding: 14px 18px 14px 14px;
            }
            .activeNonValidator {
              padding: 14px 18px 14px 12px;
              border: 2px solid #8DD4BD;
            }
            .activeNonValidator:hover {
              padding: 14px 18px 14px 12px;
              border: 2px solid #8DD4BD;
            }
            .optionText {
              padding: 2px 0 0;
              font-family: BwSeidoRound;
              font-size: 12px;
              line-height: 12px;
              font-weight: 700;
            }
            .counter {
              padding: 2px 0 0 4px;
              font-family: BwSeidoRound;
              font-size: 12px;
              line-height: 12px;
              font-weight: 700;
              color: white;
              opacity: 0.4;
            }
            .activeCounter {
              opacity: 1;
              color: #8DD4BD;
            }
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
