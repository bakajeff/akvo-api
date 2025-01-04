import express from "express";

const app = express();

app.use(express.json());

import { registerUser } from "@/controllers/register-user";
import { env } from "./env";

app.post("/customers", registerUser);

app.listen(env.PORT, () => {
	console.log(`🔥 Server running on port ${env.PORT}!`);
});
