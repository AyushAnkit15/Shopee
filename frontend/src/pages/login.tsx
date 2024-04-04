
import { useState } from "react"
// import { IoLogoGoogle } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";

const login = () => {
    const [formData, setFormData] = useState({
       gender : "" , 
       dateOfBirth : ""
      });

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
  return (
   
    <div className="login">
       
       <main>
        <h1 className="heading">LOGIN</h1>

        <div>
            <label>Gender</label>
            <select value = {formData.gender} name="gender" onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>



<label>Date Of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}></input>
        </div>

        <div>
            <h1>NOT HERE FOR FIRST TIME</h1>
            <button><FaGoogle/>
            <span>SIGN IN WITH GOOGLE</span>
            </button>
        </div>
       </main>



    </div>
  )
}

export default login