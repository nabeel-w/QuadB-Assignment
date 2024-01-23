import express from "express";
import bodyParser from "body-parser";
import client from "../Config/db.js";


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/search/:coin",(req,res)=>{
    const name=`${(req.params.coin).toUpperCase()}/INR`
    const sqlQuery='SELECT * FROM Coins WHERE name=$1';
    const values=[name];
    client.query(sqlQuery,values,(err,result)=>{
        if(err) console.error('Error executing query', err);
        else{
            const coinData=result.rows[0];
            return res.json(coinData);
        }
    })
});

router.get("/coins",(req,res)=>{
    const sqlQuery='SELECT name FROM Coins';
    client.query(sqlQuery,(err,result)=>{
        if(err) console.error('Error executing query', err);
        else{
            const coinNames=result.rows;
            const names=[];
            coinNames.forEach(coin=>{
                const token=coin.name.split('/')
                names.push(token[0]);
            })
            return res.json(names);
        }
    })
})

export default router;