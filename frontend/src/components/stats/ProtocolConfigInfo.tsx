import moment from "moment";
import BN from "bn.js";
import React, { useEffect, useState } from "react";

import StatsApi from "../../libraries/explorer-wamp/stats";

import { InfoCard, InfoCardCell as Cell } from "../utils/InfoCard";
// import { NodeStatsContext } from "../../context/NodeStatsProvider";

const ProtocolConfigInfo = ({
  genesisStatus,
  epochLength,
  epochStartBlock,
  epochProtocolVersion,
}) => {
  const [totalGenesisSupply, setTotalGenesisSupply] = useState<BN>();
  const [
    genesisProtocolVersion,
    setGenesisProtocolVersion,
  ] = useState<number>();

  useEffect(() => {
    if (genesisStatus?.genesisHeight) {
      new StatsApi()
        .networkGenesisProtocolConfig(genesisStatus?.genesisHeight)
        .then((genesisBlockInfo: any) => {
          if (genesisBlockInfo) {
            console.log("genesisBlockInfo", genesisBlockInfo);
            setTotalGenesisSupply(genesisBlockInfo.header.total_supply);
            setGenesisProtocolVersion(
              genesisBlockInfo.header.latest_protocol_version
            );
          }
        });
    }
  }, []);
  return (
    <>
      <InfoCard className="protocol-config">
        <Cell
          title="Genesis Started"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {genesisStatus?.genesisTime && (
            <>
              <span>
                {moment(genesisStatus?.genesisTime).format("MMMM DD, YYYY")}
              </span>
              <div style={{ fontSize: "10px", lineHeight: "1" }}>
                {moment(genesisStatus?.genesisTime).format("[at] h:mm:ssa")}
              </div>
            </>
          )}
        </Cell>

        <Cell
          title="Genesis Protocol / Current Protocol"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "4" }}
        >
          {genesisProtocolVersion && epochProtocolVersion && (
            <>
              <span className="genesis-text">v{genesisProtocolVersion}</span> /{" "}
              <span>v{epochProtocolVersion}</span>
            </>
          )}
        </Cell>

        <Cell
          title="Genesis Height"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {genesisStatus && (
            <span className="genesis-text">{genesisStatus.genesisHeight}</span>
          )}
        </Cell>
        <Cell
          title="Epoch Lenght"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          {epochLength && <span>{epochLength}</span>}
        </Cell>
      </InfoCard>

      <InfoCard className="protocol-config">
        <Cell
          title="Genesis Total Supply"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {totalGenesisSupply && (
            <span className="genesis-text">
              {totalGenesisSupply.toString().slice(0, 5)}
            </span>
          )}
        </Cell>

        <Cell
          title="Accounts in Genesis / Active Accounts"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "4" }}
        >
          null / null
        </Cell>

        <Cell
          title="Total Supply"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "3" }}
        >
          {epochStartBlock && (
            <span>{epochStartBlock.totalSupply?.toString().slice(0, 5)}</span>
          )}
        </Cell>

        <Cell
          title="Genesis Contracts Amount"
          cellOptions={{ xs: "12", sm: "6", md: "6", xl: "2" }}
        >
          null
        </Cell>
      </InfoCard>
      <style global jsx>{`
        .protocol-config {
          margin: 24px 0;
        }

        .genesis-text {
          color: #00c08b;
        }
      `}</style>
    </>
  );
};

export default ProtocolConfigInfo;
