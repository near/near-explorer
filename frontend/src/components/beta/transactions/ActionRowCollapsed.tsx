import * as React from "react";
import { styled } from "../../../libraries/styles";

import Args from "../../transactions/ActionMessage";

const Wrapper = styled("div", {
  paddingVertical: 24,
  // TODO: Place a proper padding here
  paddingHorizontal: 40,
  display: "flex",
  flexDirection: "column",
  // justifyContent: "space-between",
  fontFamily: "Manrope",
});

const Tabs = styled("div", {
  display: "flex",
  alignItems: "center",
  marginLeft: 65,
});

const Tab = styled("div", {
  fontSize: "$font-m",
  lineHeight: "28px",
  color: "#000000",
  fontWeight: 400,
  borderBottom: "2px solid transparent",
  margin: "0 20px",

  variants: {
    type: {
      active: {
        fontWeight: 700,
        borderBottom: "2px solid #000000",
      },
    },
  },
});

const DetailsInfo = styled("div", {
  display: "flex",
  justifyContent: "space-between",
});

const ArgumentsHeader = styled("h4", {
  color: "#000000",
  fontSize: 16,
  lineHeight: "28px",
  fontWeight: 600,
});

const ActionRowCollapsed = React.memo((props) => {
  const [activeTab, setActiveTab] = React.useState("details");
  const switchActiveTab = React.useCallback(
    (e) => {
      console.log(e.target.getAttribute("name"));
      setActiveTab(e.target.getAttribute("name"));
    },
    [setActiveTab]
  );
  if (!props.isRowActive) {
    return null;
  }
  return (
    <Wrapper>
      <Tabs>
        <Tab
          type={activeTab === "details" && "active"}
          name="details"
          onClick={switchActiveTab}
        >
          Details
        </Tab>
        <Tab
          type={activeTab === "inspect" && "active"}
          name="inspect"
          onClick={switchActiveTab}
        >
          Inspect
        </Tab>
      </Tabs>
      {activeTab === "details" && (
        <DetailsInfo>
          <div>
            <ArgumentsHeader>Arguments:</ArgumentsHeader>
            <span></span>
          </div>
          <div>
            {"args" in props.receipt.actions[0] ? (
              <>
                {console.log("args | args", props.receipt.actions[0].args)}
                <Args args={props.receipt.actions[0].args} />
              </>
            ) : (
              // <ConsoleArgs>
              //   {console.log(receipt.actions[0].args.args)}
              // </ConsoleArgs>
              "The arguments are empty"
            )}
          </div>
        </DetailsInfo>
      )}
      {activeTab === "inspect" && <div></div>}
    </Wrapper>
  );
});

export default ActionRowCollapsed;
