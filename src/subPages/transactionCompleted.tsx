import { useNavigate } from "react-router-dom";
import { useGetOrderCompletedQuery } from "../services/apiOrder";
import moment from 'moment';
import clsx from "clsx";

export const TransactionCompleted = () => {
    const { data: getTransaction = [] } = useGetOrderCompletedQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col gap-3">
                {getTransaction?.map(item => {
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
                                    <div className={clsx("border py-1 px-3 text-xs rounded-xl border-card2 bg-gray-500 text-white")}>
                                        Done
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}