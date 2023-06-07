import mongoose, { model, Schema, models } from "mongoose";

const productSchema = Schema({
    title :{type :String, required:true},
    description :String,
    price:{type : Number, required:true},
    images:[{type:String}],
    Category:{type:mongoose.Schema.Types.ObjectId, ref:'Category'},
    productProperties:{type:Object},
    sellerEmail:{type:String}
},{
    timestamp:true,
});

export const Product = models.Product || model('Product',productSchema); 