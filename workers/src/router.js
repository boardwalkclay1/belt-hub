import { Router } from "itty-router";

import * as auth from "./routes/auth.js";
import * as customers from "./routes/customers.js";
import * as rentals from "./routes/rentals.js";
import * as waivers from "./routes/waivers.js";
import * as coupons from "./routes/coupons.js";
import * as pub from "./routes/public.js";

export const router = Router();

// AUTH
router.post("/admin/auth/login", auth.login);

// ADMIN
router.get("/admin/customers", customers.list);
router.post("/admin/customers", customers.create);

router.get("/admin/rentals", rentals.list);
router.post("/admin/rentals/:id/deposit/capture", rentals.captureDeposit);

router.get("/admin/waivers", waivers.list);
router.post("/admin/waivers", waivers.createVersion);

router.get("/admin/coupons", coupons.list);
router.post("/admin/coupons", coupons.create);

// PUBLIC
router.post("/public/customers/upsert", pub.upsertCustomer);
router.get("/public/waivers/current", pub.currentWaiver);
router.post("/public/waivers/sign", pub.signWaiver);
router.post("/public/rentals/start", pub.startRental);
router.post("/public/rentals/end", pub.endRental);

// fallback
router.all("*", () => new Response("Not found", { status: 404 }));
