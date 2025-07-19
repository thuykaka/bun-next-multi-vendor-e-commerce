import { shared } from 'use-broadcast-ts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type CartState = {
  tenantCarts: Record<string, { productIds: string[] }>;
  addProductToCart: (tenantSlug: string, productId: string) => void;
  removeProductFromCart: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
  getCartByTenantSlug: (tenantSlug: string) => string[];
};

export const useCartStore = create<CartState>()(
  persist(
    shared(
      immer((set, get) => ({
        tenantCarts: {},
        addProductToCart: (tenantSlug: string, productId: string) => {
          set((state) => {
            state.tenantCarts[tenantSlug] ||= { productIds: [] };
            state.tenantCarts[tenantSlug].productIds.push(productId);
          });
        },
        removeProductFromCart: (tenantSlug: string, productId: string) => {
          set((state) => {
            if (state.tenantCarts[tenantSlug]) {
              state.tenantCarts[tenantSlug].productIds = state.tenantCarts[
                tenantSlug
              ].productIds.filter((id: string) => id !== productId);
            }
          });
        },
        clearCart: (tenantSlug: string) => {
          set((state) => {
            if (state.tenantCarts[tenantSlug]) {
              state.tenantCarts[tenantSlug].productIds = [];
            }
          });
        },
        clearAllCarts: () => {
          set((state) => {
            state.tenantCarts = {};
          });
        },
        getCartByTenantSlug: (tenantSlug: string) => {
          return get().tenantCarts[tenantSlug]?.productIds || [];
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
