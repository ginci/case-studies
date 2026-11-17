# Tranzakt case study rewrite (17 Nov 2026)

Tranzakt is now positioned as a **B2B payments platform**. Its core, live product is the **Business Suite** (merchant dashboard, payment links, collections and a hosted checkout). **Treasury** (multi-bank consolidation) is not live, so it moves to the last section and is labelled "not yet live".

Written to the CMS, not published. The previous text is in `tranzakt-cms-before-2026-11-17.json`.

**Please check:** the problem section (S01) is my framing of how businesses got paid before. Correct it if it doesn't match what you saw.

| Field | New text |
|---|---|
| Index line | B2B fintech. Business payments: payment links, collections and checkout |
| Lede | Leading product design for Tranzakt, a B2B payments platform for Nigerian businesses. At its core is the Business Suite, where merchants get paid by their customers through payment links, collections and a hosted checkout, on web and mobile. |
| Result | One suite where a business sets up, requests money and gets paid, with a checkout that shows only the fee the customer pays and verification that always shows the next step. |
| Stats | 1 Business Suite: links, collections, checkout · 4 payment methods, web = mobile · 2 user types: merchants & their customers · 3 account types, one verification flow |

## Sections (sidebar order)
1. **The problem:** Nigerian businesses take payments by transfer, card and USSD, often with no simple way to request a payment, see who has paid, and match it to the right customer.
2. **Approach:** unchanged principles. Scope now reads: Business Suite (merchant dashboard, payment links and collections), checkout, KYC/KYB verification and the mobile app. "I also designed Treasury, a multi-bank view that hasn't launched yet."
3. **Results:**
   - a faster first day
   - payment requests that carry everything
   - no surprise fees
   - verification that doesn't stall
4. **Business Suite** (new, first feature, merchant dashboard image): the to-do list that leads to a first payment, test API keys, the payment link page (type, amount, description, settlement account, customer details, copy/visit, invoices tab) and the payment email with a secure link.
5. **Checkout:** unchanged.
6. **Verification:** unchanged.
7. **Treasury (not yet live)** (last, Treasury image): designed, not launched.

## Images
- Cover and Preview now show the merchant dashboard (with the mobile verification screen) instead of Treasury.
- The S06 and S09 images were swapped to match the new section order.
