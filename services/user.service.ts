import { getUserResType } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

export const useGetUser=()=> {
    const getUser= async():Promise<getUserResType>=> {
        const res= await fetch("/api/user")
        if(!res.ok){
            throw new Error("error getting user")
        }
        const data = await res.json()
        return data
    }
    const {data:userData,isLoading}= useQuery({
        queryFn:getUser,
        queryKey:['getUser']
    })
    return {userData,isLoading}
}