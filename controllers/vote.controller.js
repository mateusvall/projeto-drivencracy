import db from "../db.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { voteSchema } from "../schemas/schemas.js";

export async function votePost(req, res){

    const { id } = req.params;

    try{
        const choice = await db.collection('choice').findOne({_id: new ObjectId(id)});

        if(!choice){
            return res.sendStatus(404);
        }

        const poll = await db.collection('poll').findOne({_id: new ObjectId(choice.pollId)});

        if(dayjs().isAfter(poll.expireAt)){
            return res.sendStatus(403)
        }

        const vote = {
            createdAt: dayjs(),
            choiceId: new ObjectId(id)
        }

        await db.collection('vote').insertOne(vote);
        return res.sendStatus(201);


    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }  

}

export async function getResult(req, res){

    const { id } = req.params;


    try{
        const poll = await db.collection('poll').findOne({_id: new ObjectId(id)})

        if(!poll){
            return res.sendStatus(404)
        } 

        const votes = await db.collection('vote').aggregate(
            [
                {
                    "$group":{
                        _id:"$choiceId",
                        votes:{$sum:1}
                    }
    
                },  
                {
                    "$lookup":{
                        from: "choice",
                        localField:"_id",
                        foreignField: "_id",
                        as:"name"
                    }
                },
                {
                    "$sort":{
                        votes: -1
                    }
                }
           
        
        
        ]).toArray();

        const winner = votes.filter((item) => String(item.name[0].pollId) === id)[0];
        const result = {
            ...poll,
            result:{
                title: winner.name[0].title,
                votes: winner.votes
            }
        }

        res.send(result);

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    }      

    
}