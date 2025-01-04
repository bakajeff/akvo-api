import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export async function registerUser(request: Request, response: Response) {
	const { name, email } = request.body;

	const customer = await prisma.user.create({
		data: {
			name,
			email,
		},
	});

	return response.status(201).json(customer);
}
