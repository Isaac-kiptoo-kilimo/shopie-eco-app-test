import * as nodemailer from 'nodemailer';
import ejs from 'ejs';
import mssql from 'mssql'
import { sqlConfig } from '../config/sqlConfig'
import { sendMail } from '../helpers/emailHelpers'


export const sendResetTokenByEmail = async()=>{
    const pool=await mssql.connect(sqlConfig)

    const customers=await (await pool.request().query('SELECT * FROM Users WHERE resetToken is NOT NULL AND isSend=0')).recordset

    for(let customer of customers)
{
    ejs.renderFile('templates/resetPassword.ejs', {Name: customer.fullName,Password: customer.resetToken, ExpiraryTime: customer.expiryTime}, async (error, data)=>{
        let mailOptions={
            from : process.env.Email as string,
            to: customer.email,
            subject: "Reset Password",
            html: data
        }
        try{
            await sendMail(mailOptions)
            await pool.request().query(`UPDATE Users SET isSend= 1 WHERE isSend=0`)

            console.log('Emails send to new Users');
            
        }catch(error){
            console.log(error);
            
        }
    })
}    
}



