import clsx from "clsx";
import { useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";
import { FiFilter } from "react-icons/fi";
import { Categories } from "../config/db";

interface Props {
    setOpen: Dispatch<SetStateAction<boolean>>;
    selectCategory: number;
    setSelectCategory: Dispatch<SetStateAction<number>>;
}

const CategoryFilter: FC<Props> = ({ setOpen, selectCategory, setSelectCategory }) => {
    const [isSticky, setIsSticky] = useState<boolean>(false);
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsSticky(scrollY > 312);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const categoryList = Categories.map(item => {
        return (
            <div 
                key={item.id}
                className={clsx("flex items-center gap-2 bg-card2 text-sm text-primary rounded-full px-4 py-1 shadow cursor-pointer",
                    selectCategory === item.id && "bg-primary text-white"
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
            <div className={clsx("flex gap-2 overflow-x-auto hide-scrollbar p-3 bg-main"
            )}>
                <div 
                    className={clsx("flex items-center gap-2 bg-card2 text-sm text-primary rounded-full px-4 py-1 shadow cursor-pointer",
                        selectCategory === 0 && "bg-primary text-white"
                    )}
                    onClick={() => setSelectCategory(0)}
                >
                    <p>All</p>
                </div>
                {categoryList}
            </div>
            <div className={clsx("flex gap-3 overflow-x-auto hide-scrollbar px-3 pb-3 bg-main"
            )}>
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center w-fit gap-2 bg-card2 text-sm text-primary rounded-full px-4 py-1 shadow cursor-pointer"
                >
                    <FiFilter size={18} />
                    <p>Filter</p>
                </button>
            </div>
        </div>
    );
}

export default CategoryFilter;