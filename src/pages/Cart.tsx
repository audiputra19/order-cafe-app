import clsx from "clsx";
import { useState, type FC } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { MdOutlineArrowBack } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { Categories } from "../config/db";
import { useCreatePaymentMutation } from "../services/apiPayment";
import { useAppDispatch, useAppSelector } from "../store";
import { decreaseQty, increaseQty, removeAllCart, removeFromCart } from "../store/CartSlice";
import { ModalMetode } from "../components/ModalMetode";
import { Loading } from "../components/Loading";

const Cart: FC = () => {
    const navigate = useNavigate();
    const cart = useAppSelector(state => state.cart.items);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const fromPage = location.state?.from;
    const [createPayment, { isLoading: isLoadingCreatePay }] = useCreatePaymentMutation();
    const meja = useAppSelector(state => state.auth.meja ?? "");
    const [showModal, setShowModal] = useState<boolean>(false);

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
                <div className="flex gap-3 items-center">
                    {/* <input type="checkbox" /> */}
                    <div>
                        <img 
                            src={`http://localhost:3001${item.image_path}`}
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
                        <div className="mt-5 flex justify-between items-center">
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

    const handleCash = async () => {
        const confirm = window.confirm("Apakah kamu yakin menggunakan metode pembayaran cash?");
        if (!confirm) return;

        const res = await createPayment({
            meja, 
            items: cart, 
            total: totalAll,
            metode: "cash"
        }).unwrap();

        dispatch(removeAllCart());
        setShowModal(false);
        navigate(`/process/${res.orderId}`);
    }

    const handleTransfer = async () => {
        try {
            const confirm = window.confirm("Apakah kamu yakin menggunakan metode pembayaran transfer?");
            if (!confirm) return;

            if (!window.snap) {
                alert("Midtrans Snap belum siap, coba refresh halaman");
                return;
            }

            const res = await createPayment({
                meja, 
                items: cart, 
                total: totalAll,
                metode: "transfer"
            }).unwrap();

            dispatch(removeAllCart());
            setShowModal(false);

            window.snap.pay(res.snapToken, {
                onSuccess: function (result: any) {
                    // console.log("Pembayaran sukses:", result);
                    navigate(`/process/${res.orderId}`);
                },
                onPending: function (result: any) {
                    console.log("Menunggu pembayaran:", result);
                },
                onError: function () {
                    alert("Pembayaran gagal");
                },
                // onClose: function () {
                //     alert("Popup ditutup tanpa menyelesaikan pembayaran");
                // },
            });
        } catch (error) {
            console.error("Checkout gagal:", error)
        }
    }

    return (
        <div className="sm:flex sm:justify-center">
            {isLoadingCreatePay && <Loading />}
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
                        <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">Cart</p>
                    </div>
                    <div className="text-main p-2 rounded-full bg-main">
                        <MdOutlineArrowBack size={25}/>
                    </div>
                </div>
                {cartItems.length > 0 ? (
                    <>
                        <div className={clsx("flex flex-col gap-3 p-3",
                            fromPage === 'tab-cart' ? 'pb-[90px]' : 'pb-[92px]'
                        )}>
                            {cartItems}
                        </div>
                        <div className={clsx("fixed bottom-0 px-3 w-full sm:w-[400px]",
                            fromPage === 'tab-cart' ? 'pb-[68px]' : 'pb-3'
                        )}>
                            <div className="bg-primary p-3 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold text-white">Total Price</p>
                                        <p className="text-xl font-bold text-sm text-white">{totalAll.toLocaleString("id-ID")}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(true)}
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
                        <p className="text-lg font-bold">Cart is Empty</p>
                    </div>
                )}
                {showModal && 
                <ModalMetode 
                    onClose={setShowModal} 
                    handleCash={handleCash}
                    handleTransfer={handleTransfer} 
                />}
            </div>
        </div>
    )
}

export default Cart;