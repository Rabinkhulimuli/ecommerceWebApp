import { Divide } from "lucide-react"
import type { Product } from "./types"


export async function getProducts(): Promise<Product[]| null> {

  try{
     const data = await fetch("http://localhost:3000/api/products")
 
    if(!data.ok){
      console.log("error getting product")
    }
       const res= await data.json()
     console.log(res)
      return res
  }catch(err){
    console.log(err)
    throw new Error("error getting product")
  }
}

