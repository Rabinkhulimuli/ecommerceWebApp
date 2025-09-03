import prisma from "@/lib/prisma"
export function safeJSON<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (value?._isDecimal) return value.toNumber();
      if (value instanceof Date) return value.toISOString();
      return value;
    })
  );
}
export async function getCategoriesWithProducts() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          images: true,
        },
      }
    },
  });

  return  safeJSON(categories)
}
