import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const prisma = new PrismaClient();

async function main() {
	const [customer1, customer2] = await prisma.user.createManyAndReturn({
		data: [
			{
				id: createId(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
				role: "customer",
			},
			{
				id: createId(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
				role: "customer",
			},
		],
	});

	console.log(chalk.yellow("✔ Created customers"));

	const manager = await prisma.user.create({
		data: {
			id: createId(),
			name: faker.person.fullName(),
			email: faker.internet.email(),
			role: "manager",
		},
	});

	console.log(chalk.yellow("✔ Created manager"));

	const origin = {
		latitude: 35.6704517,
		longitude: 139.6712387,
	};

	const [customer1Latitude, customer1Longitude] =
		faker.location.nearbyGPSCoordinate({
			origin: [origin.latitude, origin.longitude],
			radius: 10,
			isMetric: true,
		});

	const [customer2Latitude, customer2Longitude] =
		faker.location.nearbyGPSCoordinate({
			origin: [origin.latitude, origin.longitude],
			radius: 10,
			isMetric: true,
		});

	const addresses = await prisma.address.createManyAndReturn({
		data: [
			{
				id: createId(),
				name: faker.location.streetAddress(),
				latitude: customer1Latitude,
				longitude: customer1Longitude,
				customerId: customer1.id,
			},
			{
				id: createId(),
				name: faker.location.streetAddress(),
				latitude: customer2Latitude,
				longitude: customer2Longitude,
				customerId: customer2.id,
			},
		],
	});

	console.log(chalk.yellow("✔ Created addresses"));

	const [storeLatitude, storeLongitude] = faker.location.nearbyGPSCoordinate({
		origin: [origin.latitude, origin.longitude],
		radius: 10,
		isMetric: true,
	});

	const store = await prisma.store.create({
		data: {
			id: createId(),
			name: faker.company.name(),
			description: faker.company.catchPhrase(),
			managerId: manager.id,
			latitude: storeLatitude,
			longitude: storeLongitude,
		},
	});

	console.log(chalk.yellow("✔ Created store"));

	const availableProducts = await prisma.product.createManyAndReturn({
		data: [
			{
				id: createId(),
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
				id: createId(),
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
				id: createId(),
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
				id: createId(),
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
				id: createId(),
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
				id: createId(),
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
				id: createId(),
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
				id: createId(),
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
				id: createId(),
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
				id: createId(),
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
		const orderId = createId();

		const orderProducts = faker.helpers.arrayElements(availableProducts, {
			min: 1,
			max: 3,
		});

		let totalInCents = 0;

		for (const orderProduct of orderProducts) {
			const quantity = faker.number.int({ min: 1, max: 5 });

			totalInCents += orderProduct.priceInCents * quantity;

			orderItemsToPush.push({
				id: createId(),
				orderId,
				productId: orderProduct.id,
				priceInCents: orderProduct.priceInCents,
				quantity,
			});
		}

		const randomCustomerId = faker.helpers.arrayElement([
			customer1.id,
			customer2.id,
		]);
		const randomCustomerAddress = addresses.find(
			(address) => address.customerId === randomCustomerId,
		);

		ordersToInsert.push({
			id: orderId,
			customerId: randomCustomerId,
			storeId: store.id,
			status: faker.helpers.arrayElement([
				"pending",
				"canceled",
				"processing",
				"delivering",
				"delivered",
			]),
			totalInCents,
			latitude: randomCustomerAddress?.latitude || faker.location.latitude(),
			longitude: randomCustomerAddress?.longitude || faker.location.longitude(),
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
