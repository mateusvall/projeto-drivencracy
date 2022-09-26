import db from "../db.js";
import dayjs from "dayjs";
import { pollSchema } from "../schemas/schemas.js";

export async function postPoll(req, res){

    const newPoll = req.body;

    const validation = pollSchema.validate(newPoll);

    if (validation.error) {
        return res
            .status(422)
            .send(validation.error.details.map(detail => detail.message));
    }

    try{
        if(!newPoll.expireAt){
            newPoll.expireAt = dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm');
        }

        await db.collection('poll').insertOne(newPoll);
        return res.sendStatus(201);
        
    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  

}

export async function getPoll(req, res){

    try{
        const polls = await db.collection('poll').find().toArray()
        res.send(polls);
    }
    catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  

}