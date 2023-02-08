export type CurrentEpochState = {
  seatPrice?: string;
  totalStake: string;
  height: number;
};

export type HealthStatus = { timestamp: number } & (
  | {
      ok: true;
    }
  | {
      ok: false;
      message?: string;
    }
);
