import { useEffect, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScanMutation } from "../services/apiAuth";
import { useAppDispatch } from "../store";
import { setToken } from "../store/AuthSlice";

const ScanQR: FC = () => {
    const { code } = useParams();
    //console.log(meja)
    const [scan] = useScanMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(code) {
            const str = atob(code);
            const meja = str.replace("meja-", "");
            //console.log("Decoded meja:", meja);
            scan({ meja }).unwrap()
            .then(res => {
                dispatch(setToken(res.token));
                navigate('/');
            })
            .catch(() => {
                alert("QR invalid, silakan scan ulang");
            });
        }
    }, [])

    return (
        <div className="sm:flex sm:justify-center">
            <div className="sm:w-[400px] flex flex-col items-center justify-center h-screen bg-main text transition-colors">
                <div className="relative flex items-center justify-center w-60 h-60">
                    <div className="absolute w-full h-full rounded-full border-4 border-t-primary border-line animate-spin-slow" />
                    <div className="absolute w-[85%] h-[85%] rounded-full border-2 border-primary/50 shadow-[0_0_30px_var(--color-primary)] animate-pulse" />
                    <p className="text-lg font-semibold text-center animate-fade">
                    Scanning QR...
                    </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm opacity-80">Mohon tunggu sebentar</p>
                </div>
            </div>
        </div>
    )
}

export default ScanQR;