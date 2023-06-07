import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";

export default function DeleteProduct() {
    const route = useRouter()
    const [name,setname] = useState()
    const {DeleteProduct}= route.query
    const reDirect = ()=>{route.push('/Products')}
    const deleteProduct =async ()=>{
        const response = await axios.delete('/api/products?id='+DeleteProduct[0])
        reDirect()
    }
    useEffect(()=>{
        if(!DeleteProduct[0]){
            return ;
        }
        (async ()=>{
            const response = await axios.get('/api/products?id='+DeleteProduct[0])
            setname(response.data.title)
        })()
    },[DeleteProduct[0]])
    return (
    <Layout>
    <h1 className="text-center">{`Do you really want to DELETE "${name}" ?`}</h1>
    <div className="flex justify-center align-center">
    <button className="bg-red-500 py-2 px-4 rounded-lg text-white" onClick={()=>deleteProduct()}>YES</button>
    <button className="bg-gray-500 py-2 px-4 ml-2 rounded-lg text-white" onClick={reDirect}>NO</button>
    </div>
    </Layout>
  )
}
