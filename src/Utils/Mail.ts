import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: "prince.dev2468@gmail.com",
        pass: "iasn zioa pxdh jtho"
    }
});