import prisma from "@/lib/prisma";
import { UserWithInteractions, ProductWithDetails } from "@/lib/types";

// Move cosineSim function outside the main function to avoid ES5 strict mode error
function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

// Fallback function to get popular products
async function getPopularProducts(limit: number): Promise<ProductWithDetails[]> {
  return prisma.product.findMany({
    take: limit,
    orderBy: {
      // Use a valid field for ordering
      createdAt: 'desc'
    },
    include: {
      images: true,
      category: true,
    }
  });
}

// Get recommendations for a user
export async function getUserRecommendations(userId: string, limit = 5): Promise<ProductWithDetails[]> {
  try {
    // Step 1: Get all products and users with interactions
    const [products, users] = await Promise.all([
      prisma.product.findMany({ 
        select: { id: true },
        // Remove isActive filter or replace with valid Prisma filter
        where: { 
          // Use a valid field if you have an active status
          // isActive: true 
        }
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { order: { some: {} } },
            { wishlist: { some: {} } },
            { views: { some: {} } }
          ]
        },
        include: { 
          order: { 
            include: { items: { select: { productId: true } } } 
          }, 
          wishlists: { select: { productId: true } }, 
          views: { select: { productId: true } } 
        }
      })
    ]);

    // Cast users to the correct type
    const typedUsers = users as unknown as UserWithInteractions[];

    const productIds = products.map(p => p.id);
    if (productIds.length === 0) return getPopularProducts(limit);

    // Step 2: Build user vectors
    const userVectors: Record<string, number[]> = {};
    
    for (const user of typedUsers) {
      const vector = productIds.map(pid => {
        const hasOrdered = user.orders.some(order => 
          order.items.some(item => item.productId === pid)
        );
        const hasWishlisted = user.wishlists.some(w => w.productId === pid);
        const hasViewed = user.views.some(v => v.productId === pid);
        
        return hasOrdered || hasWishlisted || hasViewed ? 1 : 0;
      });
      
      userVectors[user.id] = vector;
    }

    // Step 3: Find most similar users
    const targetVector = userVectors[userId];
    if (!targetVector) return getPopularProducts(limit);

    const similarities = Object.entries(userVectors)
      .filter(([id]) => id !== userId)
      .map(([id, vector]) => ({
        id,
        similarity: cosineSim(targetVector, vector),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .filter(sim => sim.similarity > 0);

    if (similarities.length === 0) {
      return getPopularProducts(limit);
    }

    // Step 4: Get recommended products
    const topSimilar = similarities.slice(0, 3);
    const recommended: Record<string, number> = {};

    for (const sim of topSimilar) {
      const similarUser = typedUsers.find(u => u.id === sim.id);
      if (!similarUser) continue;

      for (const pid of productIds) {
        const productIndex = productIds.indexOf(pid);
        if (targetVector[productIndex] === 0) {
          const interacted =
            similarUser.orders.some(order => 
              order.items.some(item => item.productId === pid)
            ) ||
            similarUser.wishlists.some(w => w.productId === pid) ||
            similarUser.views.some(v => v.productId === pid);

          if (interacted) {
            recommended[pid] = (recommended[pid] || 0) + sim.similarity;
          }
        }
      }
    }

    // Step 5: Return top products
    const sortedRecommendations = Object.entries(recommended)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    if (sortedRecommendations.length === 0) {
      return getPopularProducts(limit);
    }

    const recommendedProducts = await prisma.product.findMany({
      where: { id: { in: sortedRecommendations } },
      include: {
        images: true,
        category: true,
      }
    });

    return recommendedProducts as ProductWithDetails[];

  } catch (error) {
    console.error('Error in getUserRecommendations:', error);
    return getPopularProducts(limit);
  }
}