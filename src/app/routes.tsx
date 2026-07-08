import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import AddRestaurant from "./pages/AddRestaurant";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "add", Component: AddRestaurant },
    ],
  },
]);
