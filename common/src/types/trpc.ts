import type { TRPCClientErrorLike } from "@trpc/react";
import type { Procedure } from "@trpc/server/dist/declarations/src/internals/procedure";
import type {
  Router,
  ProcedureRecord,
} from "@trpc/server/dist/declarations/src/router";
import type { Subscription } from "@trpc/server/dist/declarations/src/subscription";
import type {
  inferProcedureFromOptions,
  CreateProcedureOptions,
  CreateProcedureWithoutInput,
} from "@trpc/server/dist/declarations/src/internals/procedure";
import type { TRPCClient as _TRPCClient } from "@trpc/client";
import { UseMutationResult, UseQueryResult } from "react-query";

import type { AppRouter } from "../../../backend/src/router";

export type AnyRouter<TContext = any> = Router<
  any,
  TContext,
  any,
  any,
  any,
  any,
  any
>;
type AnyProcedure = Procedure<any, any, any, any, any, any, any>;
type AnyProcedureRecord = ProcedureRecord<any, any, any, any, any, any>;
type AnyCreateProcedureOptions = CreateProcedureOptions<
  any,
  any,
  any,
  any,
  any,
  any
>;

export type CreateProcedureSubscription<
  R extends AnyRouter,
  Output
> = R extends Router<any, infer Context, infer Meta, any, any, any, any>
  ? CreateProcedureWithoutInput<Context, Meta, Output, Output>
  : never;

type ProcedureWithOutputSubscription<
  TOptions extends CreateProcedureOptions<any, any, any, any, any, any>
> = TOptions extends CreateProcedureOptions<
  infer TContext,
  infer TMeta,
  infer TInput,
  infer TParsedInput,
  infer TOutput,
  infer TParsedOutput
>
  ? CreateProcedureOptions<
      TContext,
      TMeta,
      TInput,
      TParsedInput,
      Subscription<TOutput>,
      TParsedOutput
    >
  : never;

export type RouterWithSubscriptionsAndQueries<
  R extends AnyRouter,
  SubscriptionProcedures extends Record<string, AnyCreateProcedureOptions>
> = R extends Router<
  infer InputContext,
  infer Context,
  infer Meta,
  infer Queries,
  infer Mutations,
  infer Subscriptions,
  infer Error
>
  ? Router<
      InputContext,
      Context,
      Meta,
      Queries & {
        [Path in keyof SubscriptionProcedures]: inferProcedureFromOptions<
          InputContext,
          SubscriptionProcedures[Path]
        >;
      },
      Mutations,
      Subscriptions & {
        [Path in keyof SubscriptionProcedures]: inferProcedureFromOptions<
          InputContext,
          ProcedureWithOutputSubscription<SubscriptionProcedures[Path]>
        >;
      },
      Error
    >
  : never;

type InferProcedureInput<P extends AnyProcedure> = P extends Procedure<
  any,
  any,
  any,
  infer Input,
  any,
  any,
  any
>
  ? undefined extends Input
    ? Input | null | void
    : Input
  : undefined;

type InferProcedureOutput<P extends AnyProcedure> = Awaited<
  ReturnType<P["call"]>
>;

type InferProcedures<Obj extends AnyProcedureRecord> = {
  [Path in keyof Obj]: {
    input: InferProcedureInput<Obj[Path]>;
    output: InferProcedureOutput<Obj[Path]>;
  };
};

type InferInfiniteQueryNames<Obj extends AnyProcedureRecord> = {
  [Path in keyof Obj]: InferProcedureInput<Obj[Path]> extends {
    cursor?: any;
  }
    ? Path
    : never;
}[keyof Obj];

type InferHandlerInput<TProcedure extends AnyProcedure> =
  TProcedure extends Procedure<any, any, any, infer TInput, any, any, any>
    ? undefined extends TInput // ? is input optional
      ? unknown extends TInput // ? is input unset
        ? [(null | undefined)?] // -> there is no input
        : [(TInput | null | undefined)?] // -> there is optional input
      : [TInput] // -> input is required
    : [(undefined | null)?]; // -> there is no input

type InferQueryNameByResult<Obj extends AnyProcedureRecord, R> = {
  [Path in keyof Obj]: InferProcedureInput<Obj[Path]> extends R ? Path : never;
}[keyof Obj];

type TypeKey = "queries" | "mutations" | "subscriptions";

type DefValues<
  Router extends AnyRouter,
  Type extends TypeKey
> = InferProcedures<Router["_def"][Type]>;

type DefKey<
  Router extends AnyRouter,
  Type extends TypeKey
> = keyof Router["_def"][Type];

type InferSubscription<S> = S extends Subscription<infer D> ? D : never;

export type TRPCQueryKey = DefKey<AppRouter, "queries">;

type QueriesDefs = AppRouter["_def"]["queries"];

export type TRPCInfiniteQueryKey = InferInfiniteQueryNames<QueriesDefs>;

export type TRPCInferQueryKey<R> = InferQueryNameByResult<QueriesDefs, R>;

export type TRPCQueryInput<Path extends TRPCQueryKey> = DefValues<
  AppRouter,
  "queries"
>[Path]["input"];

export type TRPCQueryOutput<Path extends TRPCQueryKey> = DefValues<
  AppRouter,
  "queries"
>[Path]["output"];

export type TRPCQueryResult<Path extends TRPCQueryKey> = UseQueryResult<
  TRPCQueryOutput<Path>,
  TRPCError
>;

export type TRPCMutationKey = DefKey<AppRouter, "mutations">;

export type TRPCMutationInput<Path extends TRPCMutationKey> = DefValues<
  AppRouter,
  "mutations"
>[Path]["input"];

export type TRPCMutationOutput<Path extends TRPCMutationKey> = DefValues<
  AppRouter,
  "mutations"
>[Path]["output"];

export type TRPCMutationResult<Path extends TRPCMutationKey> =
  UseMutationResult<
    TRPCMutationOutput<Path>,
    TRPCError,
    TRPCMutationInput<Path>
  >;

export type TRPCSubscriptionKey = DefKey<AppRouter, "subscriptions">;

export type TRPCSubscriptionInput<Path extends TRPCSubscriptionKey> =
  InferSubscription<DefValues<AppRouter, "subscriptions">[Path]["input"]>;

export type TRPCSubscriptionOutput<Path extends TRPCSubscriptionKey> =
  InferSubscription<DefValues<AppRouter, "subscriptions">[Path]["output"]>;

export type TRPCSubscriptionInputs<Path extends TRPCSubscriptionKey> =
  InferHandlerInput<AppRouter["_def"]["subscriptions"][Path]>;

export type TRPCError = TRPCClientErrorLike<AppRouter>;

export type TRPCClient = _TRPCClient<AppRouter>;

export type { AppRouter };
