import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();

const app = new Hono();

app.put("/:id/approve", async (c) => {
	const orderId = c.req.param("id");
	const { storeId } = c.get("jwtPayload");

	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
			storeId,
		},
	});

	if (!order) {
		throw new Error("Unauthorized");
	}

	if (order?.status !== "pending") {
		return c.json(
			{ message: "Your order is already approved or rejected" },
			400,
		);
	}

	await prisma.order.update({
		data: {
			status: "processing",
		},
		where: {
			id: order.id,
		},
	});

	return c.body(null, 204);
});

export default app;
