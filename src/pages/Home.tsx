import { useEffect, useState, type FC } from "react";
import { IoBagAddOutline } from "react-icons/io5";
import { PiCoffeeBeanFill } from "react-icons/pi";
import { RiArrowUpCircleLine, RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import DarkModeSwitch from "../components/DarkModeSwitch";
import { Categories } from "../config/db";
import { FaBoxOpen } from "react-icons/fa6";
import { useAppDispatch } from "../store";
import { addToCart } from "../store/CartSlice";
import { useCartIcon } from "../contexts/CartIconContext";
import { useGetProductQuery } from "../services/apiProduct";

const Home: FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectCategory, setSelectCategory] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>('');
    const [showScroll, setShowScroll] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cartRef = useCartIcon();
    const {data: Products = []} = useGetProductQuery();

    const handleAddToCart = (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        dispatch(addToCart(item));

        const productCard = (e.currentTarget as HTMLElement).closest(".product-card");
        const img = productCard?.querySelector("img");
        if (!img || !cartRef?.current) return;

        const imgRect = img.getBoundingClientRect();
        const cartRect = cartRef.current.getBoundingClientRect();

        const flyingImg = img.cloneNode(true) as HTMLImageElement;
        flyingImg.style.position = "fixed";
        flyingImg.style.left = imgRect.left + "px";
        flyingImg.style.top = imgRect.top + "px";
        flyingImg.style.width = imgRect.width + "px";
        flyingImg.style.height = imgRect.height + "px";
        flyingImg.style.transition = "all 0.8s ease-in-out";
        flyingImg.style.zIndex = "9999";
        document.body.appendChild(flyingImg);

        requestAnimationFrame(() => {
            flyingImg.style.left = cartRect.left + cartRect.width / 2 - 15 + "px"; // center X (30px target width)
            flyingImg.style.top = cartRect.top + cartRect.height / 2 - 15 + "px";  // center Y (30px target height)
            flyingImg.style.width = "30px";
            flyingImg.style.height = "30px";
            flyingImg.style.opacity = "0.3";
        });

        flyingImg.addEventListener("transitionend", () => flyingImg.remove());
    };

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
    ? Products.filter(p => p.kategori === selectCategory)
    : Products;

    const searchedProduct = searchText
    ? Products.filter(p =>
      p.nama.toLowerCase().includes(searchText.toLowerCase())
    )
    : filteredProduct;
    
    const productList = searchedProduct.map(item => {
        const categoryProduct = Categories.find(c => c.id === item.kategori);

        return (
            <div
                key={item.id}
                className="product-card bg-card2 p-1 rounded-xl border border-card cursor-pointer"
                onClick={() => navigate(`/detail/${item.id}`)}
            >
                <img 
                    src={`http://localhost:3001${item.image_path}`}
                    alt={item.image_title}
                    className="w-full h-[150px] rounded-lg object-cover"
                />
                <div className="p-2">
                    <p className="font-semibold line-clamp-1">{item.nama}</p>
                    <p className="text-sm text-gray-400">{categoryProduct?.name}</p>
                    <div className="mt-2 flex justify-between items-center">
                        <p className="font-bold text-primary">{item.harga.toLocaleString("id-ID")}</p>
                        <div
                            onClick={(e) => handleAddToCart(e, item)}
                        >
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
            <div>
                {/* <div className="px-3 font-semibold text-lg">Products</div> */}
                <CategoryFilter 
                    setOpen={setOpen}
                    selectCategory={selectCategory}
                    setSelectCategory={setSelectCategory}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
                {searchedProduct.length > 0 ? (
                    <div className="grid grid-cols-2 p-3 gap-3"> 
                        {productList}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center text-gray-400 mt-10">
                        <FaBoxOpen size={96}/>
                        <p className="text-lg font-bold">No Product Found</p>
                    </div>
                )}
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
                    className="fixed bottom-29 right-3 sm:right-[490px] bg-primary text-white p-3 rounded-full shadow-lg opacity-80 transition z-30 cursor-pointer"
                >
                    <RiArrowUpCircleLine size={28} />
                </button>
            )}

            {/* BOTTOM SHEET */}
            <div
                className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] h-1/2 bg-main rounded-t-2xl shadow-lg z-50 transform transition-transform duration-300 ${
                open ? "translate-y-0" : "translate-y-full"
                }`}
            >
                {/* HEADER */}
                <div className="p-4 border-b border-line flex justify-between items-center">
                    <div></div>
                    <h2 className="font-semibold text-lg">Filter</h2>
                    <button
                        className="cursor-pointer"
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