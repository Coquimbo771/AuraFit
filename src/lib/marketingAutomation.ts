/**
 * Smart Marketing Automation System
 * Handles cart abandonment, personalized offers, and user engagement
 */

import { useNotificationStore } from '../store/notificationStore';
import { useBehaviorStore } from '../store/behaviorStore';
import { useShoppingStore } from '../store/shoppingStore';

/**
 * Check for cart abandonment and send recovery notification
 */
export const checkCartAbandonment = () => {
  const { cartItems } = useShoppingStore.getState();
  const { addNotification } = useNotificationStore.getState();

  if (cartItems.length === 0) return;

  // Check if cart has been abandoned for > 30 minutes
  const lastActivity = localStorage.getItem('lastCartActivity');
  if (!lastActivity) return;

  const minutesSinceActivity = (Date.now() - parseInt(lastActivity)) / 1000 / 60;

  if (minutesSinceActivity > 30) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    addNotification({
      type: 'cart_abandonment',
      title: '🛍️ ¡Tu carrito te espera!',
      message: `Tienes ${totalItems} productos (${totalValue.toFixed(2)}) esperándote. ¡Completa tu compra y obtén 10% OFF!`,
      actionText: 'Ver mi carrito',
      actionUrl: '/checkout',
      priority: 'high',
      metadata: {
        cartValue: totalValue,
        itemCount: totalItems,
        discountOffered: 10,
      },
    });
  }
};

/**
 * Send welcome notification to new users
 */
export const sendWelcomeNotification = (userName: string) => {
  const { addNotification } = useNotificationStore.getState();
  const { preferences } = useBehaviorStore.getState();

  if (preferences.totalVisits <= 1) {
    addNotification({
      type: 'welcome',
      title: `¡Bienvenido/a a AuraFit, ${userName}! 🎉`,
      message: 'Descubre tu estilo perfecto con IA. Obtén 15% OFF en tu primera compra.',
      actionText: 'Explorar Marketplace',
      actionUrl: '/marketplace',
      priority: 'high',
      metadata: {
        discountCode: 'WELCOME15',
        expiresIn: 7, // days
      },
    });
  }
};

/**
 * Send low stock alert for viewed products
 */
export const sendLowStockAlert = (productName: string, productId: string, stockLeft: number) => {
  const { addNotification } = useNotificationStore.getState();

  if (stockLeft <= 3) {
    addNotification({
      type: 'low_stock',
      title: '⚠️ ¡Últimas unidades!',
      message: `Solo quedan ${stockLeft} unidades de "${productName}". ¡No te lo pierdas!`,
      actionText: 'Ver producto',
      actionUrl: `/marketplace?product=${productId}`,
      priority: 'medium',
    });
  }
};

/**
 * Send personalized product recommendations
 */
export const sendPersonalizedRecommendations = (products: { id: string; name: string }[]) => {
  const { addNotification } = useNotificationStore.getState();

  if (products.length > 0) {
    addNotification({
      type: 'recommendation',
      title: '✨ Productos perfectos para ti',
      message: `Basado en tu estilo, te recomendamos: ${products[0].name} y ${products.length - 1} más.`,
      actionText: 'Ver recomendaciones',
      actionUrl: '/dashboard?section=recommendations',
      priority: 'medium',
      metadata: {
        productIds: products.map((p) => p.id),
      },
    });
  }
};

/**
 * Send price drop alert
 */
export const sendPriceDropAlert = (productName: string, oldPrice: number, newPrice: number, productId: string) => {
  const { addNotification } = useNotificationStore.getState();
  const discount = ((oldPrice - newPrice) / oldPrice) * 100;

  addNotification({
    type: 'price_drop',
    title: '💰 ¡Bajó de precio!',
    message: `"${productName}" ahora ${discount.toFixed(0)}% más barato: $${newPrice.toFixed(2)} (antes $${oldPrice.toFixed(2)})`,
    actionText: 'Aprovechar oferta',
    actionUrl: `/marketplace?product=${productId}`,
    priority: 'high',
    metadata: {
      oldPrice,
      newPrice,
      discount,
    },
  });
};

/**
 * Send personalized promo based on user behavior
 */
export const sendSmartPromo = () => {
  const { preferences, viewedProducts } = useBehaviorStore.getState();
  const { addNotification } = useNotificationStore.getState();

  // Get user's favorite category
  const favoriteCategory = Object.entries(preferences.favoriteCategories)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  if (!favoriteCategory) return;

  // Check if user hasn't visited in a while
  const daysSinceLastVisit = (Date.now() - preferences.lastVisit) / 1000 / 60 / 60 / 24;

  if (daysSinceLastVisit > 3) {
    addNotification({
      type: 'promo',
      title: '🎁 ¡Te extrañamos!',
      message: `Vuelve y descubre nuevos ${favoriteCategory}. 20% OFF solo por hoy.`,
      actionText: 'Ver ofertas',
      actionUrl: `/marketplace?category=${favoriteCategory}`,
      priority: 'high',
      metadata: {
        discountCode: 'COMEBACK20',
        category: favoriteCategory,
      },
    });
  }
};

/**
 * Initialize marketing automation checks
 */
export const initializeMarketingAutomation = () => {
  // Check cart abandonment every 5 minutes
  setInterval(() => {
    checkCartAbandonment();
  }, 5 * 60 * 1000);

  // Check for comeback promos daily
  setInterval(() => {
    sendSmartPromo();
  }, 24 * 60 * 60 * 1000);
};

/**
 * Track last cart activity
 */
export const trackCartActivity = () => {
  localStorage.setItem('lastCartActivity', Date.now().toString());
};
