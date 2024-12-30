import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lea81@ethereal.email',
        pass: '8rtZH25rvKrt6D3zam'
    }
});