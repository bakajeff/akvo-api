import type { JwtVariables } from "hono/jwt";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { jwt } from "hono/jwt";

import { env } from "@/env";

import approveOrder from "@/controllers/approve-order";
import authenticateFromLink from "@/controllers/authenticate-from-link";
import cancelOrder from "@/controllers/cancel-order";
import createOrder from "@/controllers/create-order";
import dispatchOrder from "@/controllers/dispatch-order";
import getProfile from "@/controllers/get-profile";
import registerCustomer from "@/controllers/register-customer";
import registerStore from "@/controllers/register-store";
import sendAuthenticationLink from "@/controllers/send-authentication-link";

type Variables = JwtVariables & {
	storeId: string;
};

const app = new Hono<{ Variables: Variables }>();

app.route("/authenticate", sendAuthenticationLink);
app.route("/auth-links/authenticate", authenticateFromLink);

app.use(
	"/*",
	jwt({
		secret: env.JWT_SECRET_KEY,
		cookie: "auth",
	}),
);

app.route("/customers", registerCustomer);
app.route("/stores", registerStore);
app.route("/me", getProfile);
app.route("/stores", createOrder);
app.route("/orders", approveOrder);
app.route("/orders", cancelOrder);
app.route("/orders", dispatchOrder);

serve(app, (info) => {
	console.log(`🔥 Server running on port ${info.port}`);
});
