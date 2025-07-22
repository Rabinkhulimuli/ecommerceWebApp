import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request:Request){

    try{
        const {searchParams}= new URL(request.url)
        const userId= searchParams.get("userId")
        if(!userId){
            return NextResponse.json({error:"user or product not found"},{status:400});
        }
        const cartItem= await prisma.cartItem.findMany({
            where:{
                userId
            },
            include:{
                product:{
                    include:{
                        images:true,
                        category:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
                
            }
        })
        if(!cartItem){
            return NextResponse.json({error:"cart item is empty"})
        }
         // Transform data to include image URLs
    const responseData = cartItem.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        discount: 0,
        images: item.product.images.map(image => ({
          id: image.id,
          url: image.url, // Assuming your Image model has a 'url' field
          thumbnailUrl: image.url?.replace('/upload/', '/upload/w_200,h_200,c_fill/'),
          altText:  `${item.product.name} image`
        })),
        category: item.product.category.name
      }
    }));

        return NextResponse.json({success:true,data:responseData},{status:200})
    }catch(err){
        return NextResponse.json({error:"error getting cart items"},{status:400})
    }
}