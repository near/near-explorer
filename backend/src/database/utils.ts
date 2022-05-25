import { ExpressionBuilder, RawBuilder, sql } from "kysely";
import {
  ExtractTypeFromReferenceExpression,
  StringReference,
} from "kysely/dist/cjs/parser/reference-parser";
import { ExtractColumnType } from "kysely/dist/cjs/util/type-utils";

export const count = <
  DB,
  TB extends keyof DB,
  C extends StringReference<DB, TB>
>(
  expressionBuilder: ExpressionBuilder<DB, TB>,
  column: C
) => expressionBuilder.fn.count<string>(column);

export const sum = <DB, TB extends keyof DB, C extends StringReference<DB, TB>>(
  expressionBuilder: ExpressionBuilder<DB, TB>,
  column: C
): RawBuilder<string | null> => expressionBuilder.fn.sum<string>(column);

export const max = <DB, TB extends keyof DB, C extends StringReference<DB, TB>>(
  expressionBuilder: ExpressionBuilder<DB, TB>,
  column: C
): RawBuilder<ExtractTypeFromReferenceExpression<DB, TB, C> | null> =>
  expressionBuilder.fn.max(column);

export const div = <DB, TB extends keyof DB, C extends string>(
  _eb: ExpressionBuilder<DB, TB>,
  column: StringReference<DB, TB>,
  times: number,
  alias: C
) => {
  // TODO: Evaluation of column type extraction is not correct
  // See example with 'deletion_receipt' table join
  // 'deleted_at_block_timestamp' field should be null-able
  return sql<
    ExtractColumnType<DB, TB, StringReference<DB, TB>> extends null
      ? string | null
      : string
  >`div(${sql.ref(column)}, ${times})`.as(alias);
};
