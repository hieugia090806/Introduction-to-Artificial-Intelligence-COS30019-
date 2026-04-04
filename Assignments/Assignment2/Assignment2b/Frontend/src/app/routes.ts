import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Training } from "./pages/Training";
import { RoutePlanner } from "./pages/RoutePlanner";
import { Analytics } from "./pages/Analytics";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "route-planner", Component: RoutePlanner },
      { path: "training", Component: Training },
      { path: "analytics", Component: Analytics },
    ],
  },
]);
