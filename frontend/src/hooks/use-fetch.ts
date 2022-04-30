import * as React from "react";
import {
  ProcedureArgs,
  ProcedureResult,
  ProcedureType,
} from "../types/procedures";
import { useFetcher } from "./use-fetcher";

export const useFetch = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>,
  disabled?: boolean
) => {
  const [value, setValue] = React.useState<ProcedureResult<P>>();
  const fetcher = useFetcher();
  const fetchValue = React.useCallback(
    async () => setValue(await fetcher(procedure, args)),
    [setValue, procedure, fetcher, ...args]
  );
  React.useEffect(() => {
    if (disabled) {
      return;
    }
    void fetchValue().catch((error) => {
      console.error(new Error("Fetch fail").stack);
      console.error(error);
    });
  }, [fetchValue, disabled]);
  return value;
};
