import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";

const prisma = new PrismaClient();

const app = new Hono();

app.post(
	"/:storeId/orders",
	zValidator(
		"json",
		z.object({
			items: z.array(
				z.object({
					productId: z.string(),
					quantity: z.number(),
				}),
			),
			latitude: z.number(),
			longitude: z.number(),
		}),
	),
	async (c) => {
		const { sub: customerId } = c.get("jwtPayload");
		const storeId = c.req.param("storeId");
		const { items, latitude, longitude } = c.req.valid("json");

		console.log(customerId);

		const productsIds = items.map((item) => item.productId);

		const products = await prisma.product.findMany({
			where: {
				id: {
					in: productsIds,
				},
				storeId,
			},
		});

		const orderProducts = items.map((item) => {
			const product = products.find((product) => product.id === item.productId);

			if (!product) {
				throw new Error("Product not found");
			}

			return {
				productId: product.id,
				unitPriceInCents: product.priceInCents,
				quantity: item.quantity,
				subtotalInCents: item.quantity * product.priceInCents,
			};
		});

		const totalInCents = orderProducts.reduce((total, orderItem) => {
			return total + orderItem.subtotalInCents;
		}, 0);

		const order = await prisma.order.create({
			data: {
				id: createId(),
				totalInCents,
				customerId,
				storeId,
				latitude,
				longitude,
				orderItems: {
					createMany: {
						data: orderProducts.map((product) => {
							return {
								id: createId(),
								productId: product.productId,
								quantity: product.unitPriceInCents,
								priceInCents: product.subtotalInCents,
							};
						}),
					},
				},
			},
		});

		return c.json(order);
	},
);

export default app;
