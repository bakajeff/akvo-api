import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const prisma = new PrismaClient();

async function main() {
	const [customer1, customer2] = await prisma.user.createManyAndReturn({
		data: [
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				role: "customer",
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				role: "customer",
			},
		],
	});

	console.log(chalk.yellow("✔ Created customers"));

	const manager = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			role: "manager",
		},
	});

	console.log(chalk.yellow("✔ Created manager"));

	const store = await prisma.store.create({
		data: {
			name: faker.company.name(),
			description: faker.company.catchPhrase(),
			managerId: manager.id,
		},
	});

	console.log(chalk.yellow("✔ Created store"));

	const availableProducts = await prisma.product.createManyAndReturn({
		data: [
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
			{
				name: faker.commerce.productName(),
				priceInCents: Number(
					faker.commerce.price({
						min: 190,
						max: 490,
						dec: 0,
					}),
				),
				storeId: store.id,
				description: faker.commerce.productDescription(),
			},
		],
	});

	console.log(chalk.yellow("✔ Created products"));

	const ordersToInsert = [];
	const orderItemsToPush = [];

	for (let i = 0; i < 200; i++) {
		const orderId = i;

		const orderProducts = faker.helpers.arrayElements(availableProducts, {
			min: 1,
			max: 3,
		});

		let totalInCents = 0;

		for (const orderProduct of orderProducts) {
			const quantity = faker.number.int({ min: 1, max: 5 });

			totalInCents += orderProduct.priceInCents * quantity;

			orderItemsToPush.push({
				orderId,
				productId: orderProduct.id,
				priceInCents: orderProduct.priceInCents,
				quantity,
			});
		}

		ordersToInsert.push({
			id: orderId,
			customerId: faker.helpers.arrayElement([customer1.id, customer2.id]),
			storeId: store.id,
			status: faker.helpers.arrayElement([
				"pending",
				"canceled",
				"processing",
				"delivering",
				"delivered",
			]),
			totalInCents,
			createdAt: faker.date.recent({
				days: 40,
			}),
		});
	}

	await prisma.order.createMany({
		data: ordersToInsert,
	});

	await prisma.orderItems.createMany({
		data: orderItemsToPush,
	});

	console.log(chalk.yellow("✔ Created orders"));

	console.log(chalk.greenBright("Database seeded successfully!"));
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
