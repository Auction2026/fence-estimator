# PRICING LOCK FLOW DIAGRAM
**Fence Estimator Pro** – How Price Locking Works

```
                    TAB 8: ESTIMATE
                         │
                         │ Calculate Estimate
                         │ (client-side)
                         │
                    ┌────▼────────────────────────┐
                    │  ESTIMATE TOTAL: $X,XXX.XX  │
                    │  (not locked)               │
                    └────┬────────────────────────┘
                         │
                         │ Click: "Create Contract"
                         │
                    ┌────▼────────────────────────┐
                    │  CONTRACT CREATED            │
                    │  totalPrice = $X,XXX.XX     │
                    │  priceLocked = TRUE 🔒      │
                    └────┬────────────────────────┘
                         │
                         │ Saved to localStorage + DB
                         │
                    TAB 9: CONTRACT
                         │
                    ┌────▼────────────────────────┐
                    │ 🔒 PRICE LOCKED BANNER       │
                    │ "Contract total is locked.   │
                    │  Changes require a Change    │
                    │  Order."                     │
                    └────┬────────────────────────┘
                         │
              ┌──────────┴──────────────────┐
              │                             │
              │ No changes                  │ Change needed
              ▼                             ▼
    ┌─────────────────┐         ┌──────────────────────┐
    │ Price stays     │         │   TAB 12:            │
    │ locked at       │         │   NEW CHANGE ORDER   │
    │ original $X,XXX │         │                      │
    └─────────────────┘         │ Enter:               │
                                │ - Description        │
                                │ - Material Δ +/-     │
                                │ - Labour Δ +/-       │
                                │ - Customer approves  │
                                └──────────┬───────────┘
                                           │
                                ┌──────────▼───────────┐
                                │  NEW TOTAL CALCULATED │
                                │                       │
                                │  originalTotal        │
                                │  + materialDelta      │
                                │  + labourDelta        │
                                │  ÷ (1 + tax)          │
                                │  × (1 + tax)          │
                                │  = newTotal           │
                                └──────────┬───────────┘
                                           │
                                ┌──────────▼───────────┐
                                │  CHANGE ORDER SIGNED  │
                                │  Customer signature   │
                                │  recorded             │
                                │  Status: approved     │
                                └──────────────────────┘

PRICE LOCK RULES:
✅ Estimate tab can be recalculated (before contract)
✅ Change Orders can adjust contract total (with approval)
❌ Cannot directly edit contract total after creation
❌ Cannot re-generate contract without new Change Order
```
