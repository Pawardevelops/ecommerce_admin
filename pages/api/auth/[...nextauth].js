import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from '../../../lib/mongodb'

const adminEmail = 'sp20002511@gmail.com'



export const nextAuthOptions={
  providers: [
   
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }) 
  ],
  secret:process.env.NEXT_PUBLIC_SECRET,
 adapter:MongoDBAdapter(clientPromise),
//  callbacks:{
//   session:({session,token,user})=>{
//     if(adminEmail.includes(session?.user?.email)){
//       return session
//     }
//     return false
//   },
//  },
};
export default NextAuth(nextAuthOptions)
