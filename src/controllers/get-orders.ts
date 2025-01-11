import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";

const prisma = new PrismaClient();

const app = new Hono();

app.get(
	"/",
	zValidator(
		"param",
		z.object({
			pageIndex: z.string().optional(),
			orderId: z.string().optional(),
			customerName: z.string().optional(),
			status: z
				.enum(["pending", "processing", "delivering", "delivered", "canceled"])
				.optional(),
		}),
	),
	async (c) => {
		const { pageIndex, orderId, customerName, status } = c.req.valid("param");
		const { storeId } = c.get("jwtPayload");

		if (!storeId) {
			return new Response("User is not a store manager", { status: 401 });
		}

		const orders = await prisma.order.findMany({
			select: {
				id: true,
				createdAt: true,
				status: true,
				totalInCents: true,
				customer: {
					select: {
						name: true,
					},
				},
			},
			where: {
				storeId,
				status: status ? status : undefined,
				customer: {
					name: {
						contains: customerName ? customerName : undefined,
						mode: "insensitive",
					},
				},
				id: {
					contains: orderId ? orderId : undefined,
					mode: "insensitive",
				},
			},
			skip: pageIndex ? Number(pageIndex) * 10 : 0,
			take: 10,
			orderBy: {
				createdAt: "desc",
			},
		});

		return c.json({
			orders,
			meta: {
				pageIndex,
				perPage: 10,
			},
		});
	},
);

export default app;
