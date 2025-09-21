import type { FC } from "react";
import { RiAlarmWarningFill } from "react-icons/ri";

export const WarningToScan: FC = () => {
    return (
        <>
            <div className="sm:flex sm:justify-center">
                <div className="sm:w-[400px] min-h-screen flex flex-col gap-2 justify-center items-center bg-main">
                    <div className="">
                        <RiAlarmWarningFill size={64} className="text-red-600"/>
                    </div>
                    <div className="text-md w-3/4 text-center">You have reached the time limit please rescan the QR code.</div>
                </div>
            </div>
        </>
    )
}