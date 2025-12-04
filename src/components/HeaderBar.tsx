import { useEffect, useState } from "react";
import { useAppSelector } from "../store";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeAllCart } from "../store/CartSlice";

interface TokenPayload {
    exp: number;
}

const HeaderBar = () => {
    const [countdown, setCountdown] = useState<number>(0);
    const meja = useAppSelector((state) => state.auth.meja);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const decodedToken = jwtDecode<TokenPayload>(token);
        const expTime = decodedToken.exp; // waktu expire (detik)

        const updateCountdown = () => {
            const now = Math.floor(Date.now() / 1000);
            const remaining = expTime - now;
            setCountdown(remaining > 0 ? remaining : 0);

            if (remaining <= 0) {
                dispatch(removeAllCart());
                sessionStorage.removeItem("confirmScrollY");
                navigate("/warning-scan");
            }
        };

        updateCountdown(); // hitung awal

        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [token, navigate]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    if (countdown <= 0) return null;

    return (
        <div className="flex justify-center">
            <div className="sm:w-[400px] w-full bg-main px-3 pt-3">
                <div className="p-1 border border-card rounded-xl shadow-gray-100 flex justify-between">
                    <span className="text-sm flex border border-card py-1 px-3 rounded-lg bg-card2">
                        <p className="font-semibold">Meja:</p>
                        <p className="ml-1 font-bold">{meja ? String(meja).padStart(2, "0") : "--"}</p>
                    </span>
                    <span className="flex text-sm border border-card py-1 px-3 rounded-lg bg-card2">
                        <p className="flex-1 font-semibold">Timer:</p>
                        <p className="font-bold ml-1 w-[64px]">
                            {countdown > 0 ? formatTime(countdown) : "Expired"}
                        </p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HeaderBar;