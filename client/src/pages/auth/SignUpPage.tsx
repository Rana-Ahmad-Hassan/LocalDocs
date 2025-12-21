import { useState } from "react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/Input";
import { NavLink } from "react-router";
import { signUp } from "../../services/auth/service";
import { useNavigate } from "react-router";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signUp(formData);
      if (data) {
        navigate("/dashboard");
      }
    } catch (error) {
      throw error;
    }
    // API Call Logic here
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start collaborating today">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          type="text"
          placeholder="johndoe"
          required
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Create Account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <NavLink
          to={"/auth/sign-in"}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign in
        </NavLink>
      </p>
    </AuthLayout>
  );
};
