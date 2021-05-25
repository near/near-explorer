export interface Props {
  children?: string | React.ReactNode;
  className?: string;
  text?: string;
}

const Placeholder = ({ children, className, text }: Props) => {
  if (!children && !text) {
    throw new Error("Placeholder's text should not be empty");
  }
  return (
    <div className={`placeholder ${className}`}>
      <p className="placeholder-text">{text ?? children}</p>
      <style global jsx>{`
        .placeholder {
          width: 100%;
          background: rgba(106, 209, 227, 0.15);
          color: #6ab9e3;
          padding: 5px 10px;
          cursor: pointer;
        }

        .placeholder-text {
          margin: 3px;
        }
      `}</style>
    </div>
  );
};

export default Placeholder;
