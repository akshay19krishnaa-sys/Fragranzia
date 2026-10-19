import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../../style/login.css";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import AuthService from "../../services/user-api-service/AuthService";

const Login = () => {
  const { login } = AuthService();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [FormErr, setFormErr] = useState({
    email: false,
    password: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const err = { email: false, password: false };

    if (!formData.email.trim()) {
      err.email = true;
      hasError = true;
    }
    if (!formData.password) {
      err.password = true;
      hasError = true;
    }

    setFormErr(err);
    if (hasError) return;

    try {
      const res = await login(formData);

      // Remove old admin login
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setFormErr((prev) => ({
      ...prev,
      [name]: false
    }));
  };

  const onHandleBlur = (e) => {
    const { name, value } = e.target;
    let isErr = !value.trim();

    if (name === "email" && value.trim()) {
      isErr = !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value.trim());
    }

    setFormErr((prev) => ({
      ...prev,
      [name]: isErr
    }));
  };

  return (
    <div className="main-login">
      <div className="text-login">
        <div className="text1-login">
          <h1>Welcome Back!</h1>
          <h4>
            Glad to see you again! Access your <br />account to explore more
          </h4>
        </div>
      </div>
      <div className="login-login">
        <div className="logo-text-login">
          <button type="button" className="google-btn-login">
            <img src="/googlelogo.png" alt="Google" />
            <span>Google</span>
          </button>

          <button type="button" className="google-btn-login">
            <img src="/download-removebg-preview.png" alt="Facebook" />
            <span>Facebook</span>
          </button>
        </div>

        <div className="line-login">
          <div className="hr-line-login"></div>
          <div className="line-text-login">
            <p>or login with email</p>
          </div>
          <div className="hr-line-login"></div>
        </div>

        <form onSubmit={onHandleSubmit}>
          <div className="form-group-login">
            <div className="input-box-login">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                placeholder="enter email"
                onChange={handleChange}
                onBlur={onHandleBlur}
                autoComplete="email"
              />
            </div>
            {FormErr.email && (
              <p className="error-login">enter valid email</p>
            )}
          </div>

          <div className="form-group-login">
            <div className="input-box-login">
              <i className="bi bi-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password || ""}
                placeholder="enter password"
                onChange={handleChange}
                onBlur={onHandleBlur}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-login"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {FormErr.password && (
              <p className="error-login">enter password</p>
            )}
          </div>

          <button type="submit" className="signup-btn-login">
            Login
          </button>
        </form>

        <div className="signin-login">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;