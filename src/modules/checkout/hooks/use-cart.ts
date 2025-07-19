import { useCallback } from 'react';
import { useCartStore } from '@/modules/checkout/store/use-cart-store';

export const useCart = (tenantSlug: string) => {
  const {
    updateProductToCart,
    removeProductFromCart,
    clearCart,
    clearAllCarts,
    getCartByTenantSlug
  } = useCartStore();

  const cartItems = getCartByTenantSlug(tenantSlug);

  const isProductInCart = useCallback(
    (productId: string) => {
      return cartItems[productId] > 0;
    },
    [cartItems]
  );

  const clearTenantCart = () => {
    clearCart(tenantSlug);
  };

  return {
    cartItems,
    totalItems: Object.keys(cartItems).length,
    updateProductToCart: (productId: string, quantity: number) =>
      updateProductToCart(tenantSlug, productId, quantity),
    removeProductFromCart: (productId: string) =>
      removeProductFromCart(tenantSlug, productId),
    clearCart: clearTenantCart,
    isProductInCart,
    clearAllCarts
  };
};
