import clsx from "clsx";
import { useEffect, useState, type FC } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { FiMinus, FiPlus, FiPlusCircle } from "react-icons/fi";
import { MdOutlineArrowBack, MdOutlineStickyNote2 } from "react-icons/md";
import { RiCloseCircleLine, RiDeleteBin5Line } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../components/BASE_URL";
import { Categories } from "../config/db";
import { useAppDispatch, useAppSelector } from "../store";
import { addToCartWithTypeNote, decreaseQty, increaseQty, removeFromCart, setVoucher } from "../store/CartSlice";

const Cart: FC = () => {
    const navigate = useNavigate();
    const cart = useAppSelector(state => state.cart.items);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const fromPage = location.state?.from;
    const [drinkType, setDrinkType] = useState<{ [key: string]: string }>({});
    const [notes, setNotes] = useState<{ [key: string]: { text: string; show: boolean } }>({});
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        dispatch(setVoucher(0));
    }, [dispatch]);

    useEffect(() => {
        // Sync Redux ke local state form
        const initialDrinkType: { [key: string]: string } = {};
        const initialNotes: { [key: string]: { text: string; show: boolean } } = {};

        cart.forEach(item => {
            if (item.drinkType) initialDrinkType[item.id] = item.drinkType;
            if (item.note) initialNotes[item.id] = { text: item.note, show: true };
        });

        setDrinkType(initialDrinkType);
        setNotes(initialNotes);
        setTimeout(() => setIsFirstLoad(false), 100);
    }, [cart]);

    let totalAll = 0;
    const cartItems = cart.map(item => {
        const category = Categories.find(c => c.id === item.kategori);
        const totalQty = item.harga * item.quantity;
        totalAll += totalQty;

        return (
            <div 
                key={item.id}
                className="p-3 border border-card bg-card2 rounded-xl"
            >
                <div className="flex gap-3">
                    {/* <input type="checkbox" /> */}
                    <div>
                        <img 
                            src={`${BASE_URL}${item.image_path}`}
                            className="w-25 h-25 object-cover rounded-xl border border-card p-1 border-card"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold line-clamp-1">{item.nama}</p>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">{category?.name}</p>
                            <RiDeleteBin5Line 
                                size={20} 
                                className="text-gray-400 cursor-pointer"
                                onClick={() => dispatch(removeFromCart(item.id))}
                            />
                        </div>
                        {(item.kategori === 2 || item.kategori === 4) && (
                            <div className="mt-3 flex gap-2">
                                {["Hot", "Ice"].map(type => (
                                    <label key={type} className="flex gap-1 items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`drinkType-${item.id}`} // biar per-item
                                            checked={drinkType[item.id] === type}
                                            onChange={() => {
                                                setDrinkType(prev => ({ ...prev, [item.id]: type }));
                                                dispatch(addToCartWithTypeNote({
                                                    productId: item.id,
                                                    drinkType: type,
                                                    note: notes[item.id]?.text || ""
                                                }));
                                            }}
                                            className="radio radio-xs"
                                        />
                                        <span className="text-sm">{type}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        <div
                            className={clsx(
                                "relative mt-3 overflow-hidden transition-all duration-300 ease-in-out min-h-[30px]"
                            )}
                        >
                            <button
                                className={clsx(
                                    "flex gap-1 items-center absolute left-0 text-sm text-blue-500 transition-all duration-300 hover:cursor-pointer hover:text-blue-600",
                                    notes[item.id]?.show
                                        ? "opacity-0 pointer-events-none"
                                        : "opacity-100"
                                )}
                                onClick={() =>
                                    setNotes(prev => ({
                                        ...prev,
                                        [item.id]: { text: "", show: true }
                                    }))
                                }
                            >
                                <FiPlusCircle size={17}/>
                                Tambah Catatan
                            </button>

                            <div
                                className={clsx(
                                    "absolute left-0 w-full transform",
                                    !isFirstLoad && "transition-all duration-300 ease-in-out",
                                    notes[item.id]?.show ? "translate-x-0" : "translate-x-full"
                                )}
                            >
                                <div className="flex relative">
                                    <div className="absolute top-[6px] left-[6px]">
                                        <MdOutlineStickyNote2 size={18} className="text-gray-500" />
                                    </div>
                                    {notes[item.id]?.text && (
                                        <div className="absolute top-[6px] right-[6px]">
                                            <RiCloseCircleLine
                                            size={18}
                                            className="text-gray-500 cursor-pointer"
                                                onClick={() => {
                                                    setNotes(prev => ({
                                                        ...prev,
                                                        [item.id]: { text: "", show: true }
                                                    }));
                                                    dispatch(addToCartWithTypeNote({
                                                        productId: item.id,
                                                        drinkType: drinkType[item.id] || "",
                                                        note: ""
                                                    }));
                                                }}
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        className={clsx(
                                            "w-full focus:outline-none focus:outline-2 py-1 px-8 text-sm placeholder-gray-400 border border-card bg-secondary rounded",
                                            notes[item.id]?.text ? "" : "pl-8 pr-2"
                                        )}
                                        placeholder="Contoh: Agak pedas"
                                        value={notes[item.id]?.text || ""}
                                        onChange={(e) => {
                                            const noteText = e.target.value;
                                            setNotes(prev => ({
                                                ...prev,
                                                [item.id]: { text: e.target.value, show: true }
                                            }));
                                            dispatch(addToCartWithTypeNote({
                                                productId: item.id,
                                                drinkType: drinkType[item.id] || "",
                                                note: noteText
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <p className="font-semibold text-primary">{totalQty.toLocaleString("id-ID")}</p>
                            <div className="flex items-center">
                                <button
                                    className="p-2 border-y border-l rounded-l-xl border-gray-200 cursor-pointer"
                                    onClick={() => dispatch(decreaseQty(item.id))}
                                >
                                    <FiMinus size={12}/>
                                </button>
                                <p className="py-1 border-y border-gray-200 w-[30px] text-sm text-center">{item.quantity}</p>
                                <button
                                    className="p-2 border-y border-r rounded-r-xl border-gray-200 cursor-pointer"
                                    onClick={() => dispatch(increaseQty(item.id))}
                                >
                                    <FiPlus size={12}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    const handleCheckout = () => {
        for (const item of cart) {
            if ((item.kategori === 2 || item.kategori === 4) && !drinkType[item.id]) {
                alert(`Tolong pilih Hot/Ice untuk ${item.nama}`);
                return;
            }
        }

        navigate('/confirm');
    }

    return (
        <div className="sm:flex sm:justify-center">
            <div className="sm:w-[400px] bg-main min-h-screen">
                <div className="flex justify-between items-center p-3 cursor-pointer">
                    <div 
                        className="bg-card2 p-2 rounded-full"
                        onClick={() => {
                            fromPage === 'tab-cart' 
                            ? navigate('/')
                            : navigate(-1) 
                        }}
                    >
                        <MdOutlineArrowBack size={25}/>
                    </div>
                    <div>
                        <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">Keranjang</p>
                    </div>
                    <div className="text-main p-2 rounded-full bg-main">
                        <MdOutlineArrowBack size={25}/>
                    </div>
                </div>
                {cartItems.length > 0 ? (
                    <>
                        <div className={clsx("flex flex-col gap-3 p-3",
                            fromPage === 'tab-cart' ? 'pb-[94px]' : 'pb-[96px]'
                        )}>
                            {cartItems}
                        </div>
                        <div className={clsx("fixed bottom-0 px-3 w-full sm:w-[400px]",
                            fromPage === 'tab-cart' ? 'pb-[68px]' : 'pb-3'
                        )}>
                            <div className="bg-primary p-3 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-white">Total Harga</p>
                                        <p className="text-xl font-bold text-sm text-white">{totalAll.toLocaleString("id-ID")}</p>
                                    </div>
                                    <button
                                        // onClick={() => setShowModal(true)}
                                        onClick={handleCheckout}
                                        className="bg-white px-4 py-2 rounded-xl text-sm text-black font-semibold cursor-pointer"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center text-gray-400 mt-10">
                        <FaShoppingBasket size={96}/>
                        <p className="text-lg font-bold">Keranjang Kosong</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart;