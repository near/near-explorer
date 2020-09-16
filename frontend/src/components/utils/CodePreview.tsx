import ReactTextCollapse from "react-text-collapse";

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

export default (props: Props) => {
  return (
    <>
      <ReactTextCollapse options={props.collapseOptions}>
        <textarea readOnly className="code-preview" value={props.value} />
      </ReactTextCollapse>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap");
        .code-preview {
          font-family: "Source Code Pro", monospace;
          background: #424957;
          color: white;
          padding: 20px;
          width: 100%;
          height: 99%;
        }
      `}</style>
    </>
  );
};
