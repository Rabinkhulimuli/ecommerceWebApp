import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const formData = await request.formData();
    const userRole = session?.user.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'user must sign in first ' }, { status: 400 });
    }
    const shop = await prisma.shop.findUnique({
      where: {
        ownerId: userId,
      },
    });
    if (!shop) {
      return NextResponse.json({ error: 'You must open a shop first' }, { status: 401 });
    }
    const productData = {
      name: formData.get('name')?.toString() || '',
      categoryId: formData.get('categoryId')?.toString() || '',
      price: Number(formData.get('price')) || 0,
      description: formData.get('description')?.toString() || '',
      stock: Number(formData.get('stock')) || 0,
      discount: Number(formData.get('discount') || 0),
    };
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const files = formData.getAll('images').filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      console.error('No valid files found in the request');
      return NextResponse.json({ error: 'No valid files were uploaded' }, { status: 400 });
    }

    const uploadResults = await Promise.all(
      files.map(async file => {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64String = buffer.toString('base64');
          const dataUri = `data:${file.type};base64,${base64String}`;

          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'nextjs-products',
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
        { error: 'Failed to upload any images to Cloudinary' },
        { status: 500 }
      );
    }
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: productData.name,
      },
    });
    if (existingProduct) {
      return NextResponse.json({ error: 'Product with that name already exists' }, { status: 400 });
    }
    // Create product in database using Prisma
    const createdProduct = await prisma.product.create({
      data: {
        shopId: shop.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        categoryId: productData.categoryId,
        discount: productData.discount,
        images: {
          createMany: {
            data: successfulUploads.map(upload => ({
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
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const userRole = session?.user.role;
    const {searchParams}= new URL(request.url)
    const productId= searchParams.get("id")
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    const formData = await request.formData();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // ---- product fields
    const productData = {
      name: formData.get('name')?.toString(),
      categoryId: formData.get('categoryId')?.toString(),
      price: Number(formData.get('price')) || undefined,
      description: formData.get('description')?.toString(),
      stock: Number(formData.get('stock')) || undefined,
      discount: Number(formData.get('discount')) || undefined,
    };

    // ---- existing images user wants to keep
    const existingImages = JSON.parse(formData.get('existingImages') as string || '[]') as {
      url: string;
      publicId: string;
    }[];

    // ---- fetch current images from DB
    const productInDb = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!productInDb) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // ---- determine removed images
    const removedImages = productInDb.images.filter(
      dbImg => !existingImages.some(img => img.publicId === dbImg.publicId)
    );

    // ---- delete removed images from Cloudinary first
    const cloudinaryResults = await Promise.all(
      removedImages.map(img =>
        cloudinary.uploader.destroy(img.publicId).then(
          res => ({ ok: true, id: img.publicId }),
          err => ({ ok: false, id: img.publicId, error: err })
        )
      )
    );

    const failedDeletes = cloudinaryResults.filter(r => !r.ok);
    if (failedDeletes.length > 0) {
      return NextResponse.json(
        { error: 'Failed to remove some images from Cloudinary', details: failedDeletes },
        { status: 500 }
      );
    }

    // ---- handle new file uploads
    const newFiles = formData.getAll('images').filter((item): item is File => item instanceof File);

    const uploadedImages = await Promise.all(
      newFiles.map(async file => {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64String = buffer.toString('base64');
          const dataUri = `data:${file.type};base64,${base64String}`;

          const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'nextjs-products',
          });

          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
          };
        } catch (error) {
          console.error('Upload error:', error);
          return null;
        }
      })
    );

    const successfulUploads = uploadedImages.filter(
      (upload): upload is { url: string; publicId: string } => upload !== null
    );

    // ---- perform DB updates inside a transaction
    const updatedProduct = await prisma.$transaction(async tx => {
      // Delete removed images from DB
      if (removedImages.length > 0) {
        await tx.image.deleteMany({
          where: {
            productId,
            publicId: { in: removedImages.map(img => img.publicId) },
          },
        });
      }

      // Add new uploads
      if (successfulUploads.length > 0) {
        await tx.image.createMany({
          data: successfulUploads.map(img => ({
            productId,
            url: img.url,
            publicId: img.publicId,
          })),
        });
      }

      // Update product fields
      return tx.product.update({
        where: { id: productId },
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          discount: productData.discount,
          categoryId: productData.categoryId,
        },
        include: { images: true },
      });
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
