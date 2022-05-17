import * as React from "react";
import { styled } from "../../libraries/styles";
import Expandable, { ExpandComponent } from "./Expandable";

const CodePreviewWrapper = styled("div", {
  fontFamily: '"Source Code Pro", monospace',
  background: "#424957",
  color: "white",
  padding: 20,
  width: "100%",
  height: "99%",
});

export interface Props {
  value: string;
  expandComponent: ExpandComponent;
  collapseHeight: number;
  maxHeight: number;
}

const CodePreview: React.FC<Props> = React.memo((props) => {
  return (
    <Expandable
      collapseHeight={props.collapseHeight}
      expandComponent={props.expandComponent}
      dependencies={[props.value]}
      maxHeight={props.maxHeight}
    >
      {(ref) => (
        <>
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
            rel="stylesheet"
          />
          <CodePreviewWrapper ref={ref as React.RefObject<HTMLDivElement>}>
            {props.value}
          </CodePreviewWrapper>
        </>
      )}
    </Expandable>
  );
});

export default CodePreview;
