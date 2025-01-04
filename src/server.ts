import express from "express";

const app = express();

app.use(express.json());

import { registerUser } from "./controllers/register-user";

app.post("/customers", registerUser);

app.listen(3000, () => {
	console.log("Example app listening on port 3000!");
});
