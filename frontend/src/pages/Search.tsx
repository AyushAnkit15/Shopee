import React from "react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCategoriesQuery } from "../redux/api/productAPI";

import { CategoriesResponse } from "../types/api.types";
import { useSearchProductsQuery } from "../redux/api/productAPI";
import { Loader2 } from "../components/admin/Loader";
import toast from "react-hot-toast";
import { CustomError } from "../types/api.types";

import { useDispatch } from "react-redux";
import { CartItem } from "../types/types";

import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {
  const {
    data: CategoriesResponse,
    isError,
    isLoading: loadingCategories,
    error,
  } = useCategoriesQuery("");

  if (isError) {
    toast.error((error as CustomError).data.message);
  }
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [category, setCatgory] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const { isLoading: productLoading, data: searchedData , isError : productIsError , error : productError} =
    useSearchProductsQuery({
      search,
      sort,
      category,
      page,
      price: maxPrice,
    });

  console.log(searchedData);
  // const P = [
  //   {
  //     id: 1,

  //     name: "Puma",
  //     price: 1200,
  //     url: "https://5.imimg.com/data5/SELLER/Default/2023/7/326502700/DI/ZL/ZS/100976647/l-201-girls-pink-sports-shoes-1000x1000.jpeg",
  //   },
  //   {
  //     id: 2,
  //     name: "Adidas",
  //     price: 1000,
  //     url: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/71a00703e8c14c76aa8471445a9eaf40_9366/Ultrabounce_Shoes_Blue_HP5783_HM1.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "Reebok",
  //     price: 1500,
  //     url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/30d7afaa-343b-4439-b65d-bb544c65420e/revolution-7-road-running-shoes-dC34tK.png",
  //   },
  // ];


const dispatch = useDispatch()
  const addToCartHandler = (cartItem  : CartItem) => {
   if(cartItem.stock  < 1) return toast.error('Product out of stock')

    console.log('bulaya')

    dispatch(addToCart(cartItem))
    toast.success('added to cart')
}

  if(productIsError){
    toast.error((productError as CustomError).data.message)
  }

  if(isError){
    toast.error((error as CustomError).data.message)
  }
  return (
    <div className="product-search-page">
      <aside>
        <h1>Filters</h1>

        <div>
          <h3>Sort</h3>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="asc">Price (asc)</option>
            <option value="desc">Price (desc)</option>
          </select>
        </div>

        <div>
          <h3>Price {maxPrice || ""}</h3>
          <input
            value={maxPrice}
            type="range"
            min={0}
            max={100000}
            onChange={(e) => setMaxPrice(e.target.valueAsNumber)}
          ></input>
        </div>

        <div>
          <h3>Categories</h3>
          <select value={category} onChange={(e) => setCatgory(e.target.value)}>
            <option value="">All</option>
            {/* <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelery</option>
            <option value="men's clothing">Men's clothing</option>
            <option value="women's clothing">Women's clothing</option> */}
            {!loadingCategories &&
              CategoriesResponse?.categories?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
      </aside>

      <main>
        <h1>PRODUCTS</h1>

        <input
          placeholder="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>

        {
          productLoading ? <Loader2/> : 
          <div className="search-product-list">
            {/* {
            P.map((p) => (
              // <ProductCard
              //   id={p.id}
              //   name={p.name}
              //   price={p.price}
              //   url={p.url}
              //   handler={addToCartHandler}
              //   stock={10}
              // />
            ))} */}
  
            {searchedData?.products.map((p) => (
              <ProductCard
                key={p._id}
                productId={p._id}
                name={p.name}
                price={p.price}
                url={p.photo}
                handler={addToCartHandler}
                stock={10}
                quantity={1}
              />
            ))}
          </div>
  

        }

        {/* {searchedData && searchedData.totalPage > 1 &&  */}
          <article>
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => {
                  return prev === 1 ? 1 : prev - 1;
                })
              }
            >
              PREVIOUS
            </button>
            <span>{page} of {searchedData?.totalPage}</span>
            <button
              disabled={page === 5}
              onClick={() =>
                setPage((prev) => {
                  return prev === 5 ? 5 : prev + 1;
                })
              }
            >
              NEXT
            </button>
          </article>
        {/* } */}
      </main>
    </div>
  );
};

export default Search;
