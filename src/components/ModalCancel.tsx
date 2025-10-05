import type { Dispatch, FC, SetStateAction } from "react";
import { MdClose } from "react-icons/md";

interface Props {
    onClose: Dispatch<SetStateAction<boolean>>,
}

export const ModalCancel: FC<Props> = ({ onClose }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40"></div>
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className="bg-main rounded-xl shadow-lg w-80">
                    <div className="p-5 text-center">
                        <p>Pesanan dibatalkan silahkan melakukan pemesanan ulang</p>
                    </div>
                    <div className="p-3 flex gap-3 border-t border-card">
                        <button 
                            className="border border-card py-1 px-3 rounded-xl w-full cursor-pointer 
                                hover:bg-primary hover:text-white hover:border-primary"
                            onClick={() => onClose(true)}    
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}