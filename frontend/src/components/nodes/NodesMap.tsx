import lodash from "lodash";
import moment from "moment";

import dynamic from "next/dynamic";

import { Component } from "react";

import * as N from "../../libraries/explorer-wamp/nodes";
import { NodeContext } from "../../context/NodeProvider";

import Link from "../utils/Link";

const Datamap = dynamic(() => import("../utils/DatamapsExtension"), {
  ssr: false,
});

interface IBubble {
  radius: number;
  fillKey: string;
  nodeInfo: N.NodeInfo;
  nodeId: string;
  latitude: number;
  longitude: number;
}

interface State {
  nodesData: IBubble[];
  nodesType: string;
  newNodes: IBubble[];
  removedNodes: IBubble[];
  nodeClusters: [];
}

class NodesMap extends Component<State> {
  state: State = {
    nodesData: [],
    nodesType: "",
    newNodes: [],
    removedNodes: [],
    nodeClusters: [],
  };

  componentDidMount() {
    this.fetchGeo();
  }

  fetchGeo = async () => {
    const { onlineNodes, onlineValidatingNodes } = this.context;
    const nodes =
      this.state.nodesType === "validators"
        ? onlineValidatingNodes
        : onlineNodes;

    if (typeof nodes === "undefined") {
      return;
    }

    const bubbles: IBubble[] = nodes.map((node: N.NodeInfo) => {
      return {
        radius: 4,
        fillKey: "validatorBubbleFill",
        nodeInfo: node,
        nodeId: node.nodeId,
        latitude: node.latitude,
        longitude: node.longitude,
      };
    });

    this.saveData(bubbles);
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
          return other.nodeId == current.nodeId;
        }).length == 0
      );
    };
  };

  getNodeClusters = (nodes: IBubble[]) => {
    // Get clusters of nodes that share the same location.
    const groupedNodes: any = lodash.groupBy(nodes, (item: IBubble) => {
      return item.latitude;
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
        <div style="color: #8DD4BD; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; padding:0 20px 8px"> @${
          data.nodeInfo.accountId
        }</div>
        <div style="display: flex; flex-direction: row; width: 100%; flex-wrap: nowrap; padding: 0 20px 16px">
          <div style="color: #ffffff; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; white-space: nowrap">${
            data.nodeInfo.agentName
          } | ver.${data.nodeInfo.agentVersion} build ${
      data.nodeInfo.agentBuild
    }</div>
          <div style="color: #ffffff; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold; opacity: 0.6; text-overflow: ellipsis; padding-left: 4px; overflow: hidden;">${
            data.nodeId.split(":")[1]
          }</div>
        </div>
        <div style="background-color: rgba(0, 0, 0, 0.2); display: flex; flex-direction: row; justify-content: space-between; padding: 16px 20px; border-radius: 0 0 8px 8px">
          <div>
            <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold;  padding: 0 0 6px">Block#</div>
            <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; ">${
              data.nodeInfo.lastHeight
            }</div>
          </div>
          <div>
            <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold;  padding: 0 0 6px">Last seen</div>
            <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; ">${moment
              .duration(moment().diff(moment(data.nodeInfo.lastSeen)))
              .as("seconds")
              .toFixed()}s ago</div>
          </div>
          <div>
            <div style="color: #ffffff; opacity: 0.4; font-size: 10px; line-height: 10px; letter-spacing: 0.2px; font-weight: bold;  padding: 0 0 6px">Location</div>
            <div style="color: #ffffff; font-size: 14px; line-height: 14px; letter-spacing: 0.4px; font-weight: bold; ">${
              data.nodeInfo.city
            }</div>
          </div>
        </div>
      </div>`;
  };

  renderClusterTooltip = (data: IBubble[]) => {
    let htmlString: string = '<div class="clusterTooltipWrapper">';
    data.forEach((item: IBubble) => {
      htmlString += this.renderBubbleTooltip(item);
    });
    htmlString += "</div>";
    return htmlString;
  };

  changeToValidators = () => {
    this.setState(
      {
        nodesType: "validators",
        newNodes: [],
      },
      () => this.fetchGeo()
    );
  };

  changeToOnlineNodes = () => {
    this.setState(
      {
        nodesType: "online-nodes",
        newNodes: [],
      },
      () => this.fetchGeo()
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
          radius: 2,
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
              <div className="optionText">online Validating nodes</div>
              <div className="counter">
                {this.state.nodesType === "validators"
                  ? this.state.nodesData.length
                  : "-"}
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
                  this.state.nodesType === "online-nodes"
                    ? " activeCircle"
                    : "circle"
                }`}
              >
                <img
                  className="check"
                  src="/static/images/icon-checkmark.svg"
                />
              </div>
              <div className="optionText">Online nodes</div>
              <div className="counter">
                {this.state.nodesType === "online-nodes"
                  ? this.state.nodesData.length
                  : "-"}
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
              font-size: 12px;
              line-height: 12px;
              font-weight: 700;
            }
            .counter {
              padding: 2px 0 0 4px;
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
