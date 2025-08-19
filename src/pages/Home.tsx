import { useEffect, useState, type FC } from "react";
import { IoBagAddOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { PiCoffeeBeanFill } from "react-icons/pi";
import { RiArrowUpCircleLine, RiCloseCircleLine, RiCloseLine } from "react-icons/ri";
import CategoryFilter from "../components/CategoryFilter";
import DarkModeSwitch from "../components/DarkModeSwitch";
import { Categories, Products } from "../config/db";

const Home: FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectCategory, setSelectCategory] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>('');
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filteredProduct = selectCategory 
    ? Products.filter(p => p.category === selectCategory)
    : Products;

    const searchedProduct = searchText
    ? Products.filter(p =>
      p.title.toLowerCase().includes(searchText.toLowerCase())
    )
    : filteredProduct;

    const productList = searchedProduct.map(item => {
        const categoryProduct = Categories.find(c => c.id === item.category);

        return (
            <div
                key={item.id}
                className="bg-card2 rounded-xl shadow-lg"
            >
                <img 
                    src={item.img}
                    alt={item.title}
                    className="w-full h-[150px] rounded-xl object-cover"
                />
                <div className="py-2 px-3">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-400">{categoryProduct?.name}</p>
                    <div className="mt-2 flex justify-between items-center">
                        <p className="font-bold text-primary">{item.price.toLocaleString("id-ID")}</p>
                        <div>
                            <IoBagAddOutline size={25}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    // const images = [
    //     "https://akcdn.detik.net.id/community/media/visual/2021/10/01/promo-hari-kopi-sedunia-2021-1.jpeg?w=1080",
    //     "https://beritalima.com/wp-content/uploads/2023/02/Chatime-Promo.jpg",
    //     "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyr9fEj--hj3UyxRAi1ymS5Bege0EWrWToE4wS07jbNYPg5Z8HgyHrXDUQaT4wiSk2xmzZ_Fd29lU4NefsKBfUYSQNJ4mqStuKj6Msq_6rCOGq9WyN8YnzklS61Yh0QeSy3iTniruX8izbVbEzU65uN2Fr8hQBMfDGbo7S-o06hFujHC0pH0oJpQ/s16000/Prom"
    // ];

    return (
        <div className="bg-main min-h-screen">
            <div className="p-3 flex justify-between">
                <div className="flex items-center gap-2">
                    <PiCoffeeBeanFill size={28}/>
                    <p className="text-2xl font-bold">Kopiku</p>
                </div>
                <DarkModeSwitch />
            </div>
            {/* <div className="">
                <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory hide-scrollbar p-3">
                    {images.map((src, i) => (
                        <div key={i} className="relative flex-shrink-0 snap-center w-[300px]">
                            <div className="absolute bottom-3 left-3">
                                <button 
                                    className="flex items-center gap-1 px-4 py-1 bg-white font-bold text-sm text-black rounded-xl"
                                    onClick={() => console.log("click")}
                                >
                                    View 
                                    <IoMdArrowForward size={18}/>
                                </button>
                            </div>
                            <img
                                src={src}
                                alt={`promo-${i}`}
                                className="h-[200px] w-full object-cover rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            </div> */}
            <div className="p-3 relative">
                <div className="absolute top-[21px] left-[23px]">
                    <LuSearch 
                        size={22}
                        className="text-gray-400"
                    />
                </div>
                {searchText && (
                    <div className="absolute top-[21px] right-[23px]">
                        <RiCloseCircleLine 
                            size={22}
                            className="text-gray-400"
                            onClick={() => setSearchText('')}
                        />
                    </div>
                )}
                <div>
                    <input
                        type="text"
                        className="w-full focus:outline-primary focus:outline-2 py-2 px-10 placeholder-gray-400 bg-card rounded-2xl"
                        placeholder="Search Food"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>
            <div>
                {/* <div className="px-3 font-semibold text-lg">Products</div> */}
                <CategoryFilter 
                    setOpen={setOpen} 
                    selectCategory={selectCategory}
                    setSelectCategory={setSelectCategory}
                />
                <div className="grid grid-cols-2 p-3 gap-3">
                    {productList}
                </div>
            </div>
            {open && (
                <div
                    className="fixed inset-0 bg-black opacity-80 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {showScroll && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-17 right-3 bg-primary text-white p-3 rounded-full shadow-lg opacity-80 transition z-30"
                >
                    <RiArrowUpCircleLine size={28} />
                </button>
            )}

            {/* BOTTOM SHEET */}
            <div
                className={`fixed bottom-0 left-0 w-full h-1/2 bg-main rounded-t-2xl shadow-lg z-50 transform transition-transform duration-300 ${
                open ? "translate-y-0" : "translate-y-full"
                }`}
            >
                {/* HEADER */}
                <div className="p-4 border-b border-line flex justify-between items-center">
                    <div></div>
                    <h2 className="font-semibold text-lg">Filter</h2>
                    <button
                        onClick={() => setOpen(false)}
                    >
                        <RiCloseLine size={30}/>
                    </button>
                </div>

                {/* MENU ITEMS */}
                <div className="p-4 space-y-3">
                    <div className="p-3 rounded-lg bg-card2 cursor-pointer hover:bg-gray-200">
                        Termurah
                    </div>
                    <div className="p-3 rounded-lg bg-card2 cursor-pointer hover:bg-gray-200">
                        Termahal
                    </div>
                    <div className="p-3 rounded-lg bg-card2 cursor-pointer hover:bg-gray-200">
                        Terlaris
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;