import { PurchaseRow } from "@repo/types";

export function mapPurchaseRowToUI(p: PurchaseRow) {
  return {
    id: p.id,
    userId: p.user_id,
    packageId: p.package_id,
    credits: p.credits,
    amount: p.amount,
    currency: p.currency,
    createdAt:
      p.created_at && !isNaN(new Date(p.created_at as any).getTime())
        ? new Date(p.created_at as any).toISOString()
        : null,
  };
}

export type PurchaseUI = ReturnType<typeof mapPurchaseRowToUI>;
