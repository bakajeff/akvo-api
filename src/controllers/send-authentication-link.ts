import { transporter } from "@/mail/nodemailer";
import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

import { env } from "@/env.js";

const prisma = new PrismaClient();

const app = new Hono();

app.post("/", async (c) => {
	const { email } = await c.req.json();

	const userFromEmail = await prisma.user.findFirst({
		where: {
			email,
		},
	});

	if (!userFromEmail) {
		throw new Error("Unauthorized");
	}

	const authLinkCode = createId();

	await prisma.authLink.create({
		data: {
			id: createId(),
			code: authLinkCode,
			userId: userFromEmail.id,
		},
	});

	const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);
	authLink.searchParams.set("code", authLinkCode);
	authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

	await transporter.sendMail({
		from: '"Akvo" <naoresponda@akvo.com>',
		to: email,
		subject: "Akvo - Authentication Link",
		text: `Please click the link below to authenticate your account:\n\n${authLink.toString()}`,
	});

	c.status(204);

	return c.body(null);
});

export default app;
