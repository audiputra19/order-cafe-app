import { useEffect, useState, type FC } from "react";
import { FaBoxOpen } from "react-icons/fa6";
import { IoBagAddOutline } from "react-icons/io5";
import { LuClipboardCheck } from "react-icons/lu";
import { PiCoffeeBeanFill } from "react-icons/pi";
import { RiArrowUpCircleLine, RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import DarkModeSwitch from "../components/DarkModeSwitch";
import { Categories } from "../config/db";
import { useCartIcon } from "../contexts/CartIconContext";
import { useGetTotalOrderByIdQuery } from "../services/apiOrder";
import { useGetProductQuery } from "../services/apiProduct";
import { useAppDispatch } from "../store";
import { addToCart } from "../store/CartSlice";
import { useGetCompanyProfileQuery } from "../services/apiProfile";
import { BASE_URL } from "../components/BASE_URL";

const Home: FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectCategory, setSelectCategory] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>('');
    const [showScroll, setShowScroll] = useState(false);
    const [sortType, setSortType] = useState<string>("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cartRef = useCartIcon();
    const {data: Products = [], isLoading: isLoadingProd, isError, refetch} = useGetProductQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });
    const {data: getTotalOrder = []} = useGetTotalOrderByIdQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });
    const {data: getCompanyProfile} = useGetCompanyProfileQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

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
        if (isError) {
            refetch();
        }
    }, [isError, refetch]);

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

    // sort product with category
    const filteredProduct = selectCategory 
    ? Products.filter(p => p.kategori === selectCategory)
    : Products;

    // sort product with search
    const searchedProduct = searchText
    ? Products.filter(p =>
      p.nama.toLowerCase().includes(searchText.toLowerCase())
    )
    : filteredProduct;

    // sort product with sort type
    const sortedProduct = [...searchedProduct].sort((a, b) => {
        const orderA = getTotalOrder?.find(o => o.produk_id === a.id)?.qty ?? 0;
        const orderB = getTotalOrder?.find(o => o.produk_id === b.id)?.qty ?? 0;

        if (sortType === "termurah") return a.harga - b.harga;
        if (sortType === "termahal") return b.harga - a.harga;
        if (sortType === "terlaris") return orderB - orderA;
        return 0;
    });
    
    const productList = sortedProduct.map(item => {
        const categoryProduct = Categories.find(c => c.id === item.kategori);
        const orderCount = getTotalOrder?.find(c => c.produk_id === item.id)?.qty ?? 0;

        return (
            <div
                key={item.id}
                className="product-card bg-card2 p-1 rounded-xl border border-card cursor-pointer"
                onClick={() => navigate(`/detail/${item.id}`)}
            >
                <img 
                    src={`${BASE_URL}${item.image_path}`}
                    alt={item.image_title}
                    className="w-full h-[150px] rounded-lg object-cover"
                />
                <div className="p-2">
                    <p className="font-semibold line-clamp-1">{item.nama}</p>
                    <p className="text-sm text-gray-400">{categoryProduct?.name}</p>
                    <div className="flex items-center gap-1 mt-2">
                        <LuClipboardCheck size={16}/>
                        <p className="text-xs">{orderCount} Order</p>
                    </div>
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
        <>
            <div className="bg-main min-h-screen">
                <div className="p-3 flex justify-between">
                    <div className="flex items-center gap-2">
                        {getCompanyProfile ? (
                            <img 
                                src={`${BASE_URL}${getCompanyProfile.image_path}`}
                                alt={getCompanyProfile.image_title} 
                                className="w-[35px] rounded-full"
                            />
                        ) : (
                            <PiCoffeeBeanFill size={28}/>
                        )}
                        <p className="text-2xl font-bold">{getCompanyProfile?.name}</p>
                    </div>
                    <DarkModeSwitch />
                </div>
                <div>
                    {/* <div className="px-3 font-semibold text-lg">Products</div> */}
                    <CategoryFilter 
                        setOpen={setOpen}
                        selectCategory={selectCategory}
                        setSelectCategory={setSelectCategory}
                        searchText={searchText}
                        setSearchText={setSearchText}
                    />

                    {/* Loading Screen */}
                    {isLoadingProd ? (
                        <div className="grid grid-cols-2 p-3 gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div 
                                    className="w-full bg-card2 rounded-xl p-2 animate-pulse"
                                    key={i}
                                >
                                    <div className="w-full h-[150px] bg-main rounded-lg"></div>
                                    <div className="p-2">
                                        <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main"></p>
                                        <div className="mt-2 flex justify-between items-center h-5 rounded-xl bg-main">
                                            <p className="font-bold text-primary"></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchedProduct.length > 0 ? (
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
                    <div className="sm:w-[400px] sm:fixed sm:bottom-29 sm:left-1/2 sm:-translate-x-1/2">
                        <button
                            onClick={scrollToTop}
                            className="sm:absolute fixed sm:bottom-0 bottom-29 right-3 bg-primary text-white p-3 rounded-full shadow-lg opacity-80 transition z-30 cursor-pointer"
                        >
                            <RiArrowUpCircleLine size={28} />
                        </button>
                    </div>
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
                        <div 
                            onClick={() => {
                                setSortType("terlaris");
                                setOpen(false);
                            }}
                            className="p-3 rounded-lg bg-card cursor-pointer"
                        >
                            Best Seller
                        </div>
                        <div 
                            onClick={() => {
                                setSortType("termurah");
                                setOpen(false);
                            }}
                            className="p-3 rounded-lg bg-card cursor-pointer"
                        >
                            Paling Murah
                        </div>
                        <div
                            onClick={() => {
                                setSortType("termahal");
                                setOpen(false);
                            }} 
                            className="p-3 rounded-lg bg-card cursor-pointer"
                        >
                            Paling Mahal
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;