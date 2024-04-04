import React from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const P = [
  {
    id: 1,

    name: "Puma",
    price: 1200,
    url: "https://5.imimg.com/data5/SELLER/Default/2023/7/326502700/DI/ZL/ZS/100976647/l-201-girls-pink-sports-shoes-1000x1000.jpeg",
  },
  {
    id: 2,
    name: "Adidas",
    price: 1000,
    url: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/71a00703e8c14c76aa8471445a9eaf40_9366/Ultrabounce_Shoes_Blue_HP5783_HM1.jpg",
  },
  {
    id: 3,
    name: "Reebok",
    price: 1500,
    url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/30d7afaa-343b-4439-b65d-bb544c65420e/revolution-7-road-running-shoes-dC34tK.png",
  },
];

const Home = () => {
  return (
    <div className="home">
      <section></section>

      <h1>
        PRODUCTS WATCH OUT FOR
        <Link to="/search" className="findmore">
          OTHER PRODUCTS
        </Link>
      </h1>

      <main>
        <ProductCard
          id={1}
          url={P[0].url}
          name={P[0].name}
          price={P[0].price}
          stock={10}
          handler={() => console.log("add")}
        />
      </main>
    </div>
  );
};

export default Home;
