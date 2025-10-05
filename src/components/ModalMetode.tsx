import type { Dispatch, FC, SetStateAction } from "react";
import { MdClose } from "react-icons/md";

interface Props {
    onClose: Dispatch<SetStateAction<boolean>>,
    handleCash: () => void;
    handleTransfer: () => void;
}

export const ModalMetode: FC<Props> = ({ onClose, handleCash, handleTransfer }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40"></div>
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className="bg-main rounded-xl shadow-lg w-80">
                    <div className="p-3 flex justify-end border-b border-card">
                        <button
                            className="border border-card p-1 rounded-full cursor-pointer"
                            onClick={() => onClose(false)}
                        >
                            <MdClose size={20}/>
                        </button>
                    </div>
                    <div className="p-5">
                        <p>Silakan pilih metode pembayaran Anda</p>
                    </div>
                    <div className="p-3 flex gap-3 border-t border-card">
                        <button 
                            className="border border-card py-1 px-3 rounded-xl w-full cursor-pointer 
                                hover:bg-primary hover:text-white hover:border-primary"
                            onClick={handleCash}    
                        >
                            Cash
                        </button>
                        <button 
                            className="border border-card py-1 px-3 rounded-xl w-full cursor-pointer 
                                hover:bg-primary hover:text-white hover:border-primary"
                            onClick={handleTransfer}    
                        >
                            Transfer
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}