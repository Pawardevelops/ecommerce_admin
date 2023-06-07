import multiparty from 'multiparty'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs'
import mime from 'mime-types'

export default async function  upload(req,res) {
    const bucketName='sachin-next-ecommerce'
  const form = new multiparty.Form()
  const  {fields,files} = await new Promise((resolve,reject)=>{
      form.parse(req,(error,fields,files)=>{
            if(error) reject(error)  
          resolve({fields,files})
      });
  });

  const s3 = new S3Client({
    region:'eu-north-1',
    credentials:{
        accessKeyId:process.env.S3_ACCESS_KEY,
        secretAccessKey:process.env.S3_SECRET_ACCESS_KEY
    }
})
let links =[]
for(const file of files.file){
    const ext = file.originalFilename.split('.').pop();
    const newName = Date.now() +"."+ext;
    await s3.send(new PutObjectCommand({
        Bucket:bucketName,
        Key:newName,
        Body:fs.readFileSync(file.path),
        ACL:'public-read',
        ContentType:mime.lookup(file.path)
    }))
    const link =`https://${bucketName}.s3.eu-north-1.amazonaws.com/${newName}`

    links.push(link)

}
  res.send(links)
}

export const config ={
    api:{bodyParser:false}
}
