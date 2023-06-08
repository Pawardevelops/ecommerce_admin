import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import swal from "sweetalert";
import category from "./api/category";
import { useSession } from "next-auth/react";
export default function Categories() {
  const {data} = useSession()
  const [editCategory, setEditCategory] = useState(null);
  const [categories, setCategories] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [name, setName] = useState();
  const [property,setProperty] = useState([])
  useEffect(() => {
    fetchCategories();
  }, []);
  const saveCategory = async (ev) => {
    ev.preventDefault();
    if (editCategory) {
      await axios.put("api/category", {
        _id: editCategory._id,
        name: name,
        parentCategory: parentCategory,
        Property:property.map(p=>{
          const {name,value} = p
          return {name,value}
        }),
        sellerEmail:data?.user?.email
      });
      setEditCategory(null);
      fetchCategories();
    } else {
      await axios.post("api/category", { name, parentCategory,Property:property,sellerEmail:data?.user?.email});
      fetchCategories();
    }
    setProperty([])
    setName("");
    setParentCategory("");
  };
  const fetchCategories = () => {
    axios
      .get("api/category?sellerEmail="+data?.user?.email)
      .then((res) => {
        setCategories(res.data.categories);
        setProperty(res.data.categories?.Property || [])
      })
      .catch((err) => console.error(err));
  };
  const categoryEditMode = (cat) => {
    setEditCategory(cat);
    setParentCategory(cat.parentCategory?._id || "");
    setName(cat.name);
    setProperty(cat?.Property || [])
  };
  const deleteCategory= async (_id)=>{
    await axios.delete("api/category?id="+_id)
    fetchCategories()
  }
  const addProperty=()=>{
    setProperty(prev=>{
      console.log(prev)
      const newProp = [...prev,{name:"",value:""}]
      return newProp
    })
  }

 const handlePropertyName =(index,property,name)=>{
    setProperty(prev=>{
      const  properties= [...prev]
      properties[index].name=name
      return properties
    })
 }
 const handlePropertyValue =(index,property,value)=>{
  setProperty(prev=>{
    const  properties= [...prev]
    properties[index].value=value
    return properties
  })
}

const handleRemove=(index)=>{
  setProperty(prev=>{
    return [...prev].filter((p,pI)=>pI!==index)
  })
}
  console.log(property);
  return (
    <Layout>
      <h1>Categories</h1>
      <label>{editCategory ? "Edit Category" : "Create Category"}</label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
        <input
          type={"text"}
          placeholder="Category name"
          onChange={(ev) => setName(ev.target.value)}
          value={name}
        />
        <select
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value={""}>Category not selected</option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}

        </select>
        </div>
        <div className="mb-2">
        <label  className="block">Property</label>
          <button type="button" className="btn-default mb-2" onClick={addProperty} >
            Add new property
          </button>
          {property?.length>0 && property.map((item,index)=>(
            <div key={index} className="flex gap-1 justify-center align-center mb-2">
              <input className="mb-0" value={item?.name} onChange={(ev)=>{handlePropertyName(index,item,ev.target.value)}} placeholder="Name (Ex:Color)" type={'text'} />
              <input className="mb-0" value={item?.value} onChange={(ev)=>{handlePropertyValue(index,item,ev.target.value)}}  placeholder="Value, comma separated" type={'text'} />
              <button type="button" onClick={()=>{handleRemove(index)}} className="btn-primary ">Remove</button>
            </div>
          ))}
        </div>
        {editCategory && 
          <button type="button" onClick={()=>{
          setEditCategory(null);
          setName('')
          setParentCategory('')
          setProperty([])
        }} className="btn-default py-1 px-4 mr-2">
          Cancle
        </button>
        }
        <button type="submit" className="btn-primary py-1 px-4">
          Save
        </button>
      </form>
      {!editCategory &&
        <table className="basic mt-2">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories?.length > 0 &&
            categories.map((item) => {
              return (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item?.parentCategory?.name}</td>
                  <td>
                    <button
                      onClick={() => {
                        categoryEditMode(item);
                      }}
                      className="btn-default mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        swal({
                          title: "Are you sure?",
                          text: "Once deleted, you will not be able to recover this Category!",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            swal(
                              "Poof! Your Category has been deleted!",
                              {
                                icon: "success",
                              }
                            );
                            deleteCategory(item._id);
                          } else {
                            swal("Your Category is safe!");
                          }
                        })
                      }
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      }
    </Layout>
  );
}
