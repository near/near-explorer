import ReactTextCollapse from "react-text-collapse";
import { styled } from "../../libraries/styles";

const CodePreviewWrapper = styled("textarea", {
  fontFamily: '"Source Code Pro", monospace',
  background: "#424957",
  color: "white",
  padding: 20,
  width: "100%",
  height: "99%",
});

export interface CollapseOptions {
  collapseText: string;
  expandText: string;
  minHeight: number;
  maxHeight: number;
}

export interface Props {
  collapseOptions: CollapseOptions;
  value: string;
}

const CodePreview = (props: Props) => {
  return (
    <ReactTextCollapse options={props.collapseOptions}>
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
        rel="stylesheet"
      />
      <CodePreviewWrapper readOnly value={props.value} />
    </ReactTextCollapse>
  );
};

export default CodePreview;
