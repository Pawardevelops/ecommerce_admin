import { model, models, Schema } from "mongoose";

const OrderScheme = new Schema({
    lineItems:Object,
    name:String,
    email:String,
    city:String,
    postalCode:String,
    streetAddress:String,
    country:String,
    paid:Boolean,
},{
    timestamps:true
})
const Order = models?.Order || model('Order',OrderScheme)
export default  Order