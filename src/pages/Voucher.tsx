import type { FC } from "react";
import { useGetVoucherQuery } from "../services/apiVoucher";
import moment from "moment";
import { MdOutlineArrowBack } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { setVoucher, setVoucherId } from "../store/CartSlice";
import clsx from "clsx";
import { RiDiscountPercentLine } from "react-icons/ri";

const Voucher: FC = () => {
    const {data: getVoucher = []} = useGetVoucherQuery(undefined, {
        refetchOnMountOrArgChange: true
    })
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const voucherRedux = useAppSelector(state => state.cart.voucher);
    const location = useLocation();
    const subTotal = location.state.subTotal ?? 0;
    const voucherAuto = location.state.voucherAuto;
    const today = moment().startOf("day");

    const handleSelectVoucher = (persen: number, voucher_id: string, isActive: boolean) => {
        if (!isActive) return;
        dispatch(setVoucher(persen));
        dispatch(setVoucherId(voucher_id));
        navigate("/confirm");
    };

    const activeVouchers = getVoucher
    .filter(voucher => moment(voucher.due_date).isSameOrAfter(moment(), "day"))
    .sort((a, b) => {
        const isASelected = 
            a.persen === voucherRedux || 
            (!voucherRedux && voucherAuto && a.persen === voucherAuto.persen);
        const isBSelected = 
            b.persen === voucherRedux || 
            (!voucherRedux && voucherAuto && b.persen === voucherAuto.persen);

        if (isASelected && !isBSelected) return -1;
        if (!isASelected && isBSelected) return 1;

        return b.persen - a.persen;
    });


    const voucherList = activeVouchers.map(item => {
        const isExpired = moment(item.due_date).isBefore(today, "day");
        const isEligible = subTotal >= item.min_belanja;
        const isActive = !isExpired && isEligible;

        const isAutoSelected =
            !voucherRedux &&
            voucherAuto &&
            item.persen === voucherAuto.persen &&
            subTotal >= voucherAuto.min_belanja;

        const isSelected = voucherRedux === item.persen || isAutoSelected;

        return (
            <div 
                key={item.id_voucher}
                className="flex flex-col justify-center items-center"
            >
                 <div
                    onClick={() => handleSelectVoucher(item.persen, item.id_voucher, isActive)}
                    className={clsx(
                        "relative inline-block w-full cursor-pointer",
                        !isActive && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <div className={clsx("flex py-4 px-7 rounded-lg relative overflow-hidden",
                        isSelected ? "bg-primary" : "border border-card bg-white"
                    )}>
                        <div className={clsx("border-r border-dashed pr-5 font-bold",
                            isSelected ? "border-white" : "border-gray-400"
                        )}>
                            <div className={clsx("flex flex-col justify-center items-center min-w-[60px]",
                                isSelected ? "text-white" : "text-red-500"
                            )}>
                                <div>
                                    <p>Diskon</p>
                                </div>
                                <div>
                                    <span className="text-4xl">{item.persen}</span>
                                    <span className="text-lg">%</span>
                                </div>
                            </div>
                        </div>
                        <div className="pl-5 flex flex-col gap-1">
                            <span className={clsx("text-lg font-semibold",
                                isSelected ? "text-white" : "text-slate-800"
                            )}>   
                                {item.nama}
                            </span>
                            <span className={clsx("text-sm",
                                isSelected ? "text-white" : "text-slate-800"
                            )}>
                                Min. Belanja Rp. {item.min_belanja.toLocaleString("id-ID")}
                            </span>
                            <span className={clsx("text-xs",
                                isSelected ? "text-white" : "text-gray-400"
                            )}>
                                Berlaku s.d. {moment(item.due_date).format("YYYY-MM-DD")}
                            </span>
                        </div>

                        <div className={clsx("absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-main rounded-full -translate-x-1/2",
                            isSelected ? "" : "border border-card"
                        )}></div>
                        <div className={clsx("absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-main rounded-full translate-x-1/2",
                            isSelected ? "" : "border border-card"
                        )}></div>
                    </div>
                </div>
            </div> 
        )
    })

    return (
        <>
            <div className="sm:flex sm:justify-center">
                <div className="sm:w-[400px] bg-main min-h-screen">
                    {/* Header */}
                    <div className="flex justify-between items-center p-3 cursor-pointer">
                        <div
                            className="bg-card2 p-2 rounded-full"
                            onClick={() => navigate("/confirm")}
                        >
                            <MdOutlineArrowBack size={25} />
                        </div>
                        <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">
                            Voucher
                        </p>
                        <div className="text-main p-2 rounded-full bg-main">
                            <MdOutlineArrowBack size={25} />
                        </div>
                    </div>
                    <div className="bg-main flex flex-col gap-3 p-3">
                        {activeVouchers.length > 0 
                        ? voucherList 
                        : <div className="flex flex-col justify-center items-center text-gray-400 mt-10">
                            <RiDiscountPercentLine size={96}/>
                            <p className="text-lg font-bold">Tidak Ada Voucher</p>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Voucher;