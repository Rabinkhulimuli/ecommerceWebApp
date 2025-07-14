import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    const data= await prisma.category.findMany()
    return NextResponse.json(data)
}
export async function POST(request: NextRequest) {
  const body = await request.json(); 

  if (!body?.name || body.name.trim() === "") {
    return NextResponse.json(
      { error: "Name is required", status: 400 },
      { status: 400 }
    );
  }
  const existingCategory= await prisma.category.findUnique({
    where:{
        name: body.name
    }
  })
  if(existingCategory){
    return NextResponse.json({
        error:"category already exist",status:409
    },
{status:409})
  }
  // Optional: Insert into DB
  const newCategory = await prisma.category.create({
    data: { name: body.name },
  });

  console.log("Category created:", newCategory);

  return NextResponse.json(newCategory);
}
