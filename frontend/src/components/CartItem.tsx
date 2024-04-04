import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

interface Props {
  id: string;
  name: string;
  price: number;
  url: string;
  quantity: number;
  stock: number;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CartItem = ({ id, name, price, url, quantity }: Props) => {
  return (
    <div className="cart-item">
      <img src={url} alt={name} />
      <article>
        <Link to={`/product/${id}`}>{name}</Link>

        <span>₹{price}</span>
      </article>

      <div>
        <button>-</button>
        <p>{quantity}</p>
        <button>+</button>
      </div>

      <button>
        <MdDelete />
      </button>
    </div>
  );
};

export default CartItem;
