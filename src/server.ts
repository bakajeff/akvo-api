import type { JwtVariables } from "hono/jwt";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { jwt } from "hono/jwt";

import { env } from "@/env";

import authenticateFromLink from "@/controllers/authenticate-from-link";
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

serve(app, (info) => {
	console.log(`🔥 Server running on port ${info.port}`);
});
