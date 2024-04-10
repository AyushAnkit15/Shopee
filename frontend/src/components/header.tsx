import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import {User} from '../types/types'
import { signOut  } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";



interface UProps  {
  user:User|null
}
const Header = ({user}  : UProps) => {
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  


  const logOutHandler = async () => {
    try  { 
      await signOut(auth); 
      toast.success("successfullt signed out");
      
      setIsOpen(false);
    }

    catch(error){
      toast.error('sign out failed')
    }
      };
  // const user = {
  //   _id  :""  , 
  //   role : "user"
  // }
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
