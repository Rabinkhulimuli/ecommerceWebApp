import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request:Request){
    try{
        const {searchParams}= new URL(request.url)
        const userId= searchParams.get("userId")
        const productId= searchParams.get("productId")
        if(!userId||!productId){
            return NextResponse.json({error:`${!userId?"no user found":"no product found"}`},{status:400})
        }
        await prisma.cartItem.deleteMany({
            where:{
                userId,
                productId
            }
        })
        return NextResponse.json({success:true,message:"cart item deleted successfully"},{status:200})
    }catch(err){
        return NextResponse.json({error:"error deleting cart items"},{status:400})
    }
}