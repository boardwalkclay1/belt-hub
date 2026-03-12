import { Router } from 'itty-router';

// ADMIN ROUTES
import * as customers from './routes/customers.js';
import * as waivers from './routes/waivers.js';
import * as rentals from './routes/rentals.js';
import * as coupons from './routes/coupons.js';
import * as auth from './routes/auth.js';

// PUBLIC ROUTES (client app)
import * as pub from './routes/public.js';

export const router = Router();

/* -----------------------------
   AUTH (Admin Login)
------------------------------ */
router.post('/admin/auth/login', auth.login);

/* -----------------------------
   ADMIN ROUTES
------------------------------ */

// Customers
router.get('/admin/customers', customers.list);
router.post('/admin/customers', customers.create);

// Waivers
router.get('/admin/waivers', waivers.list);
router.post('/admin/waivers', waivers.createVersion);

// Rentals
router.get('/admin/rentals', rentals.list);
router.post('/admin/rentals/:id/deposit/capture', rentals.captureDeposit);

// Coupons
router.get('/admin/coupons', coupons.list);
router.post('/admin/coupons', coupons.create);

/* -----------------------------
   PUBLIC ROUTES (Client App)
------------------------------ */

// Customer creation/upsert
router.post('/public/customers/upsert', pub.upsertCustomer);

// Waivers
router.get('/public/waivers/current', pub.currentWaiver);
router.post('/public/waivers/sign', pub.signWaiver);

// Rentals
router.post('/public/rentals/start', pub.startRental);
router.post('/public/rentals/end', pub.endRental);

/* -----------------------------
   FALLBACK
------------------------------ */
router.all('*', () => new Response("Not found", { status: 404 }));
