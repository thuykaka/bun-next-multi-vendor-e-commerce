import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

type CartState = {
  tenantCarts: { [tenantSlug: string]: string[] };
  actions: {
    addProductToCart: (tenantSlug: string, productId: string) => void;
    removeProductFromCart: (tenantSlug: string, productId: string) => void;
    clearCart: (tenantSlug: string) => void;
    clearAllCarts: () => void;
  };
};

const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      tenantCarts: {},
      actions: {
        addProductToCart: (tenantSlug: string, productId: string) => {
          set((state) => {
            state.tenantCarts[tenantSlug] ||= [];
            state.tenantCarts[tenantSlug].push(productId);
          });
        },
        removeProductFromCart: (tenantSlug: string, productId: string) => {
          set((state) => {
            if (!state.tenantCarts[tenantSlug]) return;
            state.tenantCarts[tenantSlug] = state.tenantCarts[
              tenantSlug
            ].filter((id) => id !== productId);
          });
        },
        clearCart: (tenantSlug: string) => {
          set((state) => {
            state.tenantCarts[tenantSlug] = [];
          });
        },
        clearAllCarts: () => {
          set((state) => {
            state.tenantCarts = {};
          });
        }
      }
    })),
    {
      name: 'funroad-cart',
      partialize: ({ actions, ...rest }) => rest
    }
  )
);

export const useCartActions = () =>
  useCartStore(useShallow((state) => state.actions));

export const useCartStateByTenantSlug = (tenantSlug: string) =>
  useCartStore(useShallow((state) => state.tenantCarts[tenantSlug] || []));
