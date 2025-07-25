import { useToast } from "@/hooks/use-toast";
import { cartItemRersponse, CartItemResponsetype, UpdateCartParams } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCartItems = (userId: string) => {
  const getCartItem = async (): Promise<CartItemResponsetype> => {
    const res = await fetch(`/api/cart/view-cart?userId=${userId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch cart items");
    }

    const data = await res.json();
    return data.data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: getCartItem,
    queryKey: ["getcart", userId], // userId as part of queryKey for cache
    enabled: !!userId, // only run if userId is defined
  });

  return { cartItems: data, isLoading, isError, refetch };
};

export const useAddToCart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCart = async ({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) => {
    const res = await fetch("/api/cart/addtocart", {
      method: "POST",
      body: JSON.stringify({ userId, productId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add to cart");
    }

    return res.json();
  };

  const { mutate: addCartItem, isPending: isLoading ,error} = useMutation({
    mutationFn: addToCart,
    mutationKey: ["addToCart"],
    onSuccess: () => {
      toast({ title: "Success", description: "Item added to cart" });
      queryClient.invalidateQueries({ queryKey: ["getcart"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });

  return { addCartItem, isLoading ,error};
};

export const useRemoveFromCart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const removeFromCart = async ({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) => {
    const res = await fetch(
      `/api/cart/removeFromCart?userId=${userId}&productId=${productId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to remove from cart");
    }

    return res.json();
  };

  const { mutate: removeCartItem, isPending: isLoading } = useMutation({
    mutationFn: removeFromCart,
    mutationKey: ["removeFromCart"],
    onSuccess: () => {
      toast({ title: "Removed", description: "Item removed from cart" });
      queryClient.invalidateQueries({ queryKey: ["getcart"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });

  return { removeCartItem, isLoading };
};

export const useClearCart = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const clearCart = async (userId: string) => {
    const res = await fetch(`/api/cart/clear-cart?userId=${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to clear cart");
    }

    return res.json();
  };

  const { mutate: clearCartItems, isPending: isLoading } = useMutation({
    mutationFn: clearCart,
    mutationKey: ["clearCart"],
    onSuccess: () => {
      toast({ title: "Cart Cleared", description: "All items removed." });
      queryClient.invalidateQueries({ queryKey: ["getcart"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });

  return { clearCartItems, isLoading };
};

export const useUpdateCart= ()=> {
    const queryClient = useQueryClient();
  const updateCart = async(params:UpdateCartParams):Promise<Partial<CartItemResponsetype[0]>>=> {
    const updateCartItem= await fetch("/api/cart/update",{
      method:"POST",
      body:JSON.stringify({userId:params.userId,
        productId:params.productId,
        quantity:params.quantity
      })
    })
    const data = await updateCartItem.json()
    return data.data
  }
  const {mutate:updateCartItem,isPending:isLoading,error}= useMutation({
    mutationFn:updateCart,
    mutationKey:["updateCart"],
    onSuccess:()=> {
      queryClient.invalidateQueries({queryKey:["getcart"]})
    }
  })
  return {
    updateCartItem,
    isLoading,
    error
  }
}
