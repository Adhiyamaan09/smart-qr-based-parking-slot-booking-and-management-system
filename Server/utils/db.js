import mysql from 'mysql2';
import dotenv from 'dotenv';

const con = mysql.createConnection({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}) 
con.connect(function(err) { 
    if(err) { 
        console.log("connection error"+err) 
    } else { 
        console.log("connected") 
    } 
}) 

export default con;

 
