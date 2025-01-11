import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();

const app = new Hono();

app.put("/:id/cancel", async (c) => {
	const orderId = c.req.param("id");
	const { storeId } = c.get("jwtPayload");

	if (!storeId) {
		return c.json({ message: "User is not a store manager" }, 401);
	}

	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
			storeId,
		},
	});

	if (!order) {
		throw new Error("Unauthorized");
	}

	if (!["pending", "processing"].includes(order.status)) {
		return c.json(
			{ message: "Your order is already approved or rejected" },
			400,
		);
	}

	await prisma.order.update({
		data: {
			status: "canceled",
		},
		where: {
			id: order.id,
		},
	});

	return c.body(null, 204);
});

export default app;
