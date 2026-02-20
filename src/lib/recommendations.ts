import type { Product } from '../types';

/**
 * Smart Recommendation Engine
 * Uses collaborative filtering and content-based algorithms
 */

// Calculate similarity between two products
export const calculateProductSimilarity = (product1: Product, product2: Product): number => {
  let score = 0;

  // Same category = +30 points
  if (product1.category === product2.category) score += 30;

  // Same occasion = +20 points
  if (product1.occasion === product2.occasion) score += 20;

  // Similar price range (within 20%) = +15 points
  const priceDiff = Math.abs(product1.price - product2.price);
  const avgPrice = (product1.price + product2.price) / 2;
  if (priceDiff / avgPrice < 0.2) score += 15;

  // Similar sustainability rating = +10 points
  const ratingDiff = Math.abs(product1.sustainable_rating - product2.sustainable_rating);
  if (ratingDiff <= 1) score += 10;

  // Shared colors = +5 points per match
  const colors1 = product1.color_palette || [];
  const colors2 = product2.color_palette || [];
  const sharedColors = colors1.filter((c) => colors2.includes(c));
  score += sharedColors.length * 5;

  return Math.min(score, 100);
};

/**
 * Get personalized product recommendations
 */
export const getPersonalizedRecommendations = (
  allProducts: Product[],
  viewedProducts: Product[],
  purchasedProductIds: string[],
  favoriteCategories: Record<string, number>,
  favoriteOccasions: Record<string, number>,
  priceRange: { min: number; max: number },
  limit: number = 8
): Product[] => {
  // Exclude already purchased
  const availableProducts = allProducts.filter((p) => !purchasedProductIds.includes(p.id));

  // Score each product
  const scoredProducts = availableProducts.map((product) => {
    let score = 0;

    // Category preference score (0-30)
    const categoryScore = favoriteCategories[product.category] || 0;
    score += Math.min(categoryScore, 30);

    // Occasion preference score (0-20)
    const occasionScore = favoriteOccasions[product.occasion || 'general'] || 0;
    score += Math.min(occasionScore, 20);

    // Price range match (0-15)
    if (product.price >= priceRange.min && product.price <= priceRange.max) {
      score += 15;
    } else {
      const distanceFromRange = Math.min(
        Math.abs(product.price - priceRange.min),
        Math.abs(product.price - priceRange.max)
      );
      score += Math.max(0, 15 - distanceFromRange / 10);
    }

    // Similarity to viewed products (0-35)
    if (viewedProducts.length > 0) {
      const similarities = viewedProducts.map((viewed) =>
        calculateProductSimilarity(product, viewed)
      );
      const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
      score += (avgSimilarity / 100) * 35;
    }

    // Boost high sustainability (0-10)
    score += product.sustainable_rating * 2;

    return { product, score };
  });

  // Sort by score and return top N
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);
};

/**
 * Get "Frequently Bought Together" recommendations
 */
export const getFrequentlyBoughtTogether = (
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] => {
  // Filter complementary products
  const complementary = allProducts.filter((p) => {
    if (p.id === currentProduct.id) return false;

    // Different category but same occasion
    if (p.occasion === currentProduct.occasion && p.category !== currentProduct.category) {
      return true;
    }

    // Accessories that match
    if (p.category === 'accessories' || currentProduct.category === 'accessories') {
      return true;
    }

    return false;
  });

  // Score by complementarity
  const scored = complementary.map((product) => {
    let score = 0;

    // Same occasion = high complementarity
    if (product.occasion === currentProduct.occasion) score += 40;

    // Price balance (accessories cheaper, outfits similar)
    if (product.price < currentProduct.price * 0.5) score += 20; // Good accessory price
    if (Math.abs(product.price - currentProduct.price) < 30) score += 15; // Similar tier

    // Color harmony
    const sharedColors =
      currentProduct.color_palette?.filter((c) => product.color_palette?.includes(c)) || [];
    score += sharedColors.length * 10;

    return { product, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);
};

/**
 * Smart search with semantic understanding
 */
export const semanticSearch = (query: string, products: Product[]): Product[] => {
  const lowerQuery = query.toLowerCase();

  // Intent detection
  const intents = {
    occasion: /(party|fiesta|celebration|evento|wedding|boda|formal|casual|gym|workout|office|oficina|trabajo)/i,
    price: /(cheap|barato|expensive|caro|affordable|budget|luxury|premium)/i,
    sustainability: /(eco|sustainable|sostenible|organic|organico|green|ethical)/i,
    color: /(red|rojo|blue|azul|black|negro|white|blanco|green|verde)/i,
    style: /(modern|moderno|classic|clasico|minimal|bohemian|elegant)/i,
  };

  // Extract intents
  const detectedIntents: Record<string, string> = {};
  Object.entries(intents).forEach(([intent, regex]) => {
    const match = query.match(regex);
    if (match) detectedIntents[intent] = match[0];
  });

  // Score products based on semantic match
  const scored = products.map((product) => {
    let score = 0;

    // Basic text match (name + description)
    const searchText = `${product.name} ${product.description} ${product.category} ${product.occasion}`.toLowerCase();
    const queryWords = lowerQuery.split(' ').filter((w) => w.length > 2);
    queryWords.forEach((word) => {
      if (searchText.includes(word)) score += 10;
    });

    // Intent-based scoring
    if (detectedIntents.occasion && product.occasion?.toLowerCase().includes(detectedIntents.occasion.toLowerCase())) {
      score += 30;
    }

    if (detectedIntents.price) {
      if (['cheap', 'barato', 'affordable', 'budget'].includes(detectedIntents.price.toLowerCase())) {
        score += product.price < 100 ? 20 : 0;
      }
      if (['expensive', 'caro', 'luxury', 'premium'].includes(detectedIntents.price.toLowerCase())) {
        score += product.price > 200 ? 20 : 0;
      }
    }

    if (detectedIntents.sustainability && product.sustainable_rating >= 4) {
      score += 25;
    }

    if (detectedIntents.color) {
      const colorMatch = product.color_palette?.some((color) =>
        color.toLowerCase().includes(detectedIntents.color.toLowerCase())
      );
      if (colorMatch) score += 20;
    }

    return { product, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
};

/**
 * Dynamic pricing suggestions (simulate AI-driven pricing)
 */
export const getDynamicPrice = (
  product: Product,
  userBehavior: {
    viewedTimes: number;
    cartAbandoned: boolean;
    isNewUser: boolean;
    priceRange: { min: number; max: number };
  }
): { price: number; discount: number; reason: string } => {
  let discount = 0;
  let reason = '';

  // Cart abandonment recovery
  if (userBehavior.cartAbandoned && userBehavior.viewedTimes > 2) {
    discount = 10;
    reason = '¡Vuelve y ahorra 10%! Lo guardamos para ti 💝';
  }

  // New user welcome
  if (userBehavior.isNewUser) {
    discount = Math.max(discount, 15);
    reason = '🎉 Bienvenido a AuraFit: 15% OFF en tu primera compra';
  }

  // Price sensitivity
  if (product.price > userBehavior.priceRange.max * 1.2) {
    discount = Math.max(discount, 12);
    reason = '💰 Oferta especial: Te lo dejamos a mejor precio';
  }

  // High interest (viewed many times)
  if (userBehavior.viewedTimes > 5 && discount === 0) {
    discount = 8;
    reason = '👀 Vimos que te encanta: 8% de descuento extra';
  }

  const finalPrice = product.price * (1 - discount / 100);
  return { price: parseFloat(finalPrice.toFixed(2)), discount, reason };
};
