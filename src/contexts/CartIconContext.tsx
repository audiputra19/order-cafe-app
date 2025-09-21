import { createContext, useContext, useRef } from "react";

type CartIconContextType = React.RefObject<HTMLDivElement | null> | null;

const CartIconContext = createContext<CartIconContextType>(null);

export const useCartIcon = () => useContext(CartIconContext);

export const CartIconProvider = ({ children }: { children: React.ReactNode }) => {
    const cartRef = useRef<HTMLDivElement | null>(null);
    return (
        <CartIconContext.Provider value={cartRef}>
            {children}
        </CartIconContext.Provider>
    );
};
