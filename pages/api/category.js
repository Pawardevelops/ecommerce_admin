import { Category } from "../../models/Category"
import {mongooseConnect} from '../../lib/mongoose'
export default async function category(req,res){
    const {method} = req
    await mongooseConnect()
    if(method=='POST'){
        const {name,parentCategory,Property} = req.body
        console.log(req.body)
        if(parentCategory==''){
            const categorySaved = await Category.create({name,Property})
            res.send({category:categorySaved})
        }
        else{
            const categorySaved = await Category.create({name,parentCategory,Property})
            res.send({category:categorySaved})
        }
    }
    else if(method=='GET'){
        const categories = await Category.find().populate('parentCategory')
        res.send({categories})
    }
    else if(method =='PUT'){
        const {_id,name,parentCategory,Property} = req.body
        console.log(Property)
        
        if(parentCategory==''){
            const updatedCategory =await Category.updateOne({_id}, {name,Property,$unset: {parentCategory: 1 }});
            res.send(updatedCategory)
        }
        else{
            const categorySaved = await Category.updateOne({_id},{name,parentCategory,Property})
            res.send(categorySaved)
        }
    }
    else if(method=='DELETE'){
        const _id =req.query.id

        const categoryDeleted = await Category.deleteOne({_id})
        res.send(categoryDeleted)
    }
}