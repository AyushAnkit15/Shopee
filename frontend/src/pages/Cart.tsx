import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidError } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/CartItem";
import { addToCart, calculatePrice, removeCartItem ,   discountApplied } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { CartItem } from "../types/types";
import axios from 'axios'
import { server } from "../redux/store";

const Cart = () => {
 

  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (Math.random() > 0.5) setIsValidCouponCode(true);
  //     else setIsValidCouponCode(false);
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timeoutId);
  //     setIsValidCouponCode(false);
  //   };
  // }, [couponCode]);

  // const cartItems = [
  //   {
  //     id: "abc123",
  //     name: "Puma Shoes",
  //     price: 1200,
  //     url: "https://assets.ajio.com/medias/sys_master/root/20230725/SEm0/64bfeddca9b42d15c96db427/-473Wx593H-469515602-black-MODEL2.jpg",
  //     quantity: 4,
  //     stock: 20,
  //   },
  // ];
  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();

    const timeOutID = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);
  const addToCartHandler = (cartItem  : CartItem) => {
    if(cartItem.stock  < 1) return toast.error('Product out of stock')

      dispatch(addToCart(cartItem))
  }

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
      {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>

      <aside>
        <h2>SUBTOTAL : {subtotal}</h2>
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
