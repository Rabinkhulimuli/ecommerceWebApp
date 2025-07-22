// app/api/products/create-product/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { DefaultSession, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

declare module "next-auth"{
  interface Session{
    user:{
    id:string
    } & DefaultSession["user"]
  }
}

export async function POST(request: Request) {
  try {
    const session= await getServerSession(authOptions)
    const userId= session?.user.id
    const formData = await request.formData();
    if(!userId){
      return NextResponse.json({error:"user mut sign in first "},{status:400})
    }
    // Extract product data
    const productData = {
      name: formData.get("name")?.toString() || "",
      categoryId: formData.get("categoryId")?.toString() || "",
      price: Number(formData.get("price")) || 0,
      description: formData.get("description")?.toString() || "",
      stock: Number(formData.get("stock")) || 0,
    };
    console.log("product data",productData)
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Get all files (handles both single and multiple files)
    const files = formData
      .getAll("images")
      .filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      console.error("No valid files found in the request");
      return NextResponse.json(
        { error: "No valid files were uploaded" },
        { status: 400 }
      );
    }

    // Upload files to Cloudinary

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64String = buffer.toString("base64");
          const dataUri = `data:${file.type};base64,${base64String}`;

          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: "nextjs-products",
          });

          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          };
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return null;
        }
      })
    );

    const successfulUploads = uploadResults.filter(
      (upload): upload is { url: string; publicId: string } => upload !== null
    );

    if (successfulUploads.length === 0) {
      return NextResponse.json(
        { error: "Failed to upload any images to Cloudinary" },
        { status: 500 }
      );
    }
    console.log("Final product payload", {
  ...productData,
  images: successfulUploads
});
    // Create product in database using Prisma
    const createdProduct = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        categoryId: productData.categoryId,
        images: {
          createMany: {
            data: successfulUploads.map((upload) => ({
              url: upload.url as string,
              publicId: upload.publicId as string,
              
            })),
          },
        },
      },
      include: {
        images: true,
      },
    });
    return NextResponse.json({
      success: true,
      product: createdProduct,
      images: successfulUploads,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
