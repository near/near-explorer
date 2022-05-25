// @generated
// Automatically generated. Don't change this file manually.

export type DailyDepositAmountId = Date & {
  " __flavor"?: "daily_deposit_amount";
};

export default interface DailyDepositAmount {
  /** Primary key. Index: daily_deposit_amount_pkey */
  collected_for_day: DailyDepositAmountId;

  deposit_amount: string;
}

export interface DailyDepositAmountInitializer {
  /** Primary key. Index: daily_deposit_amount_pkey */
  collected_for_day: DailyDepositAmountId;

  deposit_amount: string;
}
