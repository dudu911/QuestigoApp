import { UserCreditsRow } from "@repo/types";

export function mapCreditsRowToUI(c: UserCreditsRow) {
  return {
    userId: c.user_id,
    balance: c.balance,
    updatedAt: c.updated_at.toISOString(),
  };
}

export type UserCreditsUI = ReturnType<typeof mapCreditsRowToUI>;
