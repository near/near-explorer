import { PureComponent } from "react";

import { Table as BaseTable } from "react-bootstrap";

import Pagination, { Props as PaginationProps } from "../utils/Pagination";

interface Props {
  className?: string;
  children: React.ReactNode;
  collapse?: boolean;
  pagination?: PaginationProps;
}

class TableRow extends PureComponent<Props> {
  render() {
    const { className, children, collapse } = this.props;
    const expanded = collapse ? "expanded" : "";

    return (
      <>
        <tr className={`table-row ${className} ${expanded}`}>{children}</tr>
        <style global jsx>{`
          .table-row {
            background-color: #ffffff;
            flex-wrap: nowrap;
            white-space: nowrap;
            box-shadow: inset 0px -1px 0px #f0f0f0;
          }
          .table-row td {
            border-top: none;
            vertical-align: middle;
          }

          .table-row td.order {
            color: #a2a2a8;
            font-size: 14px;
            font-weight: 600;
          }

          .table-row .row {
            flex-wrap: nowrap;
          }

          .table-row.expanded {
            box-shadow: inset 4px 0px 0px #0598eb, inset 0px -1px 0px #f0f0f0,
              inset 0px 1px 0px #2b9af4, inset -1px 0px 0px #2b9af4;
            transition: height 0.5s 0.5s, opacity 0.5s;
            margin-top: 16px;
            margin-bottom: 16px;
          }

          .table-row.expanded + .table-expand-row {
            box-shadow: inset 4px 0px 0px #0598eb, inset 0px -1px 0px #2b9af4,
              inset -1px 0px 0px #2b9af4;
            transition: height 0.5s 0.5s, opacity 0.5s;
            height: auto;
            opacity: 1;
          }

          .table-row.expanded:first-child {
            margin-top: 0;
          }
        `}</style>
      </>
    );
  }
}

class TableCollapseRow extends PureComponent<Props> {
  render() {
    const { className, children, collapse } = this.props;
    if (!collapse) return null;

    return (
      <>
        <tr className={`table-expand-row ${className}`}>{children}</tr>
        <style global jsx>{`
          .table-expand-row {
            transition: height 0.5s 0.5s, opacity 0.5s;
            height: 0px;
            opacity: 0;
          }

          .table-expand-row td {
            border-top: none;
          }
        `}</style>
      </>
    );
  }
}

const Table = ({ className, children, pagination }: Props) => (
  <div className={`table-section ${className}`}>
    <BaseTable responsive className="table-section-wrapper">
      {children}
    </BaseTable>
    {pagination && (
      <Pagination
        className={pagination.className}
        pageCount={pagination.pageCount}
        marginPagesDisplayed={pagination.marginPagesDisplayed}
        pageRangeDisplayed={pagination.pageRangeDisplayed}
        onPageChange={pagination.onPageChange}
      />
    )}
    <style global jsx>{`
      .table-section {
        background-color: #fafafa;
        border-radius: 8px;
        border: 1px solid #f0f0f1;
        box-shadow: 0px 2px 2px rgba(17, 22, 24, 0.04);
      }

      .table-section-wrapper {
        margin-bottom: 0;
      }

      .table-section thead tr {
        background-color: #f0f0f1;
        // padding: 16px 0;
        white-space: nowrap;
      }

      .table-section thead tr th {
        border: none;
        padding-top: 16px;
        padding-bottom: 16px;
        color: #72727a;
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
      }

      .table-section .table-responsive {
        border-radius: 6px;
      }
    `}</style>
  </div>
);

export { Table, TableRow, TableCollapseRow };
