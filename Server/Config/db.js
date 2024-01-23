import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Client } =pg;
const PASSWORD=process.env.PASSWORD;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'TestDB',
    password: PASSWORD,
    port: 5432, // Default PostgreSQL port
});

client.connect((err)=>{
    if(err){
        return console.error('Error connecting to Database', err);
    }
    console.log('Connected to PostgreSQL');
});

export default client;