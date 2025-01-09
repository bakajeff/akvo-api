import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "jsonwebtoken";

import { env } from "@/env";

const prisma = new PrismaClient();

const app = new Hono();

app.get("/", async (c) => {
	const { code, redirect } = c.req.query();

	const authLinkFromCode = await prisma.authLink.findFirst({
		where: {
			code: code as string,
		},
	});

	if (!authLinkFromCode) {
		throw new Error("Unauthorized");
	}

	if (dayjs().diff(authLinkFromCode.createdAt, "days") > 7) {
		throw new Error("Unauthorized");
	}

	const managedStore = await prisma.store.findFirst({
		where: {
			managerId: authLinkFromCode.userId,
		},
	});

	const token = sign(
		{
			sub: authLinkFromCode.userId,
			storeId: managedStore,
		},
		env.JWT_SECRET_KEY,
	);

	const oneDay = 60 * 60 * 24;

	setCookie(c, "auth", token, {
		httpOnly: true,
		maxAge: 7 * oneDay,
	});

	await prisma.authLink.delete({
		where: {
			code: code as string,
		},
	});

	return c.redirect(redirect as string);
});

export default app;
