import type { JSX } from "react";
import { PiBowlFood, PiCoffeeBean, PiPopcorn } from "react-icons/pi";
import { RiDrinks2Line } from "react-icons/ri";
import type { ProductProps } from "../interfaces/product";

interface Categories {
    id: number;
    name: string;
    icon: JSX.Element;
}

export const Categories: Categories[] = [
    {
        id: 1,
        name: 'Makanan',
        icon: <PiBowlFood size={18} />
    },
    {
        id: 2,
        name: 'Minuman',
        icon: <RiDrinks2Line size={18} />
    },
    {
        id: 3,
        name: 'Snack',
        icon: <PiPopcorn size={18} />
    },
    {
        id: 4,
        name: 'Kopi',
        icon: <PiCoffeeBean size={18} />
    }
];

export const Products: ProductProps[] = [
    {
        id: 1,
        title: 'Kopi Butterscotch',
        category: 4,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbu30WDjyKPAaLNM9nQl1wZ3Ul7N-dtIkIIg&s',
        price: 25000,
    },
    {
        id: 2,
        title: 'French Fries',
        category: 3,
        img: 'https://thecozycook.com/wp-content/uploads/2020/02/Copycat-McDonalds-French-Fries-.jpg',
        price: 15000,
    },
    {
        id: 3,
        title: 'Cappuccino',
        category: 4,
        img: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Cappuccino_at_Sightglass_Coffee.jpg',
        price: 28000,
    },
    {
        id: 4,
        title: 'Matcha Latte',
        category: 2,
        img: 'https://veggiekinsblog.com/wp-content/uploads/2025/01/Earl-Gray-Matcha-10-500x500.jpg',
        price: 32000,
    },
    {
        id: 5,
        title: 'Cheese Cake',
        category: 3,
        img: 'https://shopee.co.id/inspirasi-shopee/wp-content/uploads/2019/06/gluten-free-new-york-cheesecake-thespruceeats.webp',
        price: 30000,
    },
    {
        id: 6,
        title: 'Americano',
        category: 4,
        img: 'https://mocktail.net/wp-content/uploads/2022/03/homemade-Iced-Americano-recipe_1ig.jpg',
        price: 20000,
    },
    {
        id: 7,
        title: 'Iced Caramel Latte',
        category: 2,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-egj0uDu2lcu7aNO2hs88FVI58JpOvgZViw&s',
        price: 35000,
    },
    {
        id: 8,
        title: 'Chocolate Croissant',
        category: 3,
        img: 'https://sallysbakingaddiction.com/wp-content/uploads/2018/03/chocolate-croissants.jpg',
        price: 22000,
    },
    {
        id: 9,
        title: 'Green Tea',
        category: 2,
        img: 'https://thaicaliente.com/wp-content/uploads/2024/08/thai-green-tea-feature.jpg',
        price: 18000,
    },
    {
        id: 10,
        title: 'Espresso',
        category: 4,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrjyHlkViXf1t9FlpAnmlozT9DZSvPbFi-Lg&s',
        price: 15000,
    },
    {
        id: 11,
        title: 'Mocha',
        category: 4,
        img: 'https://www.spoonfulofflavor.com/wp-content/uploads/2021/11/mocha-latte-recipe.jpg',
        price: 30000,
    },
    {
        id: 12,
        title: 'Tiramisu',
        category: 3,
        img: 'https://bakewithzoha.com/wp-content/uploads/2025/06/tiramisu-featured.jpg',
        price: 32000,
    },
    {
        id: 13,
        title: 'Lemon Tea',
        category: 2,
        img: 'https://radarmukomuko.bacakoran.co/upload/3f0929ad4f76a951272ebc96154dbd4a.jpg',
        price: 17000,
    },
    {
        id: 14,
        title: 'Strawberry Smoothie',
        category: 2,
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLfrA6std0HcGmRQBx2MpTqC42jO0LBE0pwg&s',
        price: 28000,
    },
    {
        id: 15,
        title: 'Chicken Sandwich',
        category: 1,
        img: 'https://www.eatingwell.com/thmb/lWAiwknQ9yapq6UuXAYrUdrcKbk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Rotisserie-Chicken-Sandwich-202-2000-485b673fe411460e95b512fbf805a5d9.jpg',
        price: 35000,
    }
];