import { useCallback, useMemo } from 'react';
import {
  useCartActions,
  useCartStateByTenantSlug
} from '@/modules/checkout/store/use-cart-store';

export const useCart = (tenantSlug: string) => {
  const cartItems = useCartStateByTenantSlug(tenantSlug);

  const { addProductToCart, removeProductFromCart, clearCart } =
    useCartActions();

  const totalItems = useMemo(() => cartItems.length, [cartItems]);

  const toggleProductToCart = useCallback(
    (productId: string) => {
      console.log('toggleProductToCart', productId, cartItems);
      if (cartItems.includes(productId)) {
        removeProductFromCart(tenantSlug, productId);
      } else {
        addProductToCart(tenantSlug, productId);
      }
    },
    [cartItems, tenantSlug, removeProductFromCart, addProductToCart]
  );

  const isProductInCart = useCallback(
    (productId: string) => {
      return cartItems.includes(productId);
    },
    [cartItems]
  );

  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  }, [clearCart, tenantSlug]);

  const removeProductFromCartCallback = useCallback(
    (productId: string) => {
      removeProductFromCart(tenantSlug, productId);
    },
    [removeProductFromCart, tenantSlug]
  );

  return {
    cartItems,
    totalItems,
    toggleProductToCart,
    removeProductFromCart: removeProductFromCartCallback,
    clearCart: clearTenantCart,
    isProductInCart
  };
};
