interface Props {
  children: string;
}

export default ({ children }: Props) => {
  return (
    <div className="update">
      <p className="update-text">
        {children}
        {` Refresh or Click to view the latest data.`}
      </p>
      <style>{`
      .update{
        width: 100%;
        background: rgba(106, 209, 227, 0.15);
        color: #6ab9e3;
        padding: 5px 10px;
        cursor:pointer;
      }
      .update:active{
        background: rgba(106, 209, 227, 0.5)
      }

      .update-text {
        margin: 3px;
      }
      `}</style>
    </div>
  );
};
