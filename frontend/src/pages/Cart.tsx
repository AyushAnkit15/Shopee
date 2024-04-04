import { useState, useEffect } from "react";
import { BiSolidError } from "react-icons/bi";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);
  const subTotal = 10000;
  const cartItems = [
    {
      id: "abc123",
      name: "Puma Shoes",
      price: 1200,
      url: "https://assets.ajio.com/medias/sys_master/root/20230725/SEm0/64bfeddca9b42d15c96db427/-473Wx593H-469515602-black-MODEL2.jpg",
      quantity: 4,
      stock: 20,
    },
  ];

  const tax = Math.round(subTotal * 0.18);
  const shippingCharges = 200;
  const discount = 200;
  const total = subTotal + tax + shippingCharges;

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, id) => (
            <CartItem
              key={id}
              id={item.id}
              name={item.name}
              price={item.price}
              url={item.url}
              quantity={item.quantity}
              stock={item.stock}
            />
          ))
        ) : (
          <h1>Cart is Empty</h1>
        )}
      </main>

      <aside>
        <h2>SUBTOTAL : {subTotal}</h2>
        <h2>TAX : {tax}</h2>
        <h2>SHIPPING CHARGES : {shippingCharges}</h2>

        <h2>
          DISCOUNT : <em> -{discount}</em>
        </h2>

        <h2>
          <b>TOTAL : {total}</b>
        </h2>

        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <p className="green">
              {discount} is applied for using the coupon code {couponCode}
            </p>
          ) : (
            <div className="red">
              <BiSolidError />
              <p>INVALID COUPON CODE</p>
            </div>
          ))}
        {cartItems.length > 0 && <Link to="/shipping">GO TO CART</Link>}
      </aside>
    </div>
  );
};

export default Cart;
