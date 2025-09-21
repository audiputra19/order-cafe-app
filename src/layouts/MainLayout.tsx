import clsx from "clsx";
import type { FC } from "react";
import { RiHome9Line, RiShoppingBag4Line } from "react-icons/ri";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store";
import { useCartIcon } from "../contexts/CartIconContext";
import { IoFileTrayFullOutline } from "react-icons/io5";

const MainLayout: FC = () => {
    const cartRef = useCartIcon();
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split('/')[1];
    const cart = useAppSelector(state => state.cart.items);
    //console.log("cart:", cart);

    return (
        <div className="sm:flex sm:justify-center">
            <div className="sm:w-[400px] bg-secondary pb-[58px]">
                <Outlet />
            </div>
            <div className="sm:w-[400px] grid grid-cols-3 fixed bottom-0 w-full bg-secondary border-t border-card">
                <div className="flex justify-center p-2">
                    <div 
                        className={clsx("py-2 px-4 rounded-xl cursor-pointer transition-colors duration-200",
                            path === '' && "text-white bg-primary"
                        )}
                        onClick={() => navigate('/')}
                    >
                        <RiHome9Line size={25} />
                    </div>
                </div>
                <div className="flex justify-center p-2">
                    <div className="relative" ref={cartRef}>
                        {cart.length > 0 && (
                            <div className="absolute right-3 top-1">
                                <div 
                                    className="flex justify-center items-center bg-red-500 w-[16px] h-[16px] rounded-full cursor-pointer"
                                    onClick={() => navigate('/cart', {state: {from: 'tab-cart'}})}
                                >
                                    <p className="text-[9px] font-semibold text-white">{cart.length}</p>
                                </div>
                            </div>
                        )}
                        <div 
                            className={clsx("py-2 px-4 rounded-xl cursor-pointer transition-colors duration-200",
                                path === 'cart' && "text-white bg-primary"
                            )}
                            onClick={() => navigate('/cart', {state: {from: 'tab-cart'}})}    
                        >
                            <RiShoppingBag4Line size={25} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center p-2">
                    <div 
                        className={clsx("py-2 px-4 rounded-xl cursor-pointer transition-colors duration-200",
                            path === 'transaction' && "text-white bg-primary"
                        )}
                        onClick={() => navigate('/transaction')}    
                    >
                        <IoFileTrayFullOutline size={25} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout;