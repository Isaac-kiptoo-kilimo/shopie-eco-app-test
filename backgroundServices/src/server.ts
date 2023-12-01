import express from 'express';
import dotenv from 'dotenv';
import { welcomeUser } from './mailerServices/welcomeUser';
import cron from 'node-cron'
import { sendResetTokenByEmail } from './mailerServices/resetPassword';
dotenv.config();

const app=express()

const run = async()=>{
    cron.schedule('*/10 * * * * *', async()=>{
        console.log('Checking for a new user');
        
        await welcomeUser()
        await sendResetTokenByEmail()
    })
    
}

run()


app.listen(4501, ()=>{
    console.log('Mail server up and running ...'); 
})