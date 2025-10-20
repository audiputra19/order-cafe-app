import type { FC } from "react";
import { MdKeyboardArrowRight, MdOutlineArrowBack, MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetCompanyProfileQuery } from "../services/apiProfile";
import { useAppSelector } from "../store";
import { LuTicketPercent } from "react-icons/lu";

const Confirm:FC = () => {
    const navigate = useNavigate();
    const cart = useAppSelector(item => item.cart.items)
    const {data: getCompanyProfile} = useGetCompanyProfileQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    let subTotal = 0;
    const OrderList = cart.map(item => {
        const harga = item.harga * item.quantity;
        subTotal += harga;

        return (
            <>
                <div
                    key={item.id}
                    className=""
                >
                    <div className="border border-card bg-secondary p-3 rounded">
                        <div className="flex justify-between items-center">
                            <p className="flex-1 max-w-[280px]">{item.nama}</p>
                            <p className="text-sm">x {item.quantity}</p>
                        </div>
                        {item.note && (
                            <div className="text-sm text-gray-400">
                                <p>{item.type}</p>
                                <p>Note: {item.note}</p>
                            </div>
                        )}
                        <div className="border-b border-card my-2"></div>
                        <div className="flex justify-between text-sm">
                            <p className="font-semibold">Harga</p>
                            <p className="font-semibold">{harga.toLocaleString("id-ID")}</p>
                        </div>
                    </div>
                </div>
            </>
        )
    });

    return (
        <>
            <div className="sm:flex sm:justify-center">
                <div className="sm:w-[400px] min-h-screen bg-main">
                    <div className="flex justify-between items-center p-3 cursor-pointer">
                        <div 
                            className="bg-card2 p-2 rounded-full"
                            onClick={() => navigate(-1)}
                        >
                            <MdOutlineArrowBack size={25}/>
                        </div>
                        <div>
                            <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">Confirm</p>
                        </div>
                        <div className="text-main p-2 rounded-full bg-main">
                            <MdOutlineArrowBack size={25}/>
                        </div>
                    </div>
                    <div className="p-3 flex flex-col gap-3 pb-[112px]">
                        <div className="flex flex-col gap-2 p-5 border border-card bg-card2 rounded-xl">
                            <p className="font-bold text-lg">{getCompanyProfile?.name}</p>
                            <p className="text-sm">{getCompanyProfile?.address}</p>
                        </div>
                        <div className="flex flex-col gap-2 p-5 border border-card bg-card2 rounded-xl">
                            <p className="font-bold text-lg">Order List</p>
                            <div className="flex flex-col gap-2">
                                {OrderList}
                                <div className="flex justify-between mt-2">
                                    <p className="font-semibold">Sub Total</p>
                                    <p className="font-semibold text-green-500">{subTotal.toLocaleString("id-ID")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border border-card bg-card2 rounded-xl">
                            <div className="flex flex-col">
                                <div className="bg-green-500 p-3 font-bold rounded-t-xl text-white">
                                    payment information
                                </div>
                                <div className="p-3 flex justify-between items-center">
                                    <div className="flex gap-3 items-center">
                                        <MdPayment size={20} className="text-green-500"/>
                                        <p className="text-sm">Tunai</p>
                                    </div>
                                    <div>
                                        <MdKeyboardArrowRight size={22}/>
                                    </div>
                                </div>
                                <div className="border-b border-card mx-3"></div>
                                <div className="p-3 flex justify-between items-center">
                                    <div className="flex gap-3">
                                        <LuTicketPercent size={20} className="text-green-500"/>
                                        <p className="text-sm">Select a discount voucher</p>
                                    </div>
                                    <div>
                                        <MdKeyboardArrowRight size={22}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed bottom-0 w-full sm:w-[400px]">
                        <div className="bg-secondary border-t border-card p-3 rounded-t-xl shadow-lg">
                            <div className="flex flex-col gap-3 items-center">
                                <div className="flex justify-between w-full items-center">
                                    <p className="font-bold">Total</p>
                                    <p className="font-bold">10.000</p>
                                </div>
                                <button
                                    className="bg-primary px-4 py-2 rounded-xl text-white font-semibold cursor-pointer w-full"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </>
    )
}

export default Confirm;