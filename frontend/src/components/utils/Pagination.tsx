import React from "react";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";
import { styled } from "../../libraries/styles";

export const PaginateWrapper = styled(ReactPaginate, {
  display: "flex",
  justifyContent: "center",
  padding: "20px 0",
  marginBottom: 0,

  "& li": {
    padding: "0 5px",
    textAlign: "center",
    background: "transparent",
    listStyleType: "none",
    overflow: "hidden",
    cursor: "pointer",
    color: "#a2a2a8",
    fontSize: 14,
    transition: "all 0.15s ease-in-out",
    outline: "none",

    "& svg": {
      width: 8,
      height: 15,
      stroke: "currentColor",
    },
  },

  "& li.next svg": {
    transform: "rotate(180deg)",
  },

  "& li.next a, & li.previous a": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#d5d4d8",
  },

  "& li.disabled, & li.disabled a, & li.disabled a:hover, & li.previous.disabled a:hover": {
    color: "#d5d4d8",
    cursor: "default",
  },

  "& li.selected a": {
    fontWeight: 500,
    color: "#0072ce",
    backgroundColor: "#f0f9ff",
    borderRadius: 4,
  },

  "& li a": {
    transition: "all 0.15s ease-in-out",
    width: 23,
    lineHeight: "25px",
    display: "block",
    outline: "none",
    color: "inherit",
  },
});

export type OnPageChange = ReactPaginateProps["onPageChange"];

export interface Props {
  overrideComponent?: React.FC<React.ComponentProps<typeof PaginateWrapper>>;
  pageCount: number;
  marginPagesDisplayed: number;
  pageRangeDisplayed: number;
  onPageChange: OnPageChange;
}

const Arrow = () => (
  <svg fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m7 13.5-6-6 6-6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Pagination: React.FC<Props> = ({
  overrideComponent,
  pageCount,
  marginPagesDisplayed,
  pageRangeDisplayed,
  onPageChange,
}) => {
  const Component = overrideComponent || PaginateWrapper;
  return (
    <Component
      previousLabel={<Arrow />}
      nextLabel={<Arrow />}
      pageCount={pageCount}
      marginPagesDisplayed={marginPagesDisplayed}
      pageRangeDisplayed={pageRangeDisplayed}
      onPageChange={onPageChange}
    />
  );
};

export default Pagination;
