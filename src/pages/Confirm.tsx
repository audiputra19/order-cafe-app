import { useEffect, useLayoutEffect, useMemo, type FC } from "react";
import { MdKeyboardArrowRight, MdOutlineArrowBack, MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetCompanyProfileQuery } from "../services/apiProfile";
import { useAppDispatch, useAppSelector } from "../store";
import { LuTicketPercent } from "react-icons/lu";
import { useCreatePaymentMutation } from "../services/apiPayment";
import { removeAllCart, setVoucher } from "../store/CartSlice";
import { Loading } from "../components/Loading";
import { useGetVoucherQuery } from "../services/apiVoucher";

const Confirm:FC = () => {
    const navigate = useNavigate();
    const selector = useAppSelector(item => item.cart);
    const cart = selector.items;
    const paymentMethod = selector.paymentMethod;
    const meja = useAppSelector(state => state.auth.meja ?? "");
    const [createPayment, { isLoading: isLoadingCreatePay }] = useCreatePaymentMutation();
    const dispatch = useAppDispatch();
    const {data: getCompanyProfile} = useGetCompanyProfileQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })
    const { data: getVoucher = [] } = useGetVoucherQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const voucherRedux = useAppSelector(state => state.cart.voucher);
    const voucherIdRedux = useAppSelector(state => state.cart.voucherId);

    const subTotal = useMemo(() => {
        return selector.items.reduce((sum, item) => sum + item.harga * item.quantity, 0);
    }, [selector.items]);

    const qty = useMemo(() => {
        return selector.items.reduce((sum, item) => sum + item.quantity, 0);
    }, [selector.items]);

    const voucherAuto = useMemo(() => {
        if (!getVoucher.length) return null;

        const eligibleVouchers = getVoucher.filter(
            (item) => subTotal >= Number(item.min_belanja ?? 0)
        );

        if (eligibleVouchers.length > 0) {
            return eligibleVouchers.reduce((max, item) =>
            item.persen > max.persen ? item : max
            );
        }

        return null;
    }, [getVoucher, subTotal]);

    const safeVoucherRedux = voucherRedux ?? 0;
    const voucherFinal: number =
    safeVoucherRedux ||
    (subTotal >= Number(voucherAuto?.min_belanja ?? 0) ? voucherAuto?.persen ?? 0 : 0);

    const voucherIdFinal: string | null =
    voucherRedux !== undefined && voucherRedux > 0
    ? String(voucherIdRedux)
    : subTotal >= Number(voucherAuto?.min_belanja ?? 0)
    ? String(voucherAuto?.id_voucher ?? "")
    : null;

    // console.log("voucher id: ", voucherIdFinal);

    const diskon = (subTotal * voucherFinal) / 100;
    const totalBayar = subTotal - diskon;

    const voucherManual = useAppSelector(state => state.cart.voucherManual);

    useEffect(() => {
        // Jangan jalankan auto logic kalau user pilih manual
        if (voucherManual) return;

        if (!voucherAuto) {
            dispatch(setVoucher(0));
            return;
        }

        if (subTotal >= voucherAuto.min_belanja) {
            if (safeVoucherRedux !== voucherAuto.persen) {
                dispatch(setVoucher(voucherAuto.persen));
            }
        } else {
            if (safeVoucherRedux > 0) {
                dispatch(setVoucher(0));
            }
        }
    }, [subTotal, voucherAuto, safeVoucherRedux, dispatch, voucherManual]);

    useLayoutEffect(() => {
        const SCROLL_KEY = "confirmScrollY";

        const restoreScroll = () => {
            const saved = sessionStorage.getItem(SCROLL_KEY);
            if (saved) {
                const scrollY = parseInt(saved, 10);
                // Tunggu 1 frame setelah render DOM selesai
                requestAnimationFrame(() => {
                    window.scrollTo({ top: scrollY, behavior: "instant" });
                });
            }
        };

        // Restore setelah mount
        restoreScroll();

        // Simpan posisi scroll tiap kali user scroll
        const handleScroll = () => {
            sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const OrderList = cart.map(item => {
        const harga = item.harga * item.quantity;

        return (
            <div
                key={item.id}
                className=""
            >
                <div className="border-l-4 border-l-green-300 border border-card bg-secondary p-3 rounded">
                    <div className="flex justify-between items-center">
                        <p className="flex-1 max-w-[280px]">{item.nama}</p>
                        <p className="text-sm text-red-500 font-semibold">x {item.quantity}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                        {item.drinkType && (
                            <p>{item.drinkType}</p>
                        )}
                        {item.note && (
                            <p>Catatan: {item.note}</p>
                        )}
                    </div>
                    <div className="border-b border-card my-2"></div>
                    <div className="flex justify-between text-sm">
                        <p className="font-semibold">Harga</p>
                        <p className="font-semibold">{harga.toLocaleString("id-ID")}</p>
                    </div>
                </div>
            </div>
        )
    });

    const handleConfirm = async () => {
        if(!paymentMethod) {
            alert("Pilih metode pembayaran terlebih dahulu");
            return;
        }

        if(paymentMethod === 1) {
            const confirm = window.confirm("Apakah kamu yakin menggunakan metode pembayaran cash?");
            if (!confirm) return;
    
            const res = await createPayment({
                meja, 
                items: cart,
                subTotal: subTotal,
                voucher_id: voucherIdFinal, 
                metode: "cash"
            }).unwrap();
    
            dispatch(removeAllCart());
            sessionStorage.removeItem("confirmScrollY");
            navigate(`/process/${res.orderId}`);
        } else {
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
                    subTotal: subTotal,
                    voucher_id: voucherIdFinal,
                    metode: "transfer"
                }).unwrap();
    
                dispatch(removeAllCart());
                sessionStorage.removeItem("confirmScrollY");
    
                window.snap.pay(res.snapToken, {
                    onSuccess: function (result: any) {
                        console.log("Pembayaran sukses:", result);
                        navigate(`/process/${res.orderId}`);
                    },
                    onPending: function (result: any) {
                        console.log("Menunggu pembayaran:", result);
                    },
                    onError: function () {
                        alert("Pembayaran gagal");
                    },
                    onClose: function () {
                        navigate('/transaction');
                    },
                });
            } catch (error) {
                console.error("Checkout gagal:", error)
            }
        }
    }

    return (
        <>
            <div className="sm:flex sm:justify-center">
                {isLoadingCreatePay && <Loading />}
                <div className="sm:w-[400px] min-h-screen bg-main">
                    <div className="flex justify-between items-center p-3 cursor-pointer">
                        <div 
                            className="bg-card2 p-2 rounded-full"
                            onClick={() => navigate("/cart", {state: {from: 'tab-cart'}})}
                        >
                            <MdOutlineArrowBack size={25}/>
                        </div>
                        <div>
                            <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">Konfirmasi</p>
                        </div>
                        <div className="text-main p-2 rounded-full bg-main">
                            <MdOutlineArrowBack size={25}/>
                        </div>
                    </div>
                    <div className="p-3 flex flex-col gap-3 pb-[121px]">
                        <div className="flex flex-col gap-2 p-5 border border-card bg-card2 rounded-xl">
                            <p className="font-bold text-lg">{getCompanyProfile?.name}</p>
                            <p className="text-sm">{getCompanyProfile?.address}</p>
                        </div>
                        <div className="flex flex-col gap-2 p-5 border border-card bg-card2 rounded-xl">
                            <p className="font-bold text-lg">Rincian Pesanan</p>
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
                                <div className="border-b border-card p-3 font-bold rounded-t-xl">
                                    Metode Pembayaran
                                </div>
                                <div 
                                    className="p-3 flex justify-between items-center cursor-pointer"
                                    onClick={async () => {
                                        sessionStorage.setItem("confirmScrollY", window.scrollY.toString());
                                        await Promise.resolve();
                                        navigate('/payment');
                                    }}
                                >
                                    <div className="flex gap-3 items-center">
                                        <MdPayment size={20} className="text-green-500"/>
                                        {paymentMethod === 1 ? (
                                            <p className="text-sm">Cash</p>
                                        ) : paymentMethod === 2 ? (
                                            <p className="text-sm">Transfer</p>
                                        ) : (
                                            <p className="text-sm">Pilih metode pembayaran</p>
                                        )}
                                    </div>
                                    <div>
                                        <MdKeyboardArrowRight size={22}/>
                                    </div>
                                </div>
                                <div className="border-b border-card mx-3"></div>
                                <div 
                                    className="p-3 flex justify-between items-center cursor-pointer"
                                    onClick={async () => {
                                        sessionStorage.setItem("confirmScrollY", window.scrollY.toString());
                                        await Promise.resolve();
                                        navigate('/voucher', {state: { subTotal, voucherAuto }});
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <LuTicketPercent size={20} className="text-green-500"/>
                                        {voucherFinal ? (
                                            <p className="text-xs border border-red-300 px-2 py-1 rounded bg-red-100 font-semibold text-red-600">
                                                Diskon {voucherFinal}%
                                            </p>
                                        ) : (
                                            <p className="text-sm">Pilih voucher diskon</p>
                                        )}
                                    </div>
                                    <div>
                                        <MdKeyboardArrowRight size={22}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border border-card bg-card2 rounded-xl">
                            <div className="flex flex-col">
                                <div className="border-b border-card p-3 font-bold rounded-t-xl">
                                    Informasi Pesanan
                                </div>
                                <div className="p-3 flex flex-col gap-2">
                                    <div 
                                        className="flex justify-between items-center"
                                    >
                                        <p className="text-sm">Total Harga ({qty.toLocaleString("id-ID")} Barang)</p>
                                        <p className="text-sm">{subTotal.toLocaleString("id-ID")}</p>
                                    </div>
                                    {voucherFinal > 0 && (
                                        <div 
                                            className="flex justify-between items-center"
                                        >
                                            <p className="text-sm">Diskon {voucherFinal}%</p>
                                            <p className="text-sm text-red-500">-{diskon.toLocaleString("id-ID")}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed bottom-0 w-full sm:w-[400px]">
                        <div className="bg-secondary border-t border-card p-3 rounded-t-xl shadow-lg">
                            <div className="flex flex-col gap-3 items-center">
                                <div className="flex justify-between w-full items-center">
                                    <p className="font-bold">Total Tagihan</p>
                                    <p className="font-bold">{totalBayar.toLocaleString("id-ID")}</p>
                                </div>
                                <button
                                    className="bg-primary px-4 py-3 rounded-xl text-white font-semibold cursor-pointer w-full"
                                    onClick={handleConfirm}
                                >
                                    Konfirmasi Pesanan
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