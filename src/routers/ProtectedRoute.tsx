import { useEffect, type FC, type JSX } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { clearToken } from "../store/AuthSlice";
import { removeAllCart } from "../store/CartSlice";

interface Props {
    children: JSX.Element;
}

interface TokenPayload {
    exp: number;
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
    const token = useAppSelector(state => state.auth.token);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(token) {
            const decodedToken =  jwtDecode<TokenPayload>(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if(decodedToken.exp < currentTime) {
                dispatch(clearToken());
                dispatch(removeAllCart());
                navigate('/warning-scan');
            }
        } else {
            navigate('/warning-scan');
        }
    }, [token, navigate, dispatch]);

    return children;
}