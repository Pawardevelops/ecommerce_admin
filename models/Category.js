import mongoose, { model, models, Schema } from "mongoose";

const categorySchema = Schema({
    name:{type:String, required:true},
    parentCategory:{type:mongoose.Schema.Types.ObjectId, ref:'Category'},
    Property:[{name:{type:String},value:{type:String}}],
    sellerEmail:{type:String}
})

export const Category = models?.Category || model('Category',categorySchema);