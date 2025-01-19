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
			latitude: z.number(),
			longitude: z.number(),
		}),
	),
	async (c) => {
		const { sub: customerId } = c.get("jwtPayload");
		const { name, latitude, longitude } = c.req.valid("json");

		const customer = await prisma.address.create({
			data: {
				id: createId(),
				name,
				latitude,
				longitude,
				customerId,
			},
		});

		return c.json(customer, 201);
	},
);

export default app;
