import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./style/variable.css";
import "./index.css";

import App from './App.jsx'
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(

  <AuthProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </AuthProvider>
);