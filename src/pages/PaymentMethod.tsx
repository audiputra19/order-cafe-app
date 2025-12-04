import { useState, type FC } from "react";
import { FaCoins, FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlineArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { setPaymentMethod } from "../store/CartSlice";

const PaymentMethod:FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const selector = useAppSelector(item => item.cart);
    const paymentMethod = selector.paymentMethod;
    const [method, setMethod] = useState<number | null>(paymentMethod ?? null);

    const handleSubmit = () => {
        if(!method) {
            alert("Please select a payment method");
            return;
        }
        dispatch(setPaymentMethod(method));
        navigate("/confirm");
    }

    return (
        <>
            <div className="sm:flex sm:justify-center">
                <div className="sm:w-[400px] min-h-screen bg-main">
                    <div className="flex justify-between items-center p-3 cursor-pointer">
                        <div 
                            className="bg-card2 p-2 rounded-full"
                            onClick={() => navigate("/confirm")}
                        >
                            <MdOutlineArrowBack size={25}/>
                        </div>
                        <div>
                            <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">Metode Pembayaran</p>
                        </div>
                        <div className="text-main p-2 rounded-full bg-main">
                            <MdOutlineArrowBack size={25}/>
                        </div>
                    </div>
                    <div className="p-3">
                        <div className="border border-card bg-card2 rounded-xl">
                            <div className="flex flex-col">
                                <div
                                    className="p-4 flex justify-between items-center cursor-pointer"
                                    onClick={() => setMethod(1)}
                                >
                                    <div className="flex gap-3 items-center">
                                        <FaCoins size={22} className="text-red-500"/>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-semibold">Cash</p>
                                            <p className="text-sm text-gray-400">Bayar tunai ke kasir</p>
                                        </div>
                                    </div>
                                    <div>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            checked={method === 1}
                                            value={1} 
                                            onChange={() => setMethod(1)}
                                        />
                                    </div>
                                </div>
                                <div className="border-b border-card mx-3"></div>
                                <div
                                    className="p-4 flex justify-between items-center cursor-pointer"
                                    onClick={() => setMethod(2)}
                                >
                                    <div className="flex items-center gap-3">
                                        <FaMoneyBillTransfer size={34} className="text-red-500"/>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-semibold">Transfer</p>
                                            <p className="text-sm text-gray-400">Bayar dengan m-banking, qris atau pembayaran digital lainnya</p>
                                        </div>
                                    </div>
                                    <div>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod"
                                            checked={method === 2} 
                                            value={2} 
                                            onChange={() => setMethod(2)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed bottom-0 w-full sm:w-[400px]">
                        <div className="bg-secondary border-t border-card p-3 rounded-t-xl shadow-lg">
                            <div className="flex flex-col gap-3 items-center">
                                <button
                                    className="bg-primary px-4 py-3 rounded-xl text-white font-semibold cursor-pointer w-full"
                                    onClick={handleSubmit}
                                >
                                    Pilih Metode Pembayaran
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentMethod;