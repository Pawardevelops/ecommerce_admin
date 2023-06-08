import { mongooseConnect } from "../../lib/mongoose"
import { Product } from "../../models/Product"

export default async function handle(req,res){
    const {method} = req
    await mongooseConnect()
    if(method=='POST'){
        const {title,description,price,images,category,productProperties,sellerEmail} = req.body
        const productDoc = await Product.create({title,description,price,images,Category:category,productProperties,sellerEmail:sellerEmail})
        console.log(req.body)
        res.status(201).json(productDoc)
    }
    else if(method =='GET'){
        console.log("get")
        if(req.query?.id){
            res.send(await Product.findOne({_id:req.query.id}))
        }
        else{
            res.send(await Product.find(req.query))
        }
        
    }
    else if(method=='PUT'){
        const {title,description,price,images,id,category,productProperties,sellerEmail} = req.body
        if(category==''){
            const updatedProduct = await Product.findOne({}, function(err, user){
                // user.key_to_delete = null; X
                `user.key_to_delete = undefined;`
              
                delete user.Category;
              
                user.save();
                res.send(updatedProduct)

            });
        }
        else{
            const updatedProduct = await Product.updateOne({_id:id},{title,description,price,images,Category:category,productProperties,sellerEmail})
            res.send(updatedProduct)

        }

    }
    else if(method=='DELETE'){
        if(req.query?.id){
            const updatedProduct = await Product.deleteOne({_id:req.query.id})
            res.send(updatedProduct)
        }
    }
}