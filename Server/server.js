import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cron from 'node-cron';
import cors from "cors";
import client from "./Config/db.js";
import fetchRoute from "./Routes/fetchData.js"

dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;


const fetchData = async () => {
    try {
        const res = await fetch("https://api.wazirx.com/api/v2/tickers");
        const data = await res.json();

        const tickersArray = Object.values(data);

        const first10Results = tickersArray.slice(0, 10);
        first10Results.forEach((coin,index)=>{
            //const sqlQuery='INSERT INTO Coins(name,buy,sell,volume,base_unit) VALUES ($1,$2,$3,$4,$5) RETURNING *';
            const updateQuery='UPDATE Coins SET buy=$1 , sell=$2 , volume=$3, open=$5, last=$6 WHERE cid = $4 RETURNING *';
            const values=[coin.buy,coin.sell,coin.volume,index+1,coin.open,coin.last];

            client.query(updateQuery,values,(err,res)=>{
                if(err) console.error('Error executing query', err);
            });
        })

    } catch (err) {
        console.error('Error:', err);
    }

}


cron.schedule('*/1 * * * *', () => {
    console.log("Coin Data Updated");
    fetchData();
})

app.use("/api/v1",fetchRoute);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});