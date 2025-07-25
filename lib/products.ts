import { Divide } from "lucide-react"
import type { Product } from "./types"

// Mock product data - in a real app, this would come from a database


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
export async function getProduct(id: string): Promise<Product | null> {
  
  return  null
}

const products=[]
export async function getProductsByCategory(category: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
}
