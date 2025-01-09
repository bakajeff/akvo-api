import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();

const app = new Hono();

app.post("/", async (c) => {
	const { storeName, managerName, description, email } = await c.req.json();

	const manager = await prisma.user.create({
		data: {
			id: createId(),
			name: managerName,
			email,
			role: "manager",
		},
	});

	const store = await prisma.store.create({
		data: {
			id: createId(),
			name: storeName,
			description,
			managerId: manager.id,
		},
	});

	return c.json(store);
});

export default app;
