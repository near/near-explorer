import ReactPaginate from "react-paginate";

export interface Props {
  className: string;
  pageCount: number;
  marginPagesDisplayed: number;
  pageRangeDisplayed: number;
  onPageChange: Function;
}

export interface onPageChange {
  selected: number;
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

const Pagination = ({
  className,
  pageCount,
  marginPagesDisplayed,
  pageRangeDisplayed,
  onPageChange,
}: Props) => (
  <>
    <ReactPaginate
      containerClassName={`pagination ${className ?? ""}`}
      activeClassName="active"
      previousLabel={<Arrow />}
      nextLabel={<Arrow />}
      pageCount={pageCount}
      marginPagesDisplayed={marginPagesDisplayed}
      pageRangeDisplayed={pageRangeDisplayed}
      onPageChange={onPageChange}
    />
    <style jsx global>{`
      .pagination {
        display: flex;
        justify-content: center;
        padding: 20px 0;
        margin-bottom: 0;
      }

      .pagination li {
        padding: 0 5px;
        text-align: center;
        background: transparent;
        list-style-type: none;
        overflow: hidden;
        cursor: pointer;
        color: #a2a2a8;
        font-size: 14px;
        transition: all 0.15s ease-in-out;
        outline: none;
      }

      .pagination li svg {
        width: 8px;
        height: 15px;
        stroke: currentColor;
      }

      .pagination li.next svg {
        transform: rotate(180deg);
      }

      .pagination li.next a,
      .pagination li.previous a {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #d5d4d8;
      }

      .pagination li.disabled,
      .pagination li.disabled a,
      .pagination li.disabled a:hover,
      .pagination li.previous.disabled a:hover {
        color: #d5d4d8;
        cursor: default;
      }

      .pagination li.active a {
        font-weight: 500;
        color: #0072ce;
        background-color: #f0f9ff;
        border-radius: 4px;
      }

      .pagination li a {
        transition: all 0.15s ease-in-out;
        width: 23px;
        line-height: 25px;
        display: block;
        outline: none;
        color: inherit;
      }
    `}</style>
  </>
);

export default Pagination;
