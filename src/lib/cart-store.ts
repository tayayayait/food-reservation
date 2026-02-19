import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  options: { name: string; priceModifier: number }[];
  imageUrl?: string;
}

interface CartState {
  shopId: string | null;
  shopName: string | null;
  items: CartItem[];
  addItem: (shopId: string, shopName: string, item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      shopId: null,
      shopName: null,
      items: [],
      addItem: (shopId, shopName, item) => {
        const state = get();
        if (state.shopId && state.shopId !== shopId) {
          // Different shop, clear cart
          set({ shopId, shopName, items: [item] });
        } else {
          const existing = state.items.find(i => i.itemId === item.itemId);
          if (existing) {
            set({
              shopId, shopName,
              items: state.items.map(i =>
                i.itemId === item.itemId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            });
          } else {
            set({ shopId, shopName, items: [...state.items, item] });
          }
        }
      },
      removeItem: (itemId) =>
        set(state => ({
          items: state.items.filter(i => i.itemId !== itemId),
          ...(state.items.length <= 1 ? { shopId: null, shopName: null } : {}),
        })),
      updateQuantity: (itemId, quantity) =>
        set(state => ({
          items: quantity <= 0
            ? state.items.filter(i => i.itemId !== itemId)
            : state.items.map(i => i.itemId === itemId ? { ...i, quantity } : i),
        })),
      clearCart: () => set({ shopId: null, shopName: null, items: [] }),
      totalPrice: () => get().items.reduce((sum, i) => {
        const optionsPrice = i.options.reduce((s, o) => s + o.priceModifier, 0);
        return sum + (i.price + optionsPrice) * i.quantity;
      }, 0),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
