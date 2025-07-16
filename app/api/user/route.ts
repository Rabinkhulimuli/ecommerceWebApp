import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const id = session?.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        image: true,
        addresses: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      addresses: user.addresses, // Changed from 'address' to 'addresses' to match frontend
      image: user.image?.url,
    });
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: "Error getting user" }, { status: 500 });
  }
}



export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const session = await getServerSession(authOptions); // Get session to verify user
    const userId = session?.user.id;
    const existingUser= await prisma.user.findUnique({
      where:{
        id:userId
      },
      include:{
        image:true
      }
    })
    if (!existingUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Extract form data with proper type checking
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const avatarFile = formData.get("avatar");
    const avatarChanged = formData.get("avatarChanged") === "true";
    const primaryRawAddress = formData.get("primaryRawAddress") as string;
    const secondaryRawAddress = formData.get("secondaryRawAddress") as string | null;

    // Validate required fields
    if (!primaryRawAddress) {
      return NextResponse.json({ error: "Primary address is required" }, { status: 400 });
    }

    // Parse addresses with error handling
    let primaryAddress, secondaryAddress: typeof primaryAddress;
    try {
      primaryAddress = JSON.parse(primaryRawAddress);
      if (secondaryRawAddress) {
        secondaryAddress = JSON.parse(secondaryRawAddress);
      }
    } catch (error) {
      console.error("Address parse error:", error);
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 });
    }

    // Validate address fields
    if (!primaryAddress.city || !primaryAddress.country || !primaryAddress.postalCode) {
      return NextResponse.json(
        { error: "Primary address requires city, country, and postal code" },
        { status: 400 }
      );
    }

    // Start transaction for atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Handle image upload if changed
      let imageUpdate = {};
      if (avatarChanged) {
        // Delete old image if exists
        const oldImage = existingUser.image?.publicId
        if (oldImage) {
          await cloudinary.uploader.destroy(oldImage);
        }

        if (avatarFile instanceof File && avatarFile.size > 0) {
          // Upload new image
          const buffer = Buffer.from(await avatarFile.arrayBuffer());
          const uploadResult = await cloudinary.uploader.upload(
            `data:${avatarFile.type};base64,${buffer.toString("base64")}`,
            { folder: "nextjs-user-avatars" }
          );

          imageUpdate = {
            image: {
              upsert: {
                create: {
                  url: uploadResult.secure_url,
                  publicId: uploadResult.public_id,
                },
                update: {
                  url: uploadResult.secure_url,
                  publicId: uploadResult.public_id,
                },
              },
            },
          };
        } else {
          // Remove image if no file provided but avatarChanged is true
          imageUpdate = { image: { delete: true } };
        }
      }

      // Delete all old addresses
      await tx.address.deleteMany({ where: { userId } });

      // Create new addresses
      const addressesToCreate = [
        { ...primaryAddress, isPrimary: true },
        ...(secondaryAddress ? [{ ...secondaryAddress, isPrimary: false }] : []),
      ];

      // Update user with all changes
      return await tx.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          ...imageUpdate,
          addresses: {
            create: addressesToCreate,
          },
        },
        include: {
          addresses: true,
          image: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        addresses: result.addresses,
        image: result.image?.url,
      },
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}