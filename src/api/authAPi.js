import axios from "axios";
import { supabase } from "./db";

export const loginAPI = async ({ email, password }) => {
  try {
    const response = await axios.post("http://localhost:5000/api/login", {
    email:email,
    password:password
    });
    localStorage.setItem("token", response.data.token);
    return response;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};
// check supabase 

// store the token in local storage
export const signupAPI = async ({ email, password, name }) => {
  const { data: user, error } = await supabase.auth.signUp({ email, password });
  const userId = user?.user?.id;
  await supabase
    .from("user_profiles")
    .insert([{ id: userId, email: email, full_name: name }]);
  if (error) {
    throw new Error(error.message);
  }

  return user;
};
