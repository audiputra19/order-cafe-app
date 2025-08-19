import type { FC } from "react";
import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Detail from "../pages/Detail";

const Router: FC = () => {
    const routes = [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                {
                    path: '/cart',
                    element: <Cart />
                }
            ]
        },
        {
            path: '/detail/:id',
            element: <Detail />
        }
    ];

    const element = useRoutes(routes);

    return element;
}

export default Router;