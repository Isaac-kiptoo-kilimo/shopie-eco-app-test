import * as nodemailer from 'nodemailer';
import mssql from 'mssql'
import { dbConfig } from '../config/db';

export async function sendResetTokenByEmail(email: string, resetToken: string){
  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      requireTLS: true,
      auth: {
          user: process.env.EMAIL as string,
          pass: process.env.PASSWORD as string
      }
    });

    const pool=await mssql.connect(dbConfig)

    const customers=await (await pool.request().query('SELECT * FROM Users WHERE welcomed=0')).recordset
console.log(customers);

    for(let customer of customers){
      const mailOptions = {
        from: process.env.Email as string,
        to: customer.email,
        subject: 'Password Reset',
        text: `Your password reset token is: ${resetToken}`,
      };
      await transporter.sendMail(mailOptions);

      console.log('Email sent successfully');
    }
   
   
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}
