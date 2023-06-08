import { Category } from "../../models/Category"
import {mongooseConnect} from '../../lib/mongoose'
export default async function category(req,res){
    const {method} = req
    await mongooseConnect()
    if(method=='POST'){
        const {name,parentCategory,Property,sellerEmail} = req.body
        console.log(name,sellerEmail)
        if(parentCategory==''){
            const categorySaved = await Category.create({name,Property,sellerEmail:sellerEmail})
            res.send({category:categorySaved})
        }
        else{
            const categorySaved = await Category.create({name,parentCategory,Property,sellerEmail:sellerEmail})
            res.send({category:categorySaved})
        }
    }
    else if(method=='GET'){
        if(req.query.sellerEmail != undefined){
            const categories = await Category.find({sellerEmail:req.query.sellerEmail}).populate('parentCategory')
            res.send({categories})

        }
        
    }
    else if(method =='PUT'){
        const {_id,name,parentCategory,Property,sellerEmail} = req.body
        
        if(parentCategory==''){
            const updatedCategory =await Category.updateOne({_id}, {name,Property,sellerEmail:sellerEmail,$unset: {parentCategory: 1 }});
            res.send(updatedCategory)
        }
        else{
            const categorySaved = await Category.updateOne({_id},{name,parentCategory,Property,sellerEmail:sellerEmail})
            res.send(categorySaved)
        }
    }
    else if(method=='DELETE'){
        const _id =req.query.id

        const categoryDeleted = await Category.deleteOne({_id})
        res.send(categoryDeleted)
    }
}