import * as React from "react";

import { Table as BaseTable } from "react-bootstrap";
import { styled } from "../../libraries/styles";

import Pagination, { Props as PaginationProps } from "../utils/Pagination";

const TableExpandRow = styled("tr", {
  transition: "height 0.5s 0.5s, opacity 0.5s",
  height: 0,
  opacity: 0,

  "& td": {
    borderTop: "none",
  },
});

export const TableRowWrapper = styled("tr", {
  backgroundColor: "#ffffff",
  flexWrap: "nowrap",
  whiteSpace: "nowrap",
  boxShadow: "inset 0px -1px 0px #f0f0f0",

  "& td": {
    borderTop: "none",
    verticalAlign: "middle",
  },

  "& .row": {
    flexWrap: "nowrap",
  },

  variants: {
    expanded: {
      true: {
        boxShadow:
          "inset 4px 0px 0px #0598eb, inset 0px -1px 0px #f0f0f0, inset 0px 1px 0px #2b9af4, inset -1px 0px 0px #2b9af4",
        transition: "height 0.5s 0.5s, opacity 0.5s",
        marginVertical: 16,

        [`& + ${TableExpandRow}`]: {
          boxShadow:
            "inset 4px 0px 0px #0598eb, inset 0px -1px 0px #2b9af4, inset -1px 0px 0px #2b9af4",
          transition: "height 0.5s 0.5s, opacity 0.5s",
          height: "auto",
          opacity: 1,
        },

        "&:first-child": {
          marginTop: 0,
        },
      },
    },
  },
});

export const OrderTableCell = styled("td", {
  [`${TableRowWrapper} &`]: {
    color: "#a2a2a8",
    fontSize: 14,
    fontWeight: 600,
  },
});

interface Props {
  className?: string;
  children: React.ReactNode;
  collapse?: boolean;
  pagination?: PaginationProps;
}

export const TableRow: React.FC<Props> = React.memo(
  ({ className, children, collapse }) => {
    return (
      <TableRowWrapper className={className} expanded={collapse}>
        {children}
      </TableRowWrapper>
    );
  }
);

export const TableCollapseRow: React.FC<Props> = React.memo(
  ({ children, collapse }) => {
    if (!collapse) {
      return null;
    }

    return <TableExpandRow>{children}</TableExpandRow>;
  }
);

const TableSection = styled("div", {
  backgroundColor: "#fafafa",
  borderRadius: 6,
  border: "1px solid #f0f0f1",
  boxShadow: "0px 2px 2px rgba(17, 22, 24, 0.04)",

  "& thead tr": {
    backgroundColor: "#f0f0f1",
    whiteSpace: "nowrap",

    "& th": {
      border: "none",
      paddingTop: 16,
      paddingBottom: 16,
      color: "#72727a",
      fontWeight: 500,
      fontSize: 12,
      lineHeight: "15px",
    },
  },
});

const TableSectionWrapper = styled(BaseTable, {
  marginBottom: 0,
});

export const Table: React.FC<Props> = React.memo(
  ({ className, children, pagination }) => (
    <TableSection className={className}>
      <TableSectionWrapper responsive>{children}</TableSectionWrapper>
      {pagination && <Pagination {...pagination} />}
    </TableSection>
  )
);

export type { OnPageChange } from "../utils/Pagination";
