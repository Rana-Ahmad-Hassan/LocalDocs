import { SignIn } from "../../pages/auth/SignInPage";
import { SignUp } from "../../pages/auth/SignUpPage";

export const publicRoutes = [
  {
    path: "/auth/sign-in",
    component: <SignIn />,
  },
  {
    path: "/auth/sign-up",
    component: <SignUp />,
  },
];
