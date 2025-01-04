import express from "express";

import { env } from "./env";

import { registerUser } from "@/controllers/register-user";
import { registerStore } from "./controllers/register-store";

const app = express();

app.use(express.json());

app.post("/customers", registerUser);
app.post("/stores", registerStore);

app.listen(env.PORT, () => {
	console.log(`🔥 Server running on port ${env.PORT}!`);
});
