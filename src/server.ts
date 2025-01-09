import { serve } from "@hono/node-server";
import { Hono } from "hono";

import authenticateFromLink from "@/controllers/authenticate-from-link";
import registerCustomer from "@/controllers/register-customer";
import registerStore from "@/controllers/register-store";
import sendAuthenticationLink from "@/controllers/send-authentication-link";

const app = new Hono();

app.route("/customers", registerCustomer);
app.route("/stores", registerStore);
app.route("/authenticate", sendAuthenticationLink);
app.route("/auth-links/authenticate", authenticateFromLink);

serve(app, (info) => {
	console.log(`🔥 Server running on port ${info.port}`);
});
