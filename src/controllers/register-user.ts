import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();

const app = new Hono();

app.post("/", async (c) => {
	const { name, email } = await c.req.json();

	const customer = await prisma.user.create({
		data: {
			id: createId(),
			name,
			email,
		},
	});

	return c.json(customer);
});

export default app;
