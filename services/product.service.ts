import { Product } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

export const useGetAllProduct=()=> {
    const getAllProduct= async():Promise<Product[]> => {
        try{
            const res= await fetch("/api/products",{
                method:"GET"
            })
            if(!res.ok){
                throw new Error("error retriving product data")
            }
            const data= await res.json()
            return data
        }catch(err){
            console.log(err)
        }
    }
    const {data:getAllProductData,isLoading}= useQuery<Product[]>({
        queryFn:getAllProduct,
        queryKey:['getAllProduct']

    });
    return {getAllProductData,isLoading}
}