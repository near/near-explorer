import moment from 'moment';

import dynamic from 'next/dynamic'
import Link from "next/link";

import React from "react";

import Countdown from 'react-countdown';

import NodesApi, * as N from "../../libraries/explorer-wamp/nodes";

import autoRefreshHandler from "../utils/autoRefreshHandler";
import { OuterProps } from "../accounts/Accounts";

const Datamap = dynamic(() => import('./DatamapsExtension'), { ssr: false });

const countdownRenderer = ({ seconds }: any) => {
  return <span className="countdownText">{seconds}s</span>;
}

interface Props extends OuterProps {
  role: string;
}

interface InnerProps {
  items: N.IMapData[];
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

interface State {
  nodesData: IBubble[];
  nodesType: string;
  newNodes: IBubble[];
  removedNodes: IBubble[];
}

interface IGeo {
  lat: string;
  lon: string;
  city: string;
}

export default class extends React.Component<Props> {
  static defaultProps = {
    count: 15,
  };

  fetchNodes = async () => {
    return await new NodesApi().getDataForMap();
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

class NodesMap extends React.Component<InnerProps, State> {
  constructor(props: InnerProps) {
    super(props);
    this.state = { 
      nodesData: [],
      nodesType: "validators",
      newNodes: [],
      removedNodes: []
    };
  }

  async componentDidUpdate(prevProps: any) {
    if (prevProps.items[0].validatingNodes !== this.props.items[0].validatingNodes || prevProps.items[0].nonValidatingNodes !== this.props.items[0].nonValidatingNodes) {
      this.setState({
        newNodes: [],
        removedNodes: []
      }, async () => await this.fetchGeo());
    }
  }

  async componentDidMount() {
   await this.fetchGeo();
  }
  
  async fetchGeo() {
    const nodes =  this.state.nodesType === "validators" ? this.props.items[0].validatingNodes : this.props.items[0].nonValidatingNodes;
    const IPsArray = nodes.map(item => item.ipAddress);

    const url = "http://ip-api.com/batch?fields=status,message,country,city,lat,lon,timezone,query"
    const tempGeoData = await fetch(url, {
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
    const geoData: IGeo[] = await tempGeoData.json();
    const bubbles: IBubble[] = nodes.map((element: any, index: number) => {
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

      return bubble;
    });

    this.saveData(bubbles);
  }

  saveData(nodes: IBubble[]) {
    const oldNodes = this.state.nodesData;
    const newNodes = nodes;
    const newAddedNodes: IBubble[] = [];
    const removedNodes: IBubble[] = [];


    // check for new added nodes
    newNodes.forEach( (item: IBubble) => {
      let wasOld = false;
      for (let i:number = 0; i < oldNodes.length; i++) {
        if (item.name === oldNodes[i].name) {
          wasOld = true;
        }
      }
      if (!wasOld) {
        newAddedNodes.push(item);
      }
    });

    // check for removed nodes
    oldNodes.forEach( (item: IBubble) => {
      let stillActive = false;
      for (let i:number = 0; i < newNodes.length; i++) {
        if (item.name === newNodes[i].name) {
          stillActive = true;
        }
      }
      if (!stillActive) {
        removedNodes.push(item);
      }
    });

    this.setState({ 
        nodesData: nodes,
        newNodes: newAddedNodes,
        removedNodes: removedNodes
      });
  }

  changeToValidators() {
    this.setState({
      nodesType: "validators",
      newNodes: [],
    }, () => this.fetchGeo());
  }

  changeToNonValidators() {
    this.setState({
      nodesType: "non-validators",
      newNodes: [],
    }, () => this.fetchGeo());
  }

  renderBubbleTooltip(data: IBubble) {
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
  }

  render() {
    const map = <Datamap
      responsive
      geographyConfig={{
        popupOnHover: false,
        highlightOnHover: false,
        borderColor: '#121314',
      }}
      fills={{
        defaultFill: '#121314',
        validatorBubbleFill: '#8DD4BD',
        nonValidatorBubbleFill: '#8DD4BD',
      }}
      bubbles={this.state.nodesData}
      pins={this.state.newNodes}
      removedNodes={this.state.removedNodes}
      bubbleOptions={{
        borderWidth: 1,
        borderColor: '#1C1D1F',
        fillOpacity: 0.6,
        highlightFillOpacity: 1,
        highlightFillColor: '#8DD4BD',
        highlightBorderColor: '#8DD4BD',
        highlightBorderWidth: 2,
        animate: false,
        popupTemplate: (data: IBubble) => { // This function should just return a string
          return this.renderBubbleTooltip(data);
        },
      }}
      pinOptions={{
        borderWidth: 1,
        borderColor: '#8DD4BD',
        fillColor: '#8DD4BD',
        fillOpacity: 0.6,
        highlightFillOpacity: 1,
        highlightFillColor: '#8DD4BD',
        highlightBorderColor: '#8DD4BD',
        highlightBorderWidth: 2,
        radius: 4,
      }}
      removedNodesOptions={{
        borderWidth: 1,
        borderColor: '#FF585D',
        fillColor: '#FF585D',
        fillOpacity: 1,
        highlightFillOpacity: 1,
        highlightFillColor: '#FF585D',
        highlightBorderColor: '#FF585D',
        highlightBorderWidth: 2,
        radius: 4,
      }}
    />;
    return (
      <div className="mapBackground">
        <div className="mapWrapper">
          <div className="refreshCountdown">
            Next update 
            <Countdown 
              key={Date.now() + 10000}  
              date={Date.now() + 10000} 
              renderer = {countdownRenderer}
            />
          </div>
          <Link href="/nodes/[role]" as={`/nodes/validators`}>
            <div className="closeMap">
                <img className="closeIcon" src="/static/images/icon-close-map.svg" />
            </div>
          </Link>
            <div className="nodesTypeSelector">              
              <div className={`option validator ${this.state.nodesType === "validators" ? " active activeValidator" : ""}`} onClick={() => this.changeToValidators()}>
                <div className={`${this.state.nodesType === "validators" ? " activeCircle" : "circle"}`}><img className="check" src="/static/images/icon-checkmark.svg" /></div>
                <div className="optionText">Validating nodes</div>
                <div className="counter">{this.props.items[0].validatingNodes.length}</div>
              </div>
              <div className={`option nonValidator ${this.state.nodesType === "non-validators" ? " active activeNonValidator" : ""}`}  onClick={() => this.changeToNonValidators()}>
                <div className={`${this.state.nodesType === "validators" ? " circle" : "activeCircle"}`}><img className="check" src="/static/images/icon-checkmark.svg" /></div>
                <div className="optionText">Non-validating nodes</div>
                <div className="counter">{this.props.items[0].nonValidatingNodes.length}</div>
              </div>
            </div>
          {map}
        </div>
        <style jsx global>{`
            .nLetter {
              .positio: relative;
              stroke: #24272A !important;
              stroke-width: 0 !important;
              animation: rotate 2s linear forwards;
              animation-delay: 0.8s;
              transform-origin: top center;
              transform: scale(0);
            }
            .coin {
              position: relative;
              border-radius: 100%;
            }
            .coinCircle {
              position: relative;
              animation: rotate 2s linear forwards;
              animation-delay: 0.8s;
              transform-origin: top center;
              transform: scale(0);
            }
            @keyframes rotate {
              0% {
                transform: rotateY(40deg) scale(0);
              }

              10% {
                transform: rotateY(40deg) scale(1);
              }
              
              20% {
                transform: rotateY(0deg) scale(1);
              }
              
              42% {
                transform: rotateY(-180deg) scale(1);
              }
              
              75% {
                transform: rotateY(-360deg) scale(1);
              }
              
              82% {
                transform: rotateY(-405deg) scale(1);
              }
              
              90% {
                transform: rotateY(-450deg) scale(1);
              }
                
              100% {
                transform: rotateY(-450deg) scale(0);
              }
            }
            .leftLine, .rightLine {
              stroke-dasharray: 14px;
              stroke-dashoffset: 14px;
              animation: lineUp 0.5s linear forwards 1.8s;
            }
            .rightLine {
              animation-delay: 2.0s;
            }
            @keyframes lineUp {
              0% {
                stroke-dashoffset: -14px;
              }
              
              100% {
                stroke-dashoffset: -42px;
              }
            }
            .refreshCountdown{
              position: absolute;
              top: 92px;
              left: 32px;
              height: 48px;
              color: rgba( 255, 255, 255, 0.4);
              font-family: BwSeidoRound;
              font-size: 12px;
              line-height: 12px;
              font-weight: 700;
              padding: 19px 20px 17px;
              background: #343A40;
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.16);
              border-radius: 24px;
            }
            .countdownText {
              margin-left: 4px;
              color: #F0EC74;
            }
            .closeMap {
              cursor: pointer;
              position: absolute;
              top: 92px;
              right: 32px;
              z-index: 101;
              width: 48px;
              height: 48px;
              border-radius: 24px;
              background: #343A40;
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.16);
              display: flex;
              justify-content: center;
              align-items: center;
            }
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
            .nodesTypeSelector .check {
              display: none;
            }
            .nodesTypeSelector .active .check {
              display: block;
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
