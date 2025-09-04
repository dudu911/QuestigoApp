import { PurchaseRow } from "@repo/types";
import { safeDate } from "../utils/date";

export function mapPurchaseRowToUI(p: PurchaseRow) {
  return {
    id: p.id,
    userId: p.user_id,
    packageId: p.package_id,
    credits: p.credits,
    amount: p.amount,
    currency: p.currency,
    createdAt: safeDate(p.created_at).toISOString(),
  };
}

export type PurchaseUI = ReturnType<typeof mapPurchaseRowToUI>;
