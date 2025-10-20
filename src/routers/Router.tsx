import { useEffect, type FC } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Detail from "../pages/Detail";
import { CartIconProvider } from "../contexts/CartIconContext";
import ScanQR from "../pages/ScanQR";
import { WarningToScan } from "../pages/WarningToScan";
import { ProtectedRoute } from "./ProtectedRoute";
import Process from "../pages/Process";
import Transaction from "../pages/Transaction";
import PaymentMethod from "../pages/PaymentMethod";
import Confirm from "../pages/Confirm";

const ScrollToTop: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
};

const Router: FC = () => {
    const routes = [
        {
            path: '/',
            element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                {
                    path: '/cart',
                    element: <Cart />
                },
                {
                    path: '/transaction',
                    element: <Transaction />
                }
            ]
        },
        {
            path: '/detail/:id',
            element: <ProtectedRoute><Detail /></ProtectedRoute>
        },
        {
            path: '/cart-detail',
            element: <ProtectedRoute><Cart /></ProtectedRoute>
        },
        {
            path: '/scan/:code',
            element: <ScanQR />
        },
        {
            path: '/warning-scan',
            element: <WarningToScan />
        },
        {
            path: '/process/:orderID',
            element: <ProtectedRoute><Process /></ProtectedRoute>
        },
        {
            path: '/payment',
            element: <ProtectedRoute><PaymentMethod /></ProtectedRoute>
        },
        {
            path: '/confirm',
            element: <ProtectedRoute><Confirm /></ProtectedRoute>
        }
    ];

    const element = useRoutes(routes);

    return (
        <ScrollToTop>
            <CartIconProvider>
                {element}
            </CartIconProvider>
        </ScrollToTop>
    )
}

export default Router;