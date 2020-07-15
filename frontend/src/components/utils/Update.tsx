import React from "react";
interface Props {
  category: string;
  count: number;
}
export default ({ category, count }: Props) => {
  if (count === 0) {
    return null;
  }
  return (
    <div className="update">
      {count > 1 ? (
        <p>
          {count} new {category}s. Refresh or Click to view
        </p>
      ) : (
        <p>
          {count} new {category}. Refresh or Click to view
        </p>
      )}
      <style>{`
      .update{
        width: 100%;
        height: 40px;
        background: rgba(106, 209, 227, 0.15);
        color: #6ab9e3;
        padding: 5px 10px;
      }
      `}</style>
    </div>
  );
};
