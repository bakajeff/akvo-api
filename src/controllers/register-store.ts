import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";

const prisma = new PrismaClient();

const app = new Hono();

app.post(
	"/",
	zValidator(
		"json",
		z.object({
			storeName: z.string().min(1),
			managerName: z.string().min(1),
			description: z.string().min(1),
			email: z.string().email(),
		}),
	),
	async (c) => {
		const { storeName, managerName, description, email } = c.req.valid("json");

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
	},
);

export default app;
