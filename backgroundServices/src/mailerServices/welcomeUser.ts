import ejs from 'ejs';
import mssql from 'mssql'
import { sqlConfig } from '../config/sqlConfig'
import { sendMail } from '../helpers/emailHelpers'

export const welcomeUser= async()=>{
    const pool=await mssql.connect(sqlConfig)

    const customers=await (await pool.request().query('SELECT * FROM Users WHERE welcomed=0')).recordset

    console.log(customers);

    for(let customer of customers)
{
    ejs.renderFile('templates/welcomeUser.ejs', {Name: customer.fullName}, async (error, data)=>{
        let mailOptions={
            from : process.env.Email as string,
            to: customer.email,
            subject: "Welcome To our products page,discounted products",
            html: data
        }
        try{
            await sendMail(mailOptions)
            await pool.request().query('UPDATE Users SET welcomed = 1 WHERE welcomed = 0')

            console.log('Emails send to new Users');
            
        }catch(error){
            console.log(error);
            
        }
    })
}    
}