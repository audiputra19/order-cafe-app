import clsx from "clsx";
import moment from "moment";
import { useEffect, type FC } from "react";
import { MdMoneyOff, MdOutlineArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { apiOrder, useGetOrderQuery } from "../services/apiOrder";
import { socket } from "../socket";
import { useAppSelector } from "../store";
import { useDispatch } from "react-redux";

const Transaction: FC = () => {
    const meja = useAppSelector(state => state.auth.meja) ?? "";
    const { data: getTransaction = [], isLoading: isloadingTransaction } = useGetOrderQuery(meja, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on("order:update", () => {
            dispatch(apiOrder.util.invalidateTags(["Order"]));
        })
    }, [dispatch]);

    const handlePayAgain = (snapToken: string, orderId: string) => {
        if (!window.snap) {
            alert("Midtrans Snap belum siap, coba refresh halaman");
            return;
        }

        window.snap.pay(snapToken, {
            onSuccess: function (result: any) {
                console.log("Pembayaran sukses:", result);
                navigate(`/process/${orderId}`);
            },
            onPending: function (result: any) {
                console.log("Menunggu pembayaran:", result);
            },
            onError: function () {
                alert("Pembayaran gagal");
            },
            onClose: function () {
                console.log("Popup ditutup user");
            },
        });
    };

    return (
        <>
            <div className="min-h-screen bg-main">
                <div className="flex justify-between items-center p-3 cursor-pointer">
                    <div 
                        className="bg-card2 p-2 rounded-full"
                        onClick={() => navigate('/')}
                    >
                        <MdOutlineArrowBack size={25}/>
                    </div>
                    <div>
                        <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">Transaction</p>
                    </div>
                    <div className="text-main p-2 rounded-full bg-main">
                        <MdOutlineArrowBack size={25}/>
                    </div>
                </div>
                <div className="p-3">
                    <div className="flex flex-col gap-3">
                        
                        {/* Loading Screen */}
                        {isloadingTransaction ? (
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div 
                                        className="w-full bg-card2 rounded-xl p-3 animate-pulse"
                                        key={i}
                                    >
                                        <div className="flex justify-between gap-3">
                                            <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main flex-1"></p>
                                            <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main w-16"></p>
                                        </div>
                                    </div>
                                ))}
                            </div> 
                        ) : getTransaction.length > 0 ? (
                            getTransaction?.map(item => {
                                return (
                                    <div
                                        key={item.order_id}
                                        className="p-3 border border-card bg-card2 rounded-xl"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-semibold">{item.order_id}</p>
                                                <p className="text-xs text-gray-400 mt-1">{moment(item.created_at).locale("id").format("DD MMM YYYY HH:mm")}</p>
                                            </div>
                                            <div>
                                                {item.status === 'unpaid' && item.metode !== 'cash' ? (
                                                    <button 
                                                        className={clsx("py-2 px-3 text-xs rounded-xl bg-yellow-500 text-white font-semibold cursor-pointer")}
                                                        onClick={() => handlePayAgain(item.snap_token, item.order_id)}
                                                    >
                                                        Bayar
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className={clsx("py-2 px-3 text-xs rounded-xl bg-primary text-white font-semibold cursor-pointer")}
                                                        onClick={() => navigate(`/process/${item.order_id}`)}
                                                    >
                                                        Cek
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex flex-col justify-center items-center text-gray-400 mt-10">
                                <MdMoneyOff size={96}/>
                                <p className="text-lg font-bold">Transaction is Empty</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Transaction;