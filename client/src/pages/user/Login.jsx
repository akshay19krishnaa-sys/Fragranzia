import { useState } from 'react'
import { Link } from "react-router-dom";
import "../../style/login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import AuthService from "../../services/user-api-service/AuthService";



const Login = () => {

    const { login } = AuthService();

    const [formData,setFormData] = useState({
  
    email: "",
    password: ""
 })
    const [FormErr,setFormErr] = useState(
        {

            email:false, 
            password:false,
            
            


        }
    )

     const navigate = useNavigate();
     const { setAuth } = useAuth();

const onHandleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await login(formData);
    console.log(res);

    // ✅ Remove old admin login
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

   setAuth({
  accessToken: res.token,
  user: res.user,
});

localStorage.setItem("token", res.token);
localStorage.setItem("user", JSON.stringify(res.user));
localStorage.setItem("role", res.role);

toast.success("Login successful");

if (res.role === "admin") {
  navigate("/admin/dashboard");
} else {
  navigate("/");
}
  } catch (error) {
    console.log("ERROR:", error);
    console.log("RESPONSE:", error.response);
    console.log("DATA:", error.response?.data);

    toast.error(error.response?.data?.message || "Login Failed");
  }
};

    const handleChange = (e)=>{

        setFormData((prev)=>({
        ...prev,
        [e.target.name]: e.target.value

    }))
    setFormErr((prev) => ({
    ...prev,
     [e.target.name]: false
  }));

    }


    
    let onHandleBlur = (e) => {
        let {name} = e.target
        let err = formData[name] ==""
         


        
         if (name == "email" && formData.email == ""){
            err = true
        }
        
         else if ( name == "password" && formData.password == ""){
            err = true
        }
        

        setFormErr(prev => ({
            ...prev,
            [name]: err
        }))

    }




  return(
    <div className="main-login">
    <div className="text-login">
        <div className="text1-login">
            <h1>Welcome Back!</h1>
            <h4>CGlad to see you again! Access your <br/>account to explore more
            </h4>
        </div>
    </div>
    <div className="login-login">
        <div className="logo-text-login">

            <button className="google-btn-login">
                <img src="googlelogo.png" alt=""/>
                <span>Google</span>
            </button>


            <button className="google-btn-login">
                <img src="download-removebg-preview.png" alt=""/>
                <span>Facebook</span>
            </button>

        </div>
        <div className="line">
            <div className="hr-line-login">

                <p></p>
            </div>
            <div className="line-text-login">
                <p>or sign up with email</p>
            </div>
            <div className="hr-line-login">
                <p></p>
            </div>


        </div>
         <form onSubmit={onHandleSubmit}>
    
    

    <div className="form-group-login">
        <i className="bi bi-lock"></i>
        <input 
            type="email"
            name="email"
            value={formData.email || ""}
            placeholder="enter email"
            onChange={handleChange}
            onBlur={onHandleBlur}
        />
        <p className="error-login">
            {FormErr.email && "enter valid email"}
        </p>
    </div>

    <div className="form-group-login">
        <i className="bi bi-lock"></i>
        <input 
            type="password"
            name="password"
            value={formData.password ||""}
            placeholder="enter password"
            onChange={handleChange}
            onBlur={onHandleBlur}
        />
        <p className="error-login">
            {FormErr.password && "enter password"}
        </p>
    </div>

    <button type="submit" className="signup-btn-login">
        login
    </button>

</form>
        
        <div className="signin-login">
               <p>Don't have a account? <Link to="/signup"> Sign up </Link></p> 
            </div>

    </div>
    </div>
  ) 
};

export default Login;