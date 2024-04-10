import React from "react";
import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import CartItems from "./CartItem";
import { CartItem } from "../types/types";

interface Props {
  productId: string;
  url: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  handler: (cartItem :CartItem ) => string   |undefined
}

const ProductCard = ({ productId, url , quantity, name, price, stock, handler }: Props) => {
  return (
    <div className="product-card">
      <img src={`${server}/${url}` || url} alt={name} />
      <h2>{name}</h2>  
      <h3>₹{price}</h3>
      <p>in stock : {stock}</p>

      <div>
        <button onClick={() => handler({productId  , quantity , price, name, photo : url, stock})}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
