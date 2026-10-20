# KBC Loop: 4-minute demo script

One story, one customer (Lotte), three interfaces that share one live state. Everything you click is a real
action on the API; the other screens update over the WebSocket within a second.

## Setup (before the jury arrives)

```bash
cd kbc-loop
npm install            # once
npm run demo:reset     # fresh demo state (Lotte, no open repairs, starting Kate Coins)
npm run dev            # api :4000, web :5173, insights :5174, app :8081
```

Open these tabs/windows side by side:

| Window | URL | Role |
|---|---|---|
| Web (customer) | http://localhost:5173/#loop | Lotte on the KBC LOOP site |
| Partner portal | http://localhost:5173/#partner | Philips service desk |
| App | http://localhost:8081 (or Expo Go on a phone) | Lotte in KBC Mobile, Loop tab |
| Insights | http://localhost:5174/#/overview | KBC staff |

Checklist: the persona menu shows **Lotte**, the app is on the **Loop** tab, a photo is ready on the laptop for
the repair report, and the screens are zoomed so the jury can read them.

## Script

### 0:00 to 0:30 The problem and the promise (web)

- Tab **Web**, top of http://localhost:5173/#loop. Let the hero loop animate.
- Say: "We can build robots, but not a washing machine that lasts ten years. That is a business model problem.
  With KBC Loop you pay for the result, the producer keeps the product, and KBC makes it work: bank, insurer and
  orchestrator in one."

### 0:30 to 1:00 Lotte's home and her impact (web)

- Scroll to **Your home**: lights, washing machine, e-bike and more, grouped per room and category.
- Open **Impact** and the costs view (http://localhost:5173/#loop/costs): what she pays per month, how each fee
  is split between partner, insurer and KBC, upcoming payments, and the CO2 saved.
- Say: "One monthly payment, split automatically. Insurance is built in. Durability is rewarded."

### 1:00 to 1:40 Something breaks (web)

- Click the Philips light in Your home, or go to http://localhost:5173/#loop/product/lotte-0.
- Click **Report a problem**, pick an issue, attach a photo, confirm.
- The repair tracker shows the request; no claim forms, no warranty discussion.

### 1:40 to 2:10 The partner acts, the customer sees it live (partner portal + app)

- Tab **Partner portal** (http://localhost:5173/#partner): the new request is at the top.
- Set the status to **Technician on the way**.
- Switch to the **App**: the item shows "Technician on the way" and a notification, without a refresh.
- Say: "Same state, three screens. The partner earns monthly, so a fast repair is in their own interest."

### 2:10 to 2:40 Upgrade or return (web or app)

- On the product page choose **Upgrade** (new model, quote with the new monthly fee) or **Return** (the product
  goes back to the partner for reuse; materials stay in the loop).
- Say: "At the end of life nothing goes to the container park."

### 2:40 to 3:00 Kate Coins rewards (web or app)

- Open **Rewards**: Lotte earned Kate Coins for repairing instead of replacing and for returning.
- Redeem one reward and show the balance drop.

### 3:00 to 3:40 KBC Loop Insights: from signal to campaign (Insights + app)

- Tab **Insights** (http://localhost:5174/#/overview): anonymised groups, e.g. people who repeatedly pay phone
  repairers. Groups under 100 customers are never shown.
- Click **Campaigns** → **New campaign**: pick the group, check the Kate message in the phone preview, set the
  audience and budget, review and launch.
- Switch to the **App**: a new Kate tip appears on Lotte's Loop home.
- Say: "Bank data finds the moment, Kate makes the offer, only with consent."

### 3:40 to 4:00 Share the impact (app or web)

- Open **Share impact**: Lotte's impact card (CO2 saved, repairs, products kept in the loop).
- Close with: "Stop buying things. Start using them. KBC Loop: the longer a product lasts, the more everyone
  earns."

## Fallbacks

- Something looks off: `npm run demo:reset` and reload the tabs (the WebSocket reconnects by itself).
- No network for the phone: use the app in the browser at http://localhost:8081, or the app iframe in the
  presenter view at http://localhost:5173/#loop/presentation.
- Need a hands-free run: the presenter view's **Play demo** button plays the core flow in about 45 seconds.
