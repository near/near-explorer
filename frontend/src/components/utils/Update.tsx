import Placeholder, { Props as PlaceholderProps } from "./Placeholder";

const Update = ({ children }: PlaceholderProps) => {
  return (
    <Placeholder className="update">
      {children}
      {` Refresh or Click to view the latest data.`}
      <style>{`
      .update:active{
        background: rgba(106, 209, 227, 0.5)
      }
      `}</style>
    </Placeholder>
  );
};

export default Update;
