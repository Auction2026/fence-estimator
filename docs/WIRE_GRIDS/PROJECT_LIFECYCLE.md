# Project Lifecycle

## Overview

This diagram shows the full lifecycle of a project from first contact with a customer through to completion and payment.

```
CUSTOMER INQUIRY
       │
       ▼
┌──────────────────────────────────────────┐
│  LEAD / PROSPECT                         │
│  • Customer contact captured             │
│  • Site visit scheduled                  │
└───────────────────┬──────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│  ESTIMATE CREATED                        │
│  • Tab 1: Project info entered           │
│  • Tab 2: Fence specs entered            │
│  • Tab 3: Site measured / drawn          │
│  • Tab 4–8: All costs calculated         │
│  • Tab 9: Estimate summary reviewed      │
│  • Status: ESTIMATE                      │
└───────────────────┬──────────────────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
     Customer              Customer
     DECLINES              ACCEPTS
          │                   │
          ▼                   ▼
   Project CLOSED      CONTRACT CREATED
                       (Tab 10)
                       Price LOCKED
                             │
                             ▼
               ┌─────────────────────────────┐
               │  PROJECT ACTIVE             │
               │  • Scheduling set (Tab 12)  │
               │  • Materials ordered (13)   │
               │  • Work begins              │
               └──────────────┬──────────────┘
                              │
               ┌──────────────┴──────────────┐
               │                             │
          NO CHANGES                   CHANGES NEEDED
               │                             │
               │                  Change Order created (Tab 11)
               │                  Customer approves change
               │                  Price updated
               │                             │
               └──────────────┬──────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │  WORK IN PROGRESS           │
               │  • Progress tracked (14)    │
               │  • Photos / notes added     │
               │  • Progress billing (15)    │
               └──────────────┬──────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │  COMPLETION                 │
               │  • Final walkthrough        │
               │  • Customer sign-off (16)   │
               │  • Final invoice sent (15)  │
               └──────────────┬──────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │  PAYMENT RECEIVED           │
               │  • Payment marked in system │
               │  • Project archived         │
               └─────────────────────────────┘
                              │
                              ▼
                          COMPLETE
```

---

## Project Status Values

| Status | Description |
|---|---|
| Estimate | Estimate created, not yet accepted |
| Accepted | Customer accepted, contract not yet signed |
| Contract | Contract signed, price locked |
| Active | Work in progress |
| Complete | Work done, sign-off received |
| Invoiced | Final invoice sent |
| Paid | Payment received, project closed |
| Cancelled | Project cancelled at any stage |
