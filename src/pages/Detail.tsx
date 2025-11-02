import clsx from "clsx";
import { useState, type FC } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { MdOutlineArrowBack } from "react-icons/md";
import { RiShoppingBag4Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { useCartIcon } from "../contexts/CartIconContext";
import { useGetProductQuery } from "../services/apiProduct";
import { useAppDispatch, useAppSelector } from "../store";
import { addToCartWithQty } from "../store/CartSlice";
import { BASE_URL } from "../components/BASE_URL";

const Detail: FC = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {data: Products = [], isLoading: isLoadingProduct} = useGetProductQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });
    const selectedProduct = Products.find(p => p.id === id);
    const cart = useAppSelector(state => state.cart.items);
    const [qty, setQty] = useState<number>(1);
    const dispatch = useAppDispatch();
    const cartRef = useCartIcon();

    const handleAddToCart = (item: any) => {
        if (selectedProduct) {
            dispatch(addToCartWithQty({ product: item, quantity: qty }));
        }

        const img = document.querySelector(".detail-product-img") as HTMLImageElement | null;
        if (!img || !cartRef?.current) return;

        const imgRect = img.getBoundingClientRect();
        const cartRect = cartRef.current.getBoundingClientRect();

        const flyingImg = img.cloneNode(true) as HTMLImageElement;
        flyingImg.style.position = "fixed";
        flyingImg.style.left = imgRect.left + "px";
        flyingImg.style.top = imgRect.top + "px";
        flyingImg.style.width = imgRect.width + "px";
        flyingImg.style.height = imgRect.height + "px";
        flyingImg.style.transition = "all 0.8s ease-in-out";
        flyingImg.style.zIndex = "9999";
        document.body.appendChild(flyingImg);

        requestAnimationFrame(() => {
        flyingImg.style.left = cartRect.left + "px";
        flyingImg.style.top = cartRect.top + "px";
        flyingImg.style.width = "30px";
        flyingImg.style.height = "30px";
        flyingImg.style.opacity = "0.3";
        });

        flyingImg.addEventListener("transitionend", () => flyingImg.remove());
    };

    return (
        <>
            {isLoadingProduct ? (
                <div className="flex flex-col gap-3 bg-card2 min-h-screen animate-pulse">
                    <div>
                        <div className="w-full h-[350px] bg-main"></div>
                    </div>
                    <div 
                        className="w-full bg-card2 rounded-xl px-3"
                    >
                        <div className="flex justify-between gap-3">
                            <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main flex-1"></p>
                            <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main w-20"></p>
                        </div>
                        <div className="flex justify-between gap-3 mt-5">
                            <p className="font-semibold line-clamp-1 h-20 rounded-xl bg-main flex-1"></p>
                        </div>
                    </div>
                </div> 
            ) : (
                <div className="sm:flex sm:justify-center">
                    <div className="sm:w-[400px] bg-main min-h-screen">
                        <div className="relative">
                            <div className="absolute w-full flex justify-between items-center p-3">
                                <div 
                                    className="bg-white text-black p-2 rounded-full cursor-pointer"
                                    onClick={() => navigate(-1)}
                                >
                                    <MdOutlineArrowBack size={25}/>
                                </div>
                                <div>
                                    <p className="text-lg text-black font-bold px-5 py-1 bg-white rounded-full">Detail</p>
                                </div>
                                <div>
                                    <div className="relative" ref={cartRef}>
                                        {cart.length > 0 && (
                                            <div className="absolute right-1 top-1 z-10">
                                                <div 
                                                    className="flex justify-center items-center bg-red-500 w-[16px] h-[16px] rounded-full cursor-pointer"
                                                    onClick={() => navigate('/cart-detail', {state: {from: 'cart-detail'}})}
                                                >
                                                    <p className="text-[9px] font-semibold text-white">{cart.length}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div 
                                            className="bg-white text-black p-2 rounded-full cursor-pointer"
                                            onClick={() => navigate('/cart-detail', {state: {from: 'cart-detail'}})}    
                                        >
                                            <RiShoppingBag4Line size={25} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <img 
                                src={`${BASE_URL}${selectedProduct?.image_path}`}
                                alt={selectedProduct?.nama}
                                className="detail-product-img w-full h-[350px] object-cover bg-card"
                            />
                        </div>
                        <div className="flex justify-between p-3">
                            <p className="text-xl font-bold max-w-[250px]">{selectedProduct?.nama}</p>
                            <p className="text-xl font-bold text-primary"><span className="text-sm">Rp. </span>{selectedProduct?.harga.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="p-3 pb-[83px]">
                            <div className="p-4 bg-card2 border border-card rounded-xl">
                                <p className="text-base font-bold">Deskripsi</p>
                                <p className="text-sm mt-3 text-gray-400">{selectedProduct?.deskripsi}</p>
                            </div>
                        </div>
                        <div className={clsx("fixed bottom-0 p-3 w-full sm:w-[400px] bg-main")}>
                            <div className="flex justify-between gap-3">
                                <div className="flex items-center">
                                    <button
                                        className="p-3 border-y border-l flex justify-center w-[50px] rounded-l-full border-gray-200 bg-card2 cursor-pointer"
                                        onClick={() => {
                                            if(qty <= 1) {
                                                setQty(1);
                                                return;
                                            }
                                            setQty(qty - 1)
                                        }}
                                    >
                                        <FiMinus />
                                    </button>
                                    <p className="p-2 border-y border-gray-200 w-[40px] text-center bg-card2">{qty}</p>
                                    <button
                                        className="p-3 border-y border-r flex justify-center w-[50px] rounded-r-full border-gray-200 bg-card2 cursor-pointer"
                                        onClick={() => setQty(qty + 1)}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                                <button
                                    className="flex-1 bg-primary p-3 rounded-full text-white font-semibold cursor-pointer"
                                    onClick={() => handleAddToCart(selectedProduct)}
                                >
                                    Masukan Keranjang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Detail;