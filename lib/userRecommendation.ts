
import { cache } from 'react';
import prisma, { ExtendedPrismaClient } from './prisma';
import { UserWithInteractions, ProductWithDetails, RecommendationResult } from './types';

// Move cosineSim function outside to avoid ES5 strict mode issues
function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

// Fallback function to get popular products
const getPopularProducts = cache(async (limit: number): Promise<ProductWithDetails[]> => {
  return prisma.product.findMany({
    take: limit,
    orderBy: { 
      createdAt: 'desc' 
    },
    include: {
      images: true,
      category: true,
    }
  });
});

// Main recommendation function with React cache
export const getUserRecommendations = cache(async (userId: string, limit = 5): Promise<RecommendationResult> => {
  try {
    // Step 1: Get active users with recent interactions (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const [products, users] = await Promise.all([
      prisma.product.findMany({ 
        select: { id: true },
        where: {
          OR: [
            { orderItems: { some: { createdAt: { gte: thirtyDaysAgo } } } },
            { wishlist: { some: { createdAt: { gte: thirtyDaysAgo } } } },
            { views: { some: { viewedAt: { gte: thirtyDaysAgo } } } }
          ]
        }
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { order: { some: { createdAt: { gte: thirtyDaysAgo } } } },
            { wishlist: { some: { createdAt: { gte: thirtyDaysAgo } } } },
            { views: { some: { viewedAt: { gte: thirtyDaysAgo } } } }
          ]
        },
        include: { 
          order: { 
            include: { orderItems: { select: { productId: true } } },
            where: { createdAt: { gte: thirtyDaysAgo } }
          }, 
          wishlist: { 
            select: { productId: true },
            where: { createdAt: { gte: thirtyDaysAgo } }
          }, 
          views: { 
            select: { productId: true },
            where: { viewedAt: { gte: thirtyDaysAgo } }
          } 
        }
      })
    ]);

    // Rest of your function implementation...
    // [Keep your exist
    const productIds = products.map(p => p.id)
    if (productIds.length === 0) {
      const fallbackProducts = await getPopularProducts(limit)
      return {
        products: fallbackProducts,
        generatedAt: new Date(),
        source: 'fallback'
      }
    }

    // Step 2: Build user vectors
    const userVectors: Record<string, number[]> = {}
    
    for (const user of users as unknown as UserWithInteractions[]) {
      const vector = productIds.map(pid => {
        const hasOrdered = user.orders.some(order => 
          order.items.some(item => item.productId === pid)
        )
        const hasWishlisted = user.wishlists.some(w => w.productId === pid)
        const hasViewed = user.views.some(v => v.productId === pid)
        
        return hasOrdered || hasWishlisted || hasViewed ? 1 : 0
      })
      
      userVectors[user.id] = vector
    }

    // Step 3: Find most similar users
    const targetVector = userVectors[userId]
    if (!targetVector) {
      const fallbackProducts = await getPopularProducts(limit)
      return {
        products: fallbackProducts,
        generatedAt: new Date(),
        source: 'fallback'
      }
    }

    const similarities = Object.entries(userVectors)
      .filter(([id]) => id !== userId)
      .map(([id, vector]) => ({
        id,
        similarity: cosineSim(targetVector, vector),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .filter(sim => sim.similarity > 0.1) // Minimum similarity threshold

    if (similarities.length === 0) {
      const fallbackProducts = await getPopularProducts(limit)
      return {
        products: fallbackProducts,
        generatedAt: new Date(),
        source: 'fallback'
      }
    }

    // Step 4: Get recommended products
    const topSimilar = similarities.slice(0, 3)
    const recommended: Record<string, number> = {}

    for (const sim of topSimilar) {
      const similarUser = users.find(u => u.id === sim.id) as unknown as UserWithInteractions
      if (!similarUser) continue

      for (const pid of productIds) {
        const productIndex = productIds.indexOf(pid)
        if (targetVector[productIndex] === 0) {
          const interacted =
            similarUser.orders.some(order => 
              order.items.some(item => item.productId === pid)
            ) ||
            similarUser.wishlists.some(w => w.productId === pid) ||
            similarUser.views.some(v => v.productId === pid)

          if (interacted) {
            recommended[pid] = (recommended[pid] || 0) + sim.similarity
          }
        }
      }
    }

    // Step 5: Return top products
    const sortedRecommendations = Object.entries(recommended)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id)

    if (sortedRecommendations.length === 0) {
      const fallbackProducts = await getPopularProducts(limit)
      return {
        products: fallbackProducts,
        generatedAt: new Date(),
        source: 'fallback'
      }
    }

    const recommendedProducts = await prisma.product.findMany({
      where: { id: { in: sortedRecommendations } },
      include: {
        images: true,
        category: true,
      }
    })

    return {
      products: recommendedProducts as ProductWithDetails[],
      generatedAt: new Date(),
      source: 'algorithm'
    }
  } catch (error) {
    console.error('Error in getUserRecommendations:', error);
    const fallbackProducts = await getPopularProducts(limit);
    return {
      products: fallbackProducts,
      generatedAt: new Date(),
      source: 'fallback'
    };
  }
});