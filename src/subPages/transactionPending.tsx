import { useNavigate } from "react-router-dom";
import { useGetOrderQuery } from "../services/apiOrder";
import moment from 'moment';
import clsx from "clsx";
import { FaShoppingBasket } from "react-icons/fa";

export const TransactionPending = () => {
    const { data: getTransaction = [] } = useGetOrderQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col gap-3">
                {getTransaction.length > 0 ? (
                    getTransaction?.map(item => {
                        return (
                            <div
                                key={item.order_id}
                                onClick={() => navigate(`/process/${item.order_id}`)}
                                className="p-3 border border-card bg-card2 rounded-xl cursor-pointer hover:bg-card"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-semibold">{item.order_id}</p>
                                        <p className="text-xs text-gray-400 mt-1">{moment(item.created_at).locale("id").format("D MMM YYYY HH:mm:ss")}</p>
                                    </div>
                                    <div>
                                        <div className={clsx("border py-1 px-3 text-xs rounded-xl",
                                            item.status === "paid" 
                                            ? "border-green-500 bg-green-100 text-green-700" 
                                            : "border-yellow-500 bg-yellow-100 text-yellow-700"
                                        )}>
                                            {item.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col justify-center items-center text-gray-400 mt-10">
                        <FaShoppingBasket size={96}/>
                        <p className="text-lg font-bold">Unpaid Transaction is Empty</p>
                    </div>
                )}
            </div>
        </>
    )
}