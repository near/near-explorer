import * as ReactQuery from "react-query";
import { getProcedureKey } from "../libraries/queries";
import {
  ProcedureArgs,
  ProcedureResult,
  ProcedureType,
  ProcedureTypes,
} from "../types/common";
import { useFetcher } from "./use-fetcher";

type UseInfiniteQueryOptions<
  P extends ProcedureType
> = ReactQuery.UseInfiniteQueryOptions<
  ProcedureResult<P>,
  unknown,
  ProcedureResult<P>,
  ProcedureResult<P>,
  ReactQuery.QueryKey
>;

type GetNonMatchingKeys<Base, Condition> = keyof Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? never : Key;
  }[keyof Base]
>;

type InfiniteProcedureType = GetNonMatchingKeys<
  {
    [K in ProcedureType]: ProcedureTypes[K]["args"] extends {
      cursor: unknown;
    }
      ? K
      : never;
  },
  "never"
>;

export const useInfiniteQuery = <P extends InfiniteProcedureType>(
  procedure: P,
  args: Omit<ProcedureArgs<P>, "cursor">,
  options: Omit<
    UseInfiniteQueryOptions<P>,
    "queryKey" | "queryFn" | "getNextPageParam"
  > &
    Required<Pick<UseInfiniteQueryOptions<P>, "getNextPageParam">>
) => {
  const fetcher = useFetcher();
  return ReactQuery.useInfiniteQuery<
    ProcedureResult<P>,
    unknown,
    ProcedureResult<P>,
    ReactQuery.QueryKey
  >(
    getProcedureKey(procedure, args as ProcedureArgs<P>),
    (context) => fetcher(procedure, { ...args, cursor: context.pageParam }),
    {
      ...(options || {}),
      onError: (error) => {
        console.error(error);
        console.error(new Error("Infinite fetch fail").stack);
        options.onError?.(error);
      },
    }
  );
};
