import clsx from "clsx";
import type { FC } from "react";
import { RiHome9Line, RiShoppingBag4Line } from "react-icons/ri";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MainLayout: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split('/')[1];

    return (
        <div className="sm:flex sm:justify-center">
            <div className="sm:w-[400px] bg-secondary pb-[60px]">
                <Outlet />
            </div>
            <div className="sm:w-[400px] grid grid-cols-2 fixed bottom-0 w-full bg-secondary border-t border-line">
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
                    <div className="relative">
                        <div className="absolute right-1 top-1">
                            <div 
                                className="flex justify-center items-center bg-red-500 w-[20px] h-[20px] rounded-full cursor-pointer"
                                onClick={() => navigate('/cart')}
                            >
                                <p className="text-[10px] font-semibold text-white">2</p>
                            </div>
                        </div>
                        <div 
                            className={clsx("py-2 px-4 rounded-xl cursor-pointer transition-colors duration-200",
                                path === 'cart' && "text-white bg-primary"
                            )}
                            onClick={() => navigate('/cart')}    
                        >
                            <RiShoppingBag4Line size={25} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout;