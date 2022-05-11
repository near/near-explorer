import React from "react";
import { useFetch } from "../../hooks/use-fetch";
import { styled } from "../../libraries/styles";
import { DeployInfo as DeployInfoProps } from "../../types/common";

const Wrapper = styled("div", {
  position: "fixed",
  bottom: 4,
  right: 4,
  padding: "0 4px",
  borderRadius: 6,

  variants: {
    expanded: {
      true: {
        border: "1px solid gray",
        background: "white",
      },
      false: {
        cursor: "pointer",
        color: "green",
      },
    },
  },
});

const Section = styled("div", {
  margin: 4,
  padding: "inherit",
});

const Title = styled("div", {
  fontWeight: 500,
  marginTop: 12,
});

const CloseButton = styled("div", {
  position: "absolute",
  top: 4,
  right: 4,
  cursor: "pointer",
});

type Props = {
  client: DeployInfoProps;
};

export const DeployInfo: React.FC<Props> = ({ client }) => {
  const [expanded, setExpanded] = React.useState(false);
  const switchExpanded = React.useCallback(
    () => setExpanded((expanded) => !expanded),
    [setExpanded]
  );
  const server = useFetch("deploy-info", [], !expanded);
  let content: React.ReactNode = "◍";
  if (expanded) {
    content = (
      <>
        <Section>
          <Title>Client:</Title>
          <div>Branch: {client.branch}</div>
          <div>Commit: {client.commit}</div>
          <div>Instance id: {client.instanceId}</div>
          <div>Service id: {client.serviceId}</div>
          <div>Service name: {client.serviceName}</div>
        </Section>
        <Section>
          <Title>Server:</Title>
          {server ? (
            <>
              <div>Branch: {server.branch}</div>
              <div>Commit: {server.commit}</div>
              <div>Instance id: {server.instanceId}</div>
              <div>Service id: {server.serviceId}</div>
              <div>Service name: {server.serviceName}</div>
            </>
          ) : (
            <div>loading..</div>
          )}
        </Section>
        <CloseButton onClick={switchExpanded}>❌</CloseButton>
      </>
    );
  }
  return (
    <Wrapper
      onClick={expanded ? undefined : switchExpanded}
      expanded={expanded}
    >
      {content}
    </Wrapper>
  );
};
