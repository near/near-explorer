import { ColumnType } from "kysely";

type TableColumnType<
  SelectTable,
  InsertTable extends Partial<SelectTable>,
  UpdateTable extends Partial<SelectTable>
> = Required<{
  [Column in keyof SelectTable]: ColumnType<
    SelectTable[Column],
    InsertTable[Column],
    UpdateTable[Column]
  >;
}>;

type SecondDeepPartial<T> = {
  [LK in keyof T]: Partial<T[LK]>;
};

export type DatabaseColumnType<
  SelectDatabase,
  InsertDatabase extends SecondDeepPartial<SelectDatabase> &
    Record<string, never>,
  UpdateDatabase extends SecondDeepPartial<SelectDatabase> &
    Record<string, never>
> = {
  [Table in keyof SelectDatabase]: TableColumnType<
    SelectDatabase[Table],
    InsertDatabase[Table],
    UpdateDatabase[Table]
  >;
};
