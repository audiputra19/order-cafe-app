import type { FC } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { RiShoppingBag4Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { Products } from "../config/db";

const Detail: FC = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const selectedProduct = Products.find(p => p.id === Number(id));

    return (
        <div className="bg-main min-h-screen">
            <div className="relative">
                <div className="absolute w-full flex justify-between items-center p-3">
                    <div 
                        className="bg-white text-black p-2 rounded-full"
                        onClick={() => navigate(-1)}
                    >
                        <MdOutlineArrowBack size={25}/>
                    </div>
                    <div>
                        <p className="text-lg text-black font-bold px-5 py-1 bg-white rounded-full">Detail</p>
                    </div>
                    <div>
                        <div className="relative">
                            <div className="absolute right-1 top-1 z-10">
                                <div 
                                    className="flex justify-center items-center bg-red-500 w-[16px] h-[16px] rounded-full cursor-pointer"
                                    onClick={() => navigate('/cart')}
                                >
                                    <p className="text-[9px] font-semibold text-white">20</p>
                                </div>
                            </div>
                            <div 
                                className="bg-white text-black p-2 rounded-full"
                                onClick={() => navigate('/cart')}    
                            >
                                <RiShoppingBag4Line size={25} />
                            </div>
                        </div>
                    </div>
                </div>
                <img 
                    src={selectedProduct?.img}
                    alt={selectedProduct?.title}
                    className="w-full h-[350px] object-cover bg-card"
                />
            </div>
            <div className="p-3">
                <p className="text-xl font-bold">{selectedProduct?.title}</p>
            </div>
            <div className="p-3">
                <div className="p-4 bg-card2 border border-card rounded-xl">
                    <p className="text-base font-bold">Description</p>
                    <p className="text-sm mt-3 text-gray-400">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis repellat dolor mollitia et debitis placeat nam, blanditiis aut unde! Facilis ab iste tenetur ducimus maiores culpa asperiores quos labore excepturi!</p>
                </div>
            </div>
        </div>
    )
}

export default Detail;