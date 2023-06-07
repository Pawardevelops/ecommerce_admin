import { useSession } from "next-auth/react";
import Layout from "../components/Layout";

export default function Home(){
  const {data} = useSession()
  return (
    <Layout>
      <div className='text-blue-900 flex justify-between'>
        <h2>
        Hello, <b>{data?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-back rounded-lg overflow-hidden">
        <img className="w-6 h-6" src={data?.user?.image} alt=''/>
        <span className="px-2">

        {data?.user?.name}
        </span>
        </div>
      </div>
    </Layout>
  )
}