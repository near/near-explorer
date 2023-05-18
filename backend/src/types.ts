export type HealthStatus = { timestamp: number } & (
  | {
      ok: true;
    }
  | {
      ok: false;
      message?: string;
    }
);
