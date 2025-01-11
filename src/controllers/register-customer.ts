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
			name: z.string().min(1),
			email: z.string().email(),
		}),
	),
	async (c) => {
		const { name, email } = c.req.valid("json");

		const customer = await prisma.user.create({
			data: {
				id: createId(),
				name,
				email,
			},
		});

		return c.json(customer);
	},
);

export default app;
