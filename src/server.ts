import { serve } from "@hono/node-server";
import { Hono } from "hono";

import registerStore from "@/controllers/register-store";
import registerUser from "@/controllers/register-user";
import sendAuthenticationLink from "@/controllers/send-authentication-link";
import authenticateFromLink from "./controllers/authenticate-from-link";

const app = new Hono();

app.route("/customers", registerUser);
app.route("/stores", registerStore);
app.route("/authenticate", sendAuthenticationLink);
app.route("/auth-links/authenticate", authenticateFromLink);

serve(app, (info) => {
	console.log(`🔥 Server running on port ${info.port}`);
});
