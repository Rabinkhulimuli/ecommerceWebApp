import { NextResponse } from "next/server"

export async function POST(request:Request){
    try{
        const {price,category,page=1}= await request.json()
        if(!price||!Array.isArray(price||price.length !==2)){
            return NextResponse.json({
                error:"invalid price range"
            },{status:400})
        }
        const [minPrice,maxPrice]= price
        const PAGE_SIZE=10
        const skip=(page-1)*PAGE_SIZE
        const products= await prisma?.product.findMany({
            where:{
                price:{
                    gte:minPrice,
                    lte:Number(maxPrice)===5000?undefined:Number(maxPrice)
                },
                category:category.length>0?{
                    name:{
                        in:category
                    }
                }:undefined   
            },
            include:{
                images:true,
                category:true
            },
            take:PAGE_SIZE,
            skip:skip
        })
        return NextResponse.json({data:products},{status:200})
        
    }catch(err){
         console.error("Error filtering products:", err);
    return NextResponse.json(
      { error: "Failed to filter products" },
      { status: 500 }
    );
    }
}