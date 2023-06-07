import axios from "axios";
import { useSession } from "next-auth/react";
import { useState,useEffect } from "react";
import Layout from "../components/Layout";


export default function Orders() {
  const [orders,setOrders] = useState([])
  const {data} = useSession()
  useEffect(()=>{
    axios.get('/api/orders?sellerEmail='+data?.user?.email)
      .then(res=>setOrders(res.data))
  },[data?.user?.email])
  return (
    <Layout>
        <h1>Orders</h1>
        <table className="basic text-xxs sm:text-xxs md:text-sm lg:text-lg ">
            <thead>
                <tr>
                    <td>Order Date</td>
                    <td>Recipient</td>
                    <td>Products</td>
                </tr>
            </thead>
            <tbody>
            {
              orders?.map(order=>(
                <tr key={order._id}>
                <td>{new Date(order.updatedAt).toLocaleString()}</td>
                <td>
                  <div>Name : {order.name}</div>
                  <div>Email : {order.email}</div>
                </td>
                <td>{order.lineItems?.map(product=>(
                  product?.price_data?.product_data?.name+' -- QTY: '+product?.quantity +' , ' || 'No Data ' 
                ))}</td>
              </tr>
              ))
            }
              
              
            </tbody>
        </table>
    </Layout>
    
  )
}
