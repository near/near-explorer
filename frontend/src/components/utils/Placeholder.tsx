export interface Props {
  children: string | React.ReactNode;
  className?: string;
}

const Placeholder = ({ children, className }: Props) => (
  <div className={`placeholder ${className}`}>
    <p className="placeholder-text">{children}</p>
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

export default Placeholder;
