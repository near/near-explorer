import lodash from "lodash";
import moment from "moment";

import dynamic from "next/dynamic";
import Link from "next/link";

import React from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { NodeContext } from "../../context/NodeProvider";

const Datamap = dynamic(() => import("../utils/DatamapsExtension"), {
  ssr: false,
});

interface IBubble {
  geo: IGeo;
  radius: number;
  nodeInfo: N.NodeInfo;
}

interface IGeo {
  latitude: string;
  longitude: string;
  city: string;
}

interface State {
  nodesData: IBubble[];
  nodesType: string;
  newNodes: IBubble[];
  removedNodes: IBubble[];
  nodeClusters: [];
}

class NodesMap extends React.Component<State> {
  state: State = {
    nodesData: [],
    nodesType: "validators",
    newNodes: [],
    removedNodes: [],
    nodeClusters: [],
  };

  componentDidMount() {
    const { nodeInfo } = this.context;
    this.fetchGeo(nodeInfo.validators, nodeInfo.onlineNodes);
  }

  // need to change the method to nodes.js
  fetchGeo = async (validators: any, onlineNodes: any) => {
    const nodes =
      this.state.nodesType === "validators" ? validators : onlineNodes;
    const url =
      "http://ip-api.com/batch?fields=status,message,country,city,latitude,longitude,timezone,query";
    if (nodes) {
      const IPsArray = nodes.map((node: any) => node.ipAddress);
      let ipCount = IPsArray.length;
      let geoData: IGeo[] = [];
      while (ipCount > 0) {
        let min = Math.max(ipCount - 50, 0);
        let ipArrPart = JSON.stringify(IPsArray.slice(min, ipCount));
        let response = await fetch(url, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: ipArrPart,
        });
        let part = await response.json();
        geoData = geoData.concat(part);
        ipCount -= 50;
      }

      const bubbles: IBubble[] = nodes.map((element: any, index: number) => {
        const bubble: IBubble = {
          geo: {
            latitude: "",
            longitude: "",
            city: "",
          },
          radius: 0,
          nodeInfo: {
            ipAddress: "",
            accountId: "",
            nodeId: "",
            lastSeen: 0,
            lastHeight: 0,
            agentName: "",
            agentVersion: "",
            agentBuild: "",
            status: "",
          },
        };

        bubble.geo.latitude = geoData[index].latitude;
        bubble.geo.longitude = geoData[index].longitude;
        bubble.geo.city = geoData[index].city;
        bubble.radius = 4;
        if (this.state.nodesType === "validators") {
          bubble.nodeInfo = element.nodeInfo;
          bubble.nodeInfo.accountId = element.account_id;
        }
        bubble.nodeInfo = element;

        return bubble;
      });

      this.saveData(bubbles);
    }
  };

  saveData = (newNodes: IBubble[]) => {
    const oldNodes = this.state.nodesData;
    const newAddedNodes: IBubble[] = newNodes.filter(
      this.compareObjectsArrays(oldNodes)
    );
    const removedNodes: IBubble[] = oldNodes.filter(
      this.compareObjectsArrays(newNodes)
    );
    const groupedNodes = this.getNodeClusters(newNodes);

    this.setState({
      nodesData: newNodes,
      newNodes: newAddedNodes,
      removedNodes: removedNodes,
      nodeClusters: groupedNodes,
    });
  };

  compareObjectsArrays = (objectArray: IBubble[]) => {
    return (current: IBubble) => {
      return (
        objectArray.filter((other) => {
          return other.nodeInfo.nodeId == current.nodeInfo.nodeId;
        }).length == 0
      );
    };
  };

  getNodeClusters = (nodes: IBubble[]) => {
    // Get clusters of nodes that share the same location.
    const groupedNodes: any = lodash.groupBy(nodes, (item: IBubble) => {
      return item.geo.latitude;
    });
    // @ts-ignore
    lodash.forEach(groupedNodes, (value, key) => {
      // value is unused but necessary, without it function gets weird behaviour
      groupedNodes[key] = lodash.groupBy(
        groupedNodes[key],
        (item: { longitude: any }) => {
          return item.longitude;
        }
      );
    });

    const finalArray: any[] = [];
    Object.keys(groupedNodes).forEach((element) => {
      Object.keys(groupedNodes[element]).forEach((item) => {
        if (groupedNodes[element][item].length > 1) {
          finalArray.push(groupedNodes[element][item]);
        }
      });
    });
    return finalArray;
  };

  renderBubbleTooltip = (data: IBubble) => {
    // Prettier ruined the entire indentation that i made for this
    return `<div className="hoverinfo" style="border: none; text-align: left; padding: 20px 0px 0px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16); border-radius: 8px; color: white; background-color: #343A40; max-width: 300px">
        <div style="color: #8DD4BD; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound; padding:0 20px 8px"> @${
          data.nodeInfo.accountId
        }</div>
        <div style="display: flex; flex-direction: row; width: 100%; flex-wrap: nowrap; padding: 0 20px 16px">
          <div style="color: #ffffff; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; white-space: nowrap">${
            data.nodeInfo.agentName
          } | ver.${data.nodeInfo.agentVersion} build ${
      data.nodeInfo.agentBuild
    }</div>
          <div style="color: #ffffff; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; opacity: 0.6; text-overflow: ellipsis; padding-left: 4px; overflow: hidden;">${
            data.nodeInfo.nodeId.split(":")[1]
          }</div>
        </div>
        <div style="background-color: rgba(0, 0, 0, 0.2); display: flex; flex-direction: row; justify-content: space-between; padding: 16px 20px; border-radius: 0 0 8px 8px">
          <div>
            <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">Block#</div>
            <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">${
              data.nodeInfo.lastHeight
            }</div>
          </div>
          <div>
            <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">Last seen</div>
            <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">${moment
              .duration(moment().diff(moment(data.nodeInfo.lastSeen)))
              .as("seconds")
              .toFixed()}s ago</div>
          </div>
          <div>
            <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">Location</div>
            <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">${
              data.geo.city
            }</div>
          </div>
        </div>
      </div>`;
  };

  renderClusterTooltip = (data: IBubble[]) => {
    let htmlString: string = '<div class="clusterTooltipWrapper">';
    data.forEach((item: IBubble) => {
      // Prettier ruined the entire indentation that i made for this
      htmlString += `<div className="hoverinfo" style="border: none; text-align: left; padding: 20px 0px 0px; color: white; background-color: #343A40; max-width: 300px; border-bottom: 1px solid rgba(255, 255, 255, 0.16); box-sizing: border-box;" key="${
        item.nodeInfo.nodeId
      }">
          <div style="color: #8DD4BD; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound; padding:0 20px 8px">@${
            item.nodeInfo.accountId
          }</div>
          <div style="display: flex; flex-direction: row; width: 100%; flex-wrap: nowrap; padding: 0 20px 16px">
            <div style="color: #ffffff; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; white-space: nowrap">${
              item.nodeInfo.agentName
            } | ver.${item.nodeInfo.agentVersion} build ${
        item.nodeInfo.agentBuild
      }</div>
            <div style="color: #ffffff; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; opacity: 0.6; text-overflow: ellipsis; padding-left: 4px; overflow: hidden;">${
              item.nodeInfo.nodeId.split(":")[1]
            }</div>
          </div>
          <div style="background-color: rgba(0, 0, 0, 0.2); display: flex; flex-direction: row; justify-content: space-between; padding: 16px 20px;">
            <div>
              <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">Block#</div>
              <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">${
                item.nodeInfo.lastHeight
              }</div>
            </div>
            <div>
              <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">Last seen</div>
              <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">${moment
                .duration(moment().diff(moment(item.nodeInfo.lastSeen)))
                .as("seconds")
                .toFixed()}s ago</div>
            </div>
            <div>
              <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; font-family: BwSeidoRound; padding: 0 0 6px">Location</div>
              <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; font-family: BwSeidoRound;">${
                item.geo.city
              }</div>
            </div>
          </div>
        </div>
      `;
    });
    htmlString += "</div>";
    return htmlString;
  };

  changeToValidators = () => {
    const { nodeInfo } = this.context;
    this.setState(
      {
        nodesType: "validators",
        newNodes: [],
      },
      () => this.fetchGeo(nodeInfo.validators, nodeInfo.onlineNodes)
    );
  };

  changeToOnlineNodes = () => {
    const { nodeInfo } = this.context;
    this.setState(
      {
        nodesType: "online-nodes",
        newNodes: [],
      },
      () => this.fetchGeo(nodeInfo.validators, nodeInfo.onlineNodes)
    );
  };

  render() {
    const map = (
      <Datamap
        responsive
        geographyConfig={{
          popupOnHover: false,
          highlightOnHover: false,
          borderColor: "#121314",
        }}
        fills={{
          defaultFill: "#2f3233",
          validatorBubbleFill: "#8DD4BD",
          nonValidatorBubbleFill: "#8DD4BD",
        }}
        bubbles={this.state.nodesData}
        pins={this.state.newNodes}
        removedNodes={this.state.removedNodes}
        nodeClusters={this.state.nodeClusters}
        bubbleOptions={{
          borderWidth: 1,
          borderColor: "#1C1D1F",
          fillOpacity: 0.6,
          highlightFillOpacity: 1,
          highlightFillColor: "#8DD4BD",
          highlightBorderColor: "#8DD4BD",
          highlightBorderWidth: 2,
          animate: false,
          popupTemplate: this.renderBubbleTooltip,
        }}
        pinOptions={{
          borderWidth: 1,
          borderColor: "#8DD4BD",
          fillColor: "#8DD4BD",
          fillOpacity: 0.6,
          highlightFillOpacity: 1,
          highlightFillColor: "#8DD4BD",
          highlightBorderColor: "#8DD4BD",
          highlightBorderWidth: 2,
          radius: 4,
        }}
        removedNodesOptions={{
          borderWidth: 1,
          borderColor: "#FF585D",
          fillColor: "#FF585D",
          fillOpacity: 1,
          highlightFillOpacity: 1,
          highlightFillColor: "#FF585D",
          highlightBorderColor: "#FF585D",
          highlightBorderWidth: 2,
          radius: 4,
        }}
        nodeClustersOptions={{
          borderWidth: 1,
          borderColor: "#1C1D1F",
          fillColor: "#8DD4BD",
          fillOpacity: 1,
          highlightFillOpacity: 1,
          highlightFillColor: "#8DD4BD",
          highlightBorderColor: "#8DD4BD",
          highlightBorderWidth: 2,
          radius: 6,
          popupTemplate: this.renderClusterTooltip,
        }}
      />
    );
    const { nodeInfo } = this.context;
    return (
      <div className="mapBackground">
        <div className="mapWrapper">
          <Link href="/nodes/validators">
            <div className="closeMap">
              <img
                className="closeIcon"
                src="/static/images/icon-close-map.svg"
              />
            </div>
          </Link>
          <div className="nodesTypeSelector">
            <div
              className={`option validator ${
                this.state.nodesType === "validators"
                  ? " active activeValidator"
                  : ""
              }`}
              onClick={() => this.changeToValidators()}
            >
              <div
                className={`${
                  this.state.nodesType === "validators"
                    ? " activeCircle"
                    : "circle"
                }`}
              >
                <img
                  className="check"
                  src="/static/images/icon-checkmark.svg"
                />
              </div>
              <div className="optionText">Validating nodes</div>
              <div className="counter">
                nodeInfo.validators ? nodeInfo.validators.length : "-"}
              </div>
            </div>
            <div
              className={`option nonValidator ${
                this.state.nodesType === "online-nodes"
                  ? " active activeNonValidator"
                  : ""
              }`}
              onClick={() => this.changeToOnlineNodes()}
            >
              <div
                className={`${
                  this.state.nodesType === "validators"
                    ? " circle"
                    : "activeCircle"
                }`}
              >
                <img
                  className="check"
                  src="/static/images/icon-checkmark.svg"
                />
              </div>
              <div className="optionText">Online nodes</div>
              <div className="counter">
                {nodeInfo.onlineNodes ? nodeInfo.onlineNodes.length : "-"}
              </div>
            </div>
          </div>
          {map}
        </div>
        <style jsx global>
          {`
            .nLetter {
              .positio: relative;
              stroke: #24272a !important;
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
            .leftLine,
            .rightLine {
              stroke-dasharray: 14px;
              stroke-dashoffset: 14px;
              animation: lineUp 0.5s linear forwards 1.8s;
            }
            .rightLine {
              animation-delay: 2s;
            }
            @keyframes lineUp {
              0% {
                stroke-dashoffset: -14px;
              }

              100% {
                stroke-dashoffset: -42px;
              }
            }
            .closeMap {
              cursor: pointer;
              position: absolute;
              top: 12%;
              right: 50px;
              z-index: 101;
              width: 48px;
              height: 48px;
              border-radius: 24px;
              background: #343a40;
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16);
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .closeMap:hover {
              transition: all linear 0.1s;
              opacity: 0.8;
            }
            .nodesTypeSelector {
              position: absolute;
              z-index: 100;
              top: 12%;
              left: 0;
              color: white;
              display: flex;
              flex-direction: row;
              justify-content: center;
              width: 100%;
              height: 48px;
            }
            @media (max-width: 1050px) {
              .nodesTypeSelector {
                top: 90%;
              }
              .closeMap {
                top: 30%;
              }
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
              background: #343a40;
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16);
            }
            .circle {
              height: 16px;
              width: 16px;
              border: 1px solid #8dd4bd;
              border-radius: 8px;
              margin-right: 8px;
            }
            .activeCircle {
              width: 20px;
              height: 20px;
              border: none;
              border-radius: 10px;
              background-color: #8dd4bd;
              display: flex;
              justify-content: center;
              margin-right: 6px;
            }
            .check {
              margin: 0 0 0 -1px;
            }
            .validator {
              background: #343a40;
              border-radius: 24px 6px 6px 24px;
              font-size: 12px;
              color: #ffffff;
              margin-right: 2px;
              padding: 16px 16px 16px 16px;
            }
            .validator:hover {
              border: 2px solid #8dd4bd;
              padding: 14px 14px 14px 14px;
            }
            .activeValidator {
              border: 2px solid #8dd4bd;
              padding: 14px 14px 14px 12px;
            }
            .activeValidator:hover {
              padding: 14px 14px 14px 12px;
            }
            .nonValidator {
              padding: 16px 20px 16px 16px;
              margin-left: 2px;
              border-radius: 6px 24px 24px 6px;
            }
            .nonValidator:hover {
              border: 2px solid #8dd4bd;
              padding: 14px 18px 14px 14px;
            }
            .activeNonValidator {
              padding: 14px 18px 14px 12px;
              border: 2px solid #8dd4bd;
            }
            .activeNonValidator:hover {
              padding: 14px 18px 14px 12px;
              border: 2px solid #8dd4bd;
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
              color: #8dd4bd;
            }
            .mapWrapper {
              margin: 0 auto;
              max-width: 75%;
            }
            .mapBackground {
              background-color: #6b7175;
            }
            .datamapsNodeClusters {
              overflow: visible !important;
              cursor: pointer;
            }
            .clusterNodeText {
              font-family: BwSeidoRound;
              font-size: 8px;
              line-height: 12px;
              font-weight: 700;
              text-align: center !important;
              text-anchor: middle !important;
            }
            .clusterTooltipWrapper {
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16);
              border-radius: 8px;
              overflow-y: scroll;
              max-height: 280px;
            }
            .clusterTooltipWrapper::-webkit-scrollbar {
              width: 8px;
            }

            .clusterTooltipWrapper::-webkit-scrollbar-track {
              border-radius: 0 8px 8px 0;
              background: #343a40;
            }

            .clusterTooltipWrapper::-webkit-scrollbar-thumb {
              border-radius: 8px;
              background: #121314;
              border: 2px solid transparent;
              background-clip: content-box;
            }
          `}
        </style>
      </div>
    );
  }
}
NodesMap.contextType = NodeContext;

export default NodesMap;
