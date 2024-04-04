import React from "react";
import { FaPlus } from "react-icons/fa";

interface Props {
  id: number;
  url: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
}

const ProductCard = ({ id, url, name, price, stock, handler }: Props) => {
  return (
    <div className="product-card">
      <img src={url} alt={name} />
      <h2>{name}</h2>  
      <h3>₹{price}</h3>
      <p>in stock : {stock}</p>

      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
