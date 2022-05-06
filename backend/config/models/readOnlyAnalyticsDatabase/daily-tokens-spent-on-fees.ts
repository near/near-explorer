// @generated
// Automatically generated. Don't change this file manually.

export type DailyTokensSpentOnFeesId = Date & {
  " __flavor"?: "daily_tokens_spent_on_fees";
};

export default interface DailyTokensSpentOnFees {
  /** Primary key. Index: daily_tokens_spent_on_fees_pkey */
  collected_for_day: DailyTokensSpentOnFeesId;

  tokens_spent_on_fees: string;
}

export interface DailyTokensSpentOnFeesInitializer {
  /** Primary key. Index: daily_tokens_spent_on_fees_pkey */
  collected_for_day: DailyTokensSpentOnFeesId;

  tokens_spent_on_fees: string;
}
