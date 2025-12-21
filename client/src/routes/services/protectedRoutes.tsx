import MainHome from "../../pages/dashboard/MainHomePage";
import EditorPage from "../../pages/dashboard/EditorPage";

export const protectedRoutes = [
  {
    path: "/dashboard",
    component: <MainHome />,
  },
  {
    path: "/dashboard/doc/:id",
    component: <EditorPage />,
  },
];
