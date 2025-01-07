import { env } from "@/env.js";
import { transporter } from "@/mail/nodemailer";
import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export async function sendAuthenticationLink(
	request: Request,
	response: Response,
) {
	const { email } = request.body;

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

	const info = await transporter.sendMail({
		from: '"Akvo" <naoresponda@akvo.com>',
		to: email,
		subject: "Akvo - Authentication Link",
		text: `Please click the link below to authenticate your account:\n\n${authLink.toString()}`,
	});

	response.sendStatus(200);

	return;
}
