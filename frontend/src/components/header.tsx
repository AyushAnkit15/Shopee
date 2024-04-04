import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
const Header = () => {
  const logOutHandler = () => {
    localStorage.clear();
    window.location.reload();
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = {
    _id: "hjjt",
    role: "admin",
  };
  return (
    <nav className="header">
      <Link onClick={() => setIsOpen(false)} to="/">
        HOME
      </Link>
      <Link onClick={() => setIsOpen(false)} to="/search">
        <FaSearch />
      </Link>
      <Link onClick={() => setIsOpen(false)} to="/cart">
        <FaShoppingBag />
      </Link>

      {user?._id ? (
        <>
          <button
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link to="/admin/dashboard">ADMIN</Link>
              )}

              <Link to="/orders">ORDERS</Link>
              <button onClick={logOutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to="/login">
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
