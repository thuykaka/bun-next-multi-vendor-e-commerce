import { useCallback } from 'react';
import { useCartStore } from '@/modules/checkout/store/use-cart-store';

export const useCart = (tenantSlug: string) => {
  const {
    addProductToCart,
    removeProductFromCart,
    clearCart,
    clearAllCarts,
    getCartByTenantSlug
  } = useCartStore();

  const productIds = getCartByTenantSlug(tenantSlug);

  const toggleProductInCart = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProductFromCart(tenantSlug, productId);
      } else {
        addProductToCart(tenantSlug, productId);
      }
    },
    [productIds, tenantSlug]
  );

  const isProductInCart = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds]
  );

  const clearTenantCart = () => {
    clearCart(tenantSlug);
  };

  return {
    productIds,
    totalItems: productIds.length,
    addProductToCart: (productId: string) =>
      addProductToCart(tenantSlug, productId),
    removeProductFromCart: (productId: string) =>
      removeProductFromCart(tenantSlug, productId),
    clearCart: clearTenantCart,
    isProductInCart,
    toggleProductInCart,
    clearAllCarts
  };
};
