import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const accountEmail = 'royshubha931@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: process.env.EMAIL_PASSWORD,
  }
})

export default transporter;