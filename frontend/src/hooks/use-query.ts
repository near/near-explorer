import * as ReactQuery from "react-query";
import { ProcedureArgs, ProcedureResult, ProcedureType } from "../types/common";
import { useFetcher } from "./use-fetcher";

export const useQuery = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>,
  options: Omit<
    ReactQuery.UseQueryOptions<
      ProcedureResult<P>,
      unknown,
      ProcedureResult<P>,
      ReactQuery.QueryKey
    >,
    "queryKey" | "queryFn"
  > = {}
) => {
  const fetcher = useFetcher();
  return ReactQuery.useQuery<
    ProcedureResult<P>,
    unknown,
    ProcedureResult<P>,
    ReactQuery.QueryKey
  >(["procedure", procedure, ...args], () => fetcher(procedure, args), {
    ...(options || {}),
    onError: (error) => {
      console.error(error);
      console.error(new Error("Fetch fail").stack);
      options.onError?.(error);
    },
  });
};

export const useQueryOrDefault = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>,
  defaultValue: ProcedureResult<P>,
  options: Omit<
    ReactQuery.UseQueryOptions<
      ProcedureResult<P>,
      unknown,
      ProcedureResult<P>,
      ReactQuery.QueryKey
    >,
    "queryKey" | "queryFn"
  > = {}
) => {
  return useQuery(procedure, args, options).data ?? defaultValue;
};
