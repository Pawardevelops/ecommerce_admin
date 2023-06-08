import { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from 'axios'
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";
import { useSession } from "next-auth/react";

export default function ProductForm(
    {
        title:editTitle,
        description:editDescription,
        price:editPrice,
        _id:id,
        images:editImage,
        Category:editCategory,
        productProperties:editProductProperties,
    }) {
      const {data} = useSession()
      const [sellerEmail,setSelleEmail]= useState(data?.user?.email)
      const [category,setCategory] = useState(editCategory || '')
  const [title, setTitle] = useState(editTitle || '');
  const [description, setDescription] = useState(editDescription || '');
  const [price, setPrice] = useState(editPrice || '');
  const [images,setImage] = useState(editImage || [])
  const [productProperties,setProductProperties] = useState(editProductProperties || {})
  const [goToProductPage, setGoToProductPage] = useState(false);
  const [isUploading,setIsUploading] =  useState(false)
  const [categories,setCategories] = useState([])
  useEffect(()=>{
    axios.get('/api/category?sellerEmail='+data?.user?.email)
      .then(response=>{
        setCategories(response.data.categories)
      })
      .catch(error=>console.error(error))
  },[])
  useEffect(()=>{setSelleEmail(data?.user?.email)},[])
  const router = useRouter()
  const  creatProduct=async (e)=>{
    e.preventDefault()
    const data ={title,description,price,images,category,productProperties,sellerEmail}
    if(id){
        const response = await axios.put('/api/products/',{...data,id})
    }
    else{
        const response = await axios.post('/api/products',data)
    }
    setGoToProductPage(true)
  }
  if(goToProductPage){
    router.push('/Products')
  }
  const uploadImage = async (e)=>{
    const files = e.target?.files
    if(files?.length>0){
      setIsUploading(true)
      for(const file of files){
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('/api/upload', formData)
        console.log(res)
        setImage(currImg=>{return [...currImg,...res.data]})
      }
      setIsUploading(false)
    }

  }
  const setProductProp=(propName,value)=>{
    setProductProperties(prev=>{
      const newProperties ={...prev}
      newProperties[propName] = value
      return newProperties;
    })
  }
  return (
      <form onSubmit={creatProduct}>
      <label>Product Name</label>
      <input 
      type={"text"} 
      placeholder="product name" 
    onChange={(e)=>setTitle(e.target.value)}
    value={title}
      />
      <label>Category</label>
      <select className="mb-3 block" value={category} onChange={ev=>setCategory(ev.target.value)} >
        <option value={""}>Category not selected</option>
        {categories?.map(c=>{
          return <option key={c._id} value={c._id}>{c.name}</option>
        })}
      </select>
      <div className="max-w-max">
      {categories?.length>0 &&
         categories.map(
          item=>{if(item._id==category){ return (
            item?.Property?.map(p=>
              {return <div key={p._id} className="flex gap-1 mb-1">
                      <div className="px-2 py-1" >{p.name}</div>
                      <select value={productProperties[p.name]} onChange={(ev)=>setProductProp(p.name,ev.target.value)}>
                      <option value={""}>Nill</option>
                        {p?.value?.split(',')?.map((v,i)=>{
                          return <option key={i} value={v} className="ml-1 rounded-md">{v}</option>
                          
                        })}
                      </select>
                  </div>}
          )
         )}}
        )
      }
      </div>
      <label>Photos </label>
      <div className="mb-2 flex flex-wrap gap-2">
      <ReactSortable className="flex flex-wrap gap-2" list={images} setList={()=>setImage(images)}>
      {!!images.length && images.map(link=>{
        return(
          <div key={link} className='h-24 shadow-md bg-white p-2'>
          <img src={link} alt='img' className="rounded-md" />
          </div>
          )})}
      </ReactSortable>
          {
            isUploading && <div className="h-24 text-center flex bg-gray-300 p-2 rounded-md text-gray-500">Uploading...</div>
          }
      <label className="border border-primary text-primary w-24 h-24 bg-gray-200 rounded-lg flex flex-col justify-center items-center gap-1 border text-gray-500 cursor-pointer shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
</svg>
    Upload
    <input 
    type={"file"} 
    className='hidden' 
    onChange={uploadImage}
    />
      </label>
      {!editImage?.length &&(<div> No Photos in this Product</div>) }
      </div>
      <label>Description</label>
      <textarea 
      placeholder="description"
      onChange={(e)=>setDescription(e.target.value)}
      value={description}
      />
      <label>Price (in USD)</label>
      <input 
      type={"number"} 
      placeholder="Price"
      onChange={(e)=>setPrice(e.target.value)} 
      value={price}
      />
      <button 
      type="submit" 
      className="btn-primary">
      Save
      </button>
      </form>
  );
}
