import express from "express";

import { env } from "./env";

import { registerStore } from "@/controllers/register-store";
import { registerUser } from "@/controllers/register-user";
import { sendAuthenticationLink } from "@/controllers/send-authentication-link";

const app = express();

app.use(express.json());

app.post("/customers", registerUser);
app.post("/stores", registerStore);
app.post("/authenticate", sendAuthenticationLink);

app.listen(env.PORT, () => {
	console.log(`🔥 Server running on port ${env.PORT}!`);
});
