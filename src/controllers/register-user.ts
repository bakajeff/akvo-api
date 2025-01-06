import type { Request, Response } from "express";

import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function registerUser(request: Request, response: Response) {
	const { name, email } = request.body;

	const customer = await prisma.user.create({
		data: {
			id: createId(),
			name,
			email,
		},
	});

	response.status(201).json(customer);

	return;
}
