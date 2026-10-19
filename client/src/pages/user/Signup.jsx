import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../../style/signup.css";
import AuthService from "../../services/user-api-service/AuthService";
import useAuth from "../../hooks/useAuth";
import { toast } from 'react-toastify';

const Signup = () => {
  const { register } = AuthService();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const [FormErr, setFormErr] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setFormErr((prev) => ({
      ...prev,
      [name]: false
    }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    let next = true;
    let err = {
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
      agreeTerms: false
    };

    if (!formData.name.trim()) {
      next = false;
      err.name = true;
    }

    if (
      !formData.email.trim() ||
      !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        formData.email.trim()
      )
    ) {
      next = false;
      err.email = true;
    }

    if (!formData.password) {
      next = false;
      err.password = true;
    }

    if (
      !formData.confirmPassword ||
      formData.password !== formData.confirmPassword
    ) {
      err.confirmPassword = true;
      next = false;
    }

    setFormErr(err);

    if (!next) return;

    try {
      const data = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success(data.message || "Registered Successfully");

      if (data.token && data.user) {
        setAuth({
          accessToken: data.token,
          user: data.user,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.role || "user");
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log("Full Error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  const onHandleBlur = (e) => {
    const { name, value } = e.target;
    let isErr = false;

    if (name === "name") {
      isErr = !value.trim();
    } else if (name === "email") {
      isErr =
        !value.trim() ||
        !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
          value.trim()
        );
    } else if (name === "password") {
      isErr = !value;
    } else if (name === "confirmPassword") {
      isErr = !value || formData.password !== value;
    }

    setFormErr((prev) => ({
      ...prev,
      [name]: isErr
    }));
  };

  return (
    <div className="main-signup main">
      <div className="text-signup text">
        <div className="text1-signup text1">
          <h1>Let's Get Started!</h1>
          <h4>
            Create your account and unlock the <br />
            full potential of Fragranzia.
          </h4>
        </div>
      </div>

      <div className="sign-signup sign">
        <div className="logo-text">
          <button type="button" className="google-btn">
            <img src="/googlelogo.png" alt="Google" />
            <span>Google</span>
          </button>

          <button type="button" className="google-btn">
            <img src="/download-removebg-preview.png" alt="Facebook" />
            <span>Facebook</span>
          </button>
        </div>

        <div className="line">
          <div className="hr-line"></div>
          <div className="line-text">
            <span>or sign up with email</span>
          </div>
          <div className="hr-line"></div>
        </div>

        <form onSubmit={onHandleSubmit}>
          <div className="form-group">
            <div className="input-box">
              <i className="bi bi-person"></i>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="enter your name"
                onChange={handleChange}
                onBlur={onHandleBlur}
                autoComplete="name"
              />
            </div>
            {FormErr.name && <p className="error">please fill name</p>}
          </div>

          <div className="form-group">
            <div className="input-box">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="enter your email"
                onChange={handleChange}
                onBlur={onHandleBlur}
                autoComplete="email"
              />
            </div>
            {FormErr.email && <p className="error">enter a valid email</p>}
          </div>

          <div className="form-group">
            <div className="input-box">
              <i className="bi bi-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="enter a password"
                onChange={handleChange}
                onBlur={onHandleBlur}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {FormErr.password && <p className="error">please enter the password</p>}
          </div>

          <div className="form-group">
            <div className="input-box">
              <i className="bi bi-lock-fill"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="confirm your password"
                onChange={handleChange}
                onBlur={onHandleBlur}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {FormErr.confirmPassword && (
              <p className="error">enter the same password again</p>
            )}
          </div>

          <div className="term">
            <input
              type="checkbox"
              id="terms-conditions"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <label htmlFor="terms-conditions">Agree with Terms & Conditions</label>
          </div>

          <button type="submit" className="signup-btn">
            Sign up
          </button>

          <div className="signin">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;