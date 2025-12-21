import api from "../../config/api";
import type { SignInParams, SignUpParams } from "../../types/auth/authTypes";

export const signUp = async (data: SignUpParams) => {
  try {
    const res = await api.post(
      "/auth/register",
      {
        username: data.username,
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true,
      }
    );
    if (res) {
      return res.data;
    } else {
      console.log("Server error");
    }
  } catch (error) {
    throw error;
  }
};

export const signIn = async (data: SignInParams) => {
  try {
    const res = await api.post(
      "/auth/login",
      {
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true,
      }
    );
    if (res) {
      return res.data;
    } else {
      console.log("Server error");
    }
  } catch (error) {
    throw error;
  }
};
