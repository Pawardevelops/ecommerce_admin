import Order from "../../models/Order";
import {mongooseConnect} from '../../lib/mongoose'
export default async function orders(req,res){
  await mongooseConnect()
    try {
        const { sellerEmail } = req.query;
    
        if (req.method == "GET") {
          const orders = await Order.find({ "lineItems.sellerEmail": sellerEmail });
          res.json(orders);
        }
      } catch (error) {
        res.status(500).json({ error: "An error occurred" });
      }
}