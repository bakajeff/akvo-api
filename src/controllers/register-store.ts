import { PrismaClient } from "@prisma/client";

import type { Request, Response } from "express";

const prisma = new PrismaClient();

export async function registerStore(request: Request, response: Response) {
	const { storeName, managerName, description, email } = request.body;

	const manager = await prisma.user.create({
		data: {
			name: managerName,
			email,
			role: "manager",
		},
	});

	const store = await prisma.store.create({
		data: {
			name: storeName,
			description,
			managerId: manager.id,
		},
	});

	response.status(201).json(store);

	return;
}
