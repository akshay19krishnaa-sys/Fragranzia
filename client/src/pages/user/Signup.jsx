import { useState } from 'react'
import { Link } from "react-router-dom";
import "../../style/signup.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/user-api-service/AuthService";
import { toast } from 'react-toastify';


const Signup = () =>  {

  const { register } = AuthService();

    const [formData,setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    

    })
    const [FormErr,setFormErr] = useState(
        {
            name:false,
            email:false, 
            password:false,
            confirmPassword:false,
            


        }
    )

    const navigate = useNavigate();

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

 const onHandleSubmit = async (e) => {
  e.preventDefault();

  let next = true;
  let err = {
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  };

  if (formData.name == "") {
    next = false;
    err.name = true;
  }

  if (
    formData.email == "" ||
    !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
      formData.email
    )
  ) {
    next = false;
    err.email = true;
  }

  if (formData.password == "") {
    next = false;
    err.password = true;
  }

  if (
    formData.confirmPassword === "" ||
    formData.password !== formData.confirmPassword
  ) {
    err.confirmPassword = true;
    next = false;
  }

  setFormErr(err);

  if (!next) return;

try {

  const data = await register({
    name: formData.name,
    email: formData.email,
    password: formData.password,
  });

  toast.success(data.message || "Registered Successfully");

  navigate("/");

} catch (error) {

  console.log("Full Error:", error);
  console.log("Response:", error.response);
  console.log("Data:", error.response?.data);

  toast.error(error.response?.data?.message || "Registration Failed");
}
};
    let onHandleBlur = (e) => {
        let {name} = e.target
        let err = formData[name] ==""
         


        if(name == "name" && formData.name == ""){
            err = true
        }
        else if (name == "email" && formData.email == ""){
            err = true
        }
        
         else if ( name == "password" && formData.password == ""){
            err = true
        }
         else if (name === "confirmPassword") {
            err =
            formData.confirmPassword === "" ||
            formData.password !== formData.confirmPassword;
        }


        setFormErr(prev => ({
            ...prev,
            [name]: err
        }))

    }


    return (
        <>
         <div className="main">
        <div className="text">
            <div className="text1">
                <h1>Let's Get Started!</h1>
                <h4>Create your account and unlock the
                    full potential of Fragranzia.
                </h4>
            </div>
        </div>
        <div className="sign">
            <div className="logo-text">

                <button className="google-btn">
                    <img src="googlelogo.png" alt=""/>
                    <span>Google</span>
                </button>


                <button className="google-btn">
                    <img src="download-removebg-preview.png" alt=""/>
                    <span>Facebook</span>
                </button>

            </div>
            <div className="line">
                <div className="hr-line">

                    <p></p>
                </div>
                <div className="line-text">
                    <a href="#" className='signup-link '>or sign up with email</a>
                </div>
                <div className="hr-line">
                    <p></p>
                </div>


            </div>
             <form action="" onSubmit={onHandleSubmit}>
            <div className="form-group">
               
                <i className="bi bi-person"></i>
         <input 
           type="text"
         name="name"
         value={formData.name}
         placeholder='enter your name'
        onChange={handleChange}
        onBlur={onHandleBlur}
        />     
             <p className="error">{FormErr.name  && "please fill name"}</p>
       </div>

            <div className="form-group">
                <i className="bi bi-envelope"></i>
             <input 
  type="email"
  name="email"
  value={formData.email}
  placeholder='enter your email'
  onChange={handleChange}
  onBlur={onHandleBlur}
/>
     <p className="error">{FormErr.email  && "enter a valid  email"}</p>
            </div>

            <div className="form-group">
                <i className="bi bi-lock"></i>
<input 
  type="password"
  name="password"
  value={formData.password}
  placeholder='enter a password'
  onChange={handleChange}
  onBlur={onHandleBlur}
/>
     <p className="error">{FormErr.password && "please enter the password"}</p>
            </div>

            <div className="form-group">
                <i className="bi bi-lock-fill"></i>
<input 
  type="password"
  name="confirmPassword" 
  value={formData.confirmPassword}
  placeholder='confirm your password'
  onChange={handleChange}
  onBlur={onHandleBlur}
/>  
     <p className="error">{FormErr.confirmPassword  && "enter the same password again"}</p>
      </div>

          <div className="term">
  <input type="checkbox" />
  <label>Agree with Terms & Conditions</label>
</div>

           <button type="submit" className="signup-btn">Sign up</button>

    <div className="signin">
  <p>
    Already have an account? <Link to="/login">Sign In</Link>
  </p>
</div>
      </form>
        </div>
         


    </div>
     

        </>
    )
    
}

export default Signup