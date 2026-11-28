# Case study drafts for approval (15 Nov 2026)

Drafted from the Figma files you shared. Nothing here is in the CMS yet.

Each case study follows the template on the site:

- **Facts:** industry, client, role, team.
- **Outcome:** one line plus up to four figures.
- **Sidebar sections:** The problem → Approach → feature sections → Results.
- **Each section:** a one-line summary (the short version), then the detail behind "Read the full story". Feature sections use Problem / Solution / Result.

Items marked **[confirm]** are things the files can't tell me. Please correct or approve them. I've used no invented numbers. The figures are counts taken from the files.

Proposed order: **Tranzakt, 9mobile and Dado Foods** featured on Home; **NSIA** and **CreatorScribe** on the Work page.

---

## 1. 9mobile: website, eShop and the CMS behind them

**Lede:** A redesign of 9mobile's website, eShop, blog and events pages, and the content management system the marketing team uses to run them.

| Fact | |
|---|---|
| Industry | Telecoms, Nigeria |
| Client | 9mobile [confirm: hired directly or through an agency?] |
| Role | Product designer, with Emmanuel Kalu [confirm: lead or co-designer?] |
| Team | 2 designers [confirm: engineers, PM] |
| Year | 2023 (from the handoff cover) |

**Outcome line:** One design language and one CMS behind the website, eShop, blog and events, so marketing can build, schedule and publish pages without a developer for every change.

**Figures:**
- 4 public products, 1 CMS
- 4 reusable page templates
- Scheduled publishing
- Role-based access for the content team

### The problem
*Summary:* A telecom website has to sell plans, data and devices, keep up with weekly promotions, and still answer support questions, and every content change used to need a developer. [confirm]

*Detail:* People come to a telecom site to do something quickly: buy airtime or data, compare plans, switch network or buy a phone. 9mobile also needed room for offers, news, events and legal pages that change every week. The design had to make the common tasks fast, and let the marketing team keep the site current on their own.

### Approach
*Summary:* I put customers' top tasks on the home page, built every page from reusable sections, then designed the CMS around those same sections.

*Detail:*
1. **Tasks first:** buying airtime and data, plans, Switch to 9mobile and search sit on the home page, not three clicks deep.
2. **Pages from sections:** heroes, offer carousels, plan tables, benefits and CTAs became reusable sections, and four page templates cover new campaigns.
3. **CMS mirrors the site:** each section has its own editing form with the rules built in (for example, the home slider takes one to three slides).
4. **Every state:** loading, processing, empty search and no-results states are designed, not just the happy path.

### Website
*Summary:* A home page built around what customers came to do: buy airtime and data, find a plan, or switch network.
- **Problem:** key tasks were buried under promotions.
- **Solution:** buying airtime and data inline on the home page, prepaid and postpaid plans side by side, Smartpaks and data plans with empty states, Switch to 9mobile, digital services, search and FAQ.
- **Result:** the most common tasks start from the first screen.

### eShop
*Summary:* A store for phones, routers and data bundles with filters, comparison and a quick add-to-cart.
- **Problem:** devices and bundles were hard to browse and compare.
- **Solution:** category tabs (smartphones, accessories, airtime and data bundles, routers and MiFi), filters, grid or list view, compare, stock labels, and add to cart from the grid.
- **Result:** shoppers compare and buy without leaving the listing.

### Content management system
*Summary:* The backbone of the website and eShop: marketing edits sections, builds pages from templates, schedules updates and manages who can do what.
- **Problem:** every page change needed engineering time.
- **Solution:**
  - one dashboard for Website, eShop, Blog and User management;
  - section-by-section editing (text, buttons, links, media) with limits shown on each section;
  - four dynamic page templates;
  - "Schedule for later" or "Publish now";
  - users with roles and permissions.
- **Result:** the content team runs the site, and engineering focuses on product work.

### Results
*Summary:* One system for four public products: customers reach their task faster, and marketing ships content on its own schedule.
- One component library across website, eShop, blog and events.
- New campaign pages built from templates, not from scratch.
- Publishing scheduled ahead of launches.
- [confirm: anything you know about launch, traffic or sales]

**Images to use:** home page (full), eShop product grid, CMS "What do you want to do today?" dashboard, section editor with "Schedule for later", one dynamic page template.

---

## 2. Dado Foods (refresh of the approved version)

The structure and copy we approved stay the same. The Figma files add the following, which I suggest working in:

- **Scope grows:**
  - customer mobile app and web app;
  - vendor app (orders, menu, analytics, wallet);
  - courier and vendor recruitment landing pages;
  - Menu as a Service.
- **New feature section: "Checkout & wallet"**
  - *Summary:* Delivery or pick-up at checkout, and a wallet that makes repeat orders one tap.
  - *Problem / Solution / Result:* separate delivery and pick-up flows with the right fields for each, plus a wallet with balance, funding, history and search.
- **New feature section: "Menu as a Service"**
  - *Summary:* Restaurants without their own app publish a QR-code menu from ready-made templates.
  - *Solution:* business setup, menu builder, a template gallery, published and saved menus, and a dashboard of menu views, QR scans and orders.
- **Detail worth a line in Ordering:** customers get "1 hour" and "30 minutes to closing time" notices, so they don't order from a kitchen about to close.
- **Images:**
  - Explore with the food court and food market
  - checkout with delivery and pick-up
  - the wallet
  - the customer landing page
  - the Menu as a Service dashboard
  - the template gallery
- **[confirm]:**
  - your title (Lead product designer?)
  - year
  - whether Menu as a Service launched

---

## 3. NSIA: fertiliser supply chain platform

**Lede:** A supply-chain platform that tracks fertiliser raw materials from port to warehouse to blending site, so every party in the chain works from the same record.

| Fact | |
|---|---|
| Industry | Agriculture supply chain, Nigeria |
| Client | NSIA, through Devstudio (Genesys Tech Hub) |
| Role | Product designer, with Onyedikachi Agonsi |
| Year | 2022 |

**Outcome line:** Requests, releases, production and reports for six stakeholder groups in one platform, every flow specified before it was built.

**Figures:**
- 6 stakeholder roles
- 8 report types
- Acceptance criteria for every flow
- Role-based dashboards

### The problem
*Summary:* Raw materials moved through ports, warehouses and blending plants run by different parties, and NSIA had no single view of stock, releases or output. [confirm: how was it tracked before? Email and spreadsheets?]

*Detail:* Clearing agents discharge vessels at the port. Collateral managers hold stock at ports, warehouses and blending sites. Blenders request raw materials and turn them into NPK fertiliser. NSIA approves what is released. Each hand-off was a chance for records to disagree.

### Approach
*Summary:* I mapped every role and hand-off, wrote acceptance criteria for each flow, then designed one dashboard that changes by role.

*Detail:*
1. **Roles first:** clearing agents, collateral managers (port, warehouse, blending site), blenders, port operators, logistics and NSIA admins.
2. **Spec before screens:** every flow has Given / When / Then scenarios, including errors and system failures, so engineering and QA built against the same rules.
3. **One shell, many roles:** the same navigation and table patterns, with each role seeing only its own menu.
4. **Every state:** empty, amended, flagged, rejected with a comment, and confirmed.

### Indents and release orders
*Summary:* Blenders request raw materials, and NSIA releases, amends, flags or rejects each request with a reason everyone can see.
- **Problem:** requests and approvals lived in separate inboxes.
- **Solution:** indent requests with amendment history, NSIA release orders with negative releases, flagging and rejection with comments, and email notifications at each step.
- **Result:** every request has one status and one history.

### Daily production
*Summary:* Blenders log daily NPK output and raw material use, and the collateral manager confirms or rejects it.
- **Problem:** NSIA couldn't verify production against the raw materials released.
- **Solution:** a daily production log (NPK produced, plus raw material usage) with a confirm or reject step by the collateral manager.
- **Result:** production figures are checked at the source.

### Purchase orders and discharge
*Summary:* A purchase moves from NSIA to the port and warehouse, with each party confirming its step.
- **Solution:** NSIA starts the purchase, the clearing agent records the vessel discharge, and the collateral manager confirms receipt.

### Reports
*Summary:* Each role downloads the report it is accountable for.
- **Solution:** vessel discharge, raw material receipts, warehouse receipts and offtakes, release reports, raw material usage, daily production and production summary. Each can be filtered by date and downloaded.

### Results
*Summary:* One record of fertiliser raw materials from port to blending plant, shared by every party in the chain.
- [confirm: did it go live? any outcome you can share?]

**Images to use:** a role dashboard, the indent release order flow, the daily production confirmation, the reports menu.

---

## 4. CreatorScribe (currently "Content Scribe" in the CMS)

**Lede:** An AI workspace that takes a creator from topic idea to recorded, repurposed video in one place.

| Fact | |
|---|---|
| Industry | AI, creator tools |
| Client | CreatorScribe [confirm: client or your own product?] |
| Role | Product designer (sole designer, from the cover) |
| Year | [confirm] |

**Outcome line:** Eight AI tools arranged as one pipeline (research, script, record, repurpose, schedule), with token usage visible everywhere.

**Figures:**
- 8 AI tools, 1 workspace
- Pipeline from idea to publish
- Token-based pricing
- Landing page to dashboard

### The problem
*Summary:* Creators juggle separate apps to research, script, record, dub and schedule, and lose momentum at every hand-off.

### Approach
*Summary:* I designed around the creator's pipeline: Research → Script → Record → Repurpose → Publish. Each tool is one focused screen with one input and clear options.

### Research and script
*Summary:* Find a topic by keyword, country and language, then generate a script by tone, type, audience and platform.
- The parameters are simple chips, not long forms.

### Record
*Summary:* A teleprompter with speed, font and display controls that switches straight into full-screen recording.

### Repurpose
*Summary:* Turn one recording into more: video repurpose, content redub, AI voice-over and audio enhancement.

### Plan and pay
*Summary:* A scheduler for publishing, and tokens with funding, transaction history and clear balances.

### Results
*Summary:* One workspace instead of six apps.
- [confirm: did it launch? any users or trials?]

**Images to use:** the landing page (dark), the dashboard, the script writer, the teleprompter.

---

## 5. Tranzakt Finance

No change: already in the CMS in the new structure.

---

## Playground (proposed tab on the Work page)

Small tiles: an image, a title and one line, linking out or opening larger.

1. **Dado: app store screenshots:** four-screen store set for iOS and Android.
2. **Dado: courier and vendor landing pages:** recruitment pages, "Become a Hero" and "Become a Dado Partner".
3. **Dado: Menu as a Service templates:** a gallery of digital menu templates.
4. **CreatorScribe: landing page:** dark AI SaaS landing page.
5. **9mobile: Treelz game pages:** games subscription pages.
6. **9mobile and Dado: email templates:** onboarding, transaction and marketing emails.
7. **Tranzakt: payment gateway explorations:** checkout explorations.
8. **Dado customer web app V1**

---

## Template candidates (for selling later)

| Design | Template potential | Notes |
|---|---|---|
| CreatorScribe landing page | **High.** AI and SaaS landing pages sell well | Dark gradient, clear sections; swap the brand for a neutral one |
| Dado landing pages (customer, courier, vendor) | **High.** A three-audience marketplace landing kit | Food delivery, logistics and multi-sided marketplaces |
| Menu as a Service menu templates | **High.** Restaurant QR menu templates | Could sell as a Framer or Figma menu kit |
| 9mobile dynamic page templates | Medium | Corporate and telecom; too brand-specific as it stands |
| CreatorScribe dashboard | Medium | AI tool dashboard UI kit |

**Before selling anything made for a client, check your contract:** client work usually belongs to the client. The safe route is to rebuild the layout from scratch with new branding, copy and images, and treat the client file as inspiration only.

---

## Still needed from you

1. Approve or edit each draft, and fill the [confirm] items.
2. The **Dado vendor app** file was rate-limited by Figma, so I couldn't export its screens. It's covered by the existing Dado copy, but I'll pull images once the limit resets.
3. Should the CMS item be renamed from "Content Scribe" to **CreatorScribe**?
4. The "Mobile app" placeholder project: remove it?
