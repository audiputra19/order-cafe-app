import clsx from "clsx";
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";
import { FiFilter } from "react-icons/fi";
import { Categories } from "../config/db";
import { LuSearch, LuSettings2 } from "react-icons/lu";
import { RiCloseCircleLine } from "react-icons/ri";

interface Props {
    setOpen: Dispatch<SetStateAction<boolean>>;
    selectCategory: number;
    setSelectCategory: Dispatch<SetStateAction<number>>;
    searchText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
}

const CategoryFilter: FC<Props> = ({ setOpen, selectCategory, setSelectCategory, searchText, setSearchText }) => {
    const [isSticky, setIsSticky] = useState<boolean>(false);
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsSticky(scrollY > 65);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const categoryList = Categories.map(item => {
        return (
            <div 
                key={item.id}
                className={clsx("flex items-center gap-1 bg-card2 text-sm border border-card rounded-full px-4 py-1 cursor-pointer",
                    selectCategory === item.id && "bg-primary text-white border-primary font-semibold"
                )}
                onClick={() => setSelectCategory(item.id)}
            >
                {item.icon}
                <p>{item.name}</p>
            </div>
        )
    });

    return (
        <div className={clsx("sticky top-0 z-10 transition-colors duration-300",
            isSticky ? "shadow-lg" : ""
        )}>
            <div className="flex gap-2 items-center px-3 pt-3 bg-main relative">
                <div className="flex-1">
                    <div className="absolute top-[21px] left-[21px]">
                        <LuSearch 
                            size={19}
                            className="text-gray-400"
                        />
                    </div>
                    {searchText && (
                        <div className="absolute top-[21px] right-[66px]">
                            <RiCloseCircleLine 
                                size={19}
                                className="text-gray-400"
                                onClick={() => setSearchText('')}
                            />
                        </div>
                    )}
                    <div>
                        <input
                            type="text"
                            className="w-full focus:outline-none focus:outline-2 py-2 px-9 text-sm placeholder-gray-400 border border-card bg-card2 rounded-2xl"
                            placeholder="Search Food"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>
                <div 
                    className="border border-card bg-card2 flex justify-center items-center p-2 rounded-xl"
                    onClick={() => setOpen(true)}
                >
                    <LuSettings2 size={20}/>
                </div>
            </div>
            <div className={clsx("flex gap-2 overflow-x-auto hide-scrollbar p-3 bg-main"
            )}>
                <div 
                    className={clsx("flex items-center gap-1 bg-card2 text-sm border border-card rounded-full px-4 py-1 cursor-pointer",
                        selectCategory === 0 && "bg-primary text-white border-primary font-semibold"
                    )}
                    onClick={() => setSelectCategory(0)}
                >
                    <p>All</p>
                </div>
                {categoryList}
            </div>
        </div>
    );
}

export default CategoryFilter;