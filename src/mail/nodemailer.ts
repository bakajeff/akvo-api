import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587, // true for 465, false for other ports
	auth: {
		user: "doyle.kessler@ethereal.email", // generated ethereal user
		pass: "9MEK53CTq1g4Bf4v6c", // generated ethereal password
	},
});
