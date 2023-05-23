import type {
  UseMutationResult,
  UseQueryResult,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import type { inferRouterProxyClient } from "@trpc/client";
import type { TRPCClientErrorLike } from "@trpc/react-query";
import type {
  inferProcedureInput,
  AnyRouter,
  AnyQueryProcedure,
  AnyMutationProcedure,
  AnySubscriptionProcedure,
  AnyProcedure,
  ProcedureType,
} from "@trpc/server";
import type { inferTransformedProcedureOutput } from "@trpc/server/src/shared/jsonify";

import type { AppRouter } from "@/backend/router";
import type { Flatten } from "@/common/types/common";

// Generic types
type FlattenRouter<TRouter extends AnyRouter> = Flatten<
  {
    [TKey in keyof TRouter["_def"]["record"] &
      string]: TRouter["_def"]["record"][TKey] extends infer TRouterOrProcedure
      ? TRouterOrProcedure extends AnyRouter
        ? FlattenRouter<TRouterOrProcedure>
        : TRouterOrProcedure extends AnyProcedure
        ? TRouterOrProcedure
        : never
      : never;
  },
  AnyProcedure,
  "."
>;

type ProcedureByType<Type extends ProcedureType> = Type extends "query"
  ? AnyQueryProcedure
  : Type extends "mutation"
  ? AnyMutationProcedure
  : Type extends "subscription"
  ? AnySubscriptionProcedure
  : never;

type BaseFlatRouter = Record<string, AnyProcedure>;

type FilterByType<
  FRouter extends BaseFlatRouter,
  PType extends ProcedureType
> = {
  [K in keyof FRouter as FRouter[K] extends ProcedureByType<PType>
    ? K
    : never]: FRouter[K];
};

type FilterInputs<FRouter extends BaseFlatRouter, Target> = {
  [K in keyof FRouter as inferProcedureInput<FRouter[K]> extends Target
    ? K
    : never]: FRouter[K];
};

// Specific types
type FlatRouter = FlattenRouter<AppRouter>;

type TRPCQueryValues = FilterByType<FlatRouter, "query">;
type TRPCMutationValues = FilterByType<FlatRouter, "mutation">;
type TRPCSubscriptionValues = FilterByType<FlatRouter, "subscription">;
type TRPCInfiniteQueryValues = FilterInputs<
  TRPCQueryValues,
  { cursor?: unknown }
>;

export type TRPCError = TRPCClientErrorLike<AppRouter>;

export type TRPCQueryKey = keyof TRPCQueryValues & string;

export type TRPCQueryInput<Path extends TRPCQueryKey> = inferProcedureInput<
  TRPCQueryValues[Path]
>;

export type TRPCQueryOutput<Path extends TRPCQueryKey> =
  inferTransformedProcedureOutput<TRPCQueryValues[Path]>;

export type TRPCQueryResult<Path extends TRPCQueryKey> = UseQueryResult<
  TRPCQueryOutput<Path>,
  TRPCError
>;

export type TRPCInfiniteQueryKey = keyof TRPCInfiniteQueryValues;

export type TRPCInfiniteQueryInput<Path extends TRPCInfiniteQueryKey> = Omit<
  inferProcedureInput<TRPCInfiniteQueryValues[Path]>,
  "cursor"
>;
export type TRPCInfiniteQueryOutput<Path extends TRPCInfiniteQueryKey> =
  inferTransformedProcedureOutput<TRPCInfiniteQueryValues[Path]>;

export type TRPCInfiniteQueryCursor<Path extends TRPCInfiniteQueryKey> =
  inferProcedureInput<TRPCInfiniteQueryValues[Path]> extends {
    cursor?: unknown;
  }
    ? inferProcedureInput<TRPCInfiniteQueryValues[Path]>["cursor"]
    : never;

export type TRPCInfiniteQueryResult<Path extends TRPCInfiniteQueryKey> =
  UseInfiniteQueryResult<TRPCInfiniteQueryOutput<Path>, TRPCError>;

export type TRPCMutationKey = keyof TRPCMutationValues;

export type TRPCMutationInput<Path extends TRPCMutationKey> =
  inferProcedureInput<TRPCMutationValues[Path]>;

export type TRPCMutationOutput<Path extends TRPCMutationKey> =
  inferTransformedProcedureOutput<TRPCMutationValues[Path]>;

export type TRPCMutationResult<Path extends TRPCMutationKey> =
  UseMutationResult<
    TRPCMutationOutput<Path>,
    TRPCError,
    TRPCMutationInput<Path>
  >;

export type TRPCSubscriptionKey = keyof TRPCSubscriptionValues;

export type TRPCSubscriptionInput<Path extends TRPCSubscriptionKey> =
  inferProcedureInput<TRPCSubscriptionValues[Path]>;

export type TRPCSubscriptionOutput<Path extends TRPCSubscriptionKey> =
  inferTransformedProcedureOutput<TRPCSubscriptionValues[Path]>;

export type TRPCSubscriptionResult<Path extends TRPCSubscriptionKey> =
  UseQueryResult<TRPCSubscriptionOutput<Path>, TRPCError>;

export type TRPCClient = inferRouterProxyClient<AppRouter>;

export type { AppRouter };
