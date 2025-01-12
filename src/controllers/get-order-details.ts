import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();

const app = new Hono();

app.get("/:id", async (c) => {
	const id = c.req.param("id");
	const { storeId } = c.get("jwtPayload");

	if (!storeId) {
		return new Response("User is not a store manager", { status: 401 });
	}

	const order = await prisma.order.findFirst({
		select: {
			id: true,
			createdAt: true,
			status: true,
			totalInCents: true,
			customer: {
				select: {
					name: true,
					email: true,
				},
			},
			orderItems: {
				select: {
					id: true,
					priceInCents: true,
					quantity: true,
					product: {
						select: {
							name: true,
						},
					},
				},
			},
		},
		where: {
			id,
			storeId,
		},
	});

	return c.json(order);
});

export default app;
