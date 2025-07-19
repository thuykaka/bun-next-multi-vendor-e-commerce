import { shared } from 'use-broadcast-ts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type CartItem = {
  [productId: string]: number;
};

type CartState = {
  tenantCarts: { [tenantSlug: string]: CartItem };
  updateProductToCart: (
    tenantSlug: string,
    productId: string,
    quantity: number
  ) => void;
  removeProductFromCart: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
  getCartByTenantSlug: (tenantSlug: string) => CartItem;
};

export const useCartStore = create<CartState>()(
  persist(
    shared(
      immer((set, get) => ({
        tenantCarts: {},
        updateProductToCart: (
          tenantSlug: string,
          productId: string,
          quantity: number = 1
        ) => {
          set((state) => {
            state.tenantCarts[tenantSlug] ||= {};

            const currentQuantity =
              state.tenantCarts[tenantSlug][productId] || 0;
            const newQuantity = currentQuantity + quantity;

            if (newQuantity <= 0) {
              delete state.tenantCarts[tenantSlug][productId];
            } else {
              state.tenantCarts[tenantSlug][productId] = newQuantity;
            }
          });
        },
        removeProductFromCart: (tenantSlug: string, productId: string) => {
          set((state) => {
            delete state.tenantCarts[tenantSlug][productId];
          });
        },
        clearCart: (tenantSlug: string) => {
          set((state) => {
            state.tenantCarts[tenantSlug] = {};
          });
        },
        clearAllCarts: () => {
          set((state) => {
            state.tenantCarts = {};
          });
        },
        getCartByTenantSlug: (tenantSlug: string) => {
          return get().tenantCarts[tenantSlug] || {};
        }
      })),
      {
        name: 'cart-channel'
      }
    ),
    {
      name: 'funroad-cart'
    }
  )
);
