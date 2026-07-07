import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import * as wishlistService from "../services/wishlistService";

interface WishlistContextType {
  wishlist: string[];
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      setWishlist(await wishlistService.getWishlist(user.id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void refreshWishlist();
  }, [authLoading, refreshWishlist]);

  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!user) return false;

      const isCurrentlyWishlisted = wishlist.includes(productId);

      setWishlist((prev) =>
        isCurrentlyWishlisted
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );

      try {
        const added = await wishlistService.toggle(user.id, productId);
        return added;
      } catch {
        setWishlist((prev) =>
          isCurrentlyWishlisted
            ? [...prev, productId]
            : prev.filter((id) => id !== productId)
        );
        throw new Error("Unable to update wishlist.");
      }
    },
    [user, wishlist]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!user) return;

      setWishlist((prev) => prev.filter((id) => id !== productId));

      try {
        await wishlistService.remove(user.id, productId);
      } catch {
        setWishlist((prev) => [...prev, productId]);
        throw new Error("Unable to remove from wishlist.");
      }
    },
    [user]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
