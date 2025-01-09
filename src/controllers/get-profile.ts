import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

const prisma = new PrismaClient();

const app = new Hono();

app.get("/", async (c) => {
	const { sub: userId } = c.get("jwtPayload");

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new Error("Unauthorized");
	}

	return c.json(user);
});

export default app;
