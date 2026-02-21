import React, { useContext, useState } from "react";
import {toast} from "react-toastify";
import { validateEmail } from "../../utils/helper.js";
import axiosInstances from "../../utils/axiosInstances.js";
import API_PATH, { BASE_URL } from "../../utils/APIpath.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/Context.jsx";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true)
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.warning("Enter Email");
      setError("Please enter valid email");
      return;
    }

    if (!password) {
      toast("Enter password");
      setError("Enter password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstances.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });
      console.log("LOGIN URL:",API_PATH.AUTH.LOGIN);
    
      if(response.status === 201){
        toast.success("Successfully loggedIn ✅")
      }
      const { token, user } = response.data;
      if (token && user) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
  console.log("Error in logging : ", error);

  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (status === 401 || status === 402) {
    toast.error(message || "Invalid email or password ❌");
  } else if (status === 500) {
    toast.error("Server error 🚨");
  } else {
    toast.error(message || "Login failed");
  }
}
  };

  return (
    <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-serif text-center text-gray-800">
          || Welcome Back ||
        </h2>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin}  className="space-y-5">
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 text-black py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-900"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'password' : 'text'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-black text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-800"
              />
              
              <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 cursor-pointer">
                {showPassword ?  (
                    <FaEyeSlash
                    onClick={() => setShowPassword(false)}
                    />
                ):
                 (<FaEye
                onClick={()=>setShowPassword(true)}
                />)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Log In
          </button>
        </form>

        <a href="/signup" className="text-blue-500">Create an account? </a>
      </div>
    </div>
  );
};

export default LoginPage;
