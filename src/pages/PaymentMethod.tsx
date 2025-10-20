import type { FC } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PaymentMethod:FC = () => {
    const navigate = useNavigate();

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
                            <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">Payment Method</p>
                        </div>
                        <div className="text-main p-2 rounded-full bg-main">
                            <MdOutlineArrowBack size={25}/>
                        </div>
                    </div>
                    <div className="p-3">
                        <div className="flex flex-col gap-3">

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentMethod;