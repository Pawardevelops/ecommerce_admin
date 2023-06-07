import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";
import { useSession } from "next-auth/react";

export default function EditProduct() {
    const router = useRouter();
    const [products,setProducts] =  useState()
    const [sellerEmail,setSelleEmail] = useState('')
    const {EditProduct}= router.query;
    const session=useSession()
    useEffect(()=>{
      setSelleEmail(session?.data?.user?.email)
    },[session])
    useEffect(()=>{
        if(!EditProduct){
            return
        }
        axios.get('/api/products?id='+EditProduct[0])
        .then((response) => {
            setProducts(response.data)
        }).catch((err) => {
         console.log(err)   
        });
    },[EditProduct])
  return (
    <Layout>
    <h1>
    <b>
    Edit Product
    </b>
    </h1>
    {products && 
    <ProductForm sellerEmail={sellerEmail} {...products}/>
    }
    </Layout>
  )
}
