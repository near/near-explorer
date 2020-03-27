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
        .code-preview {
          font-family: mono;
          background: #282c34;
          color: white;
          padding: 20px;
          width: 100%;
          height: 99%;
        }
      `}</style>
    </>
  );
};
