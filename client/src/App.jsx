import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/MainLayout/Layout";
import Home, { loader as postLoader } from "./pages/Home/Home";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Posts from "./pages/Posts/Posts";
import { Provider } from "react-redux";
import store from "./store/store";
import RequireAuth from "./pages/RequireAuth/RequireAuth";
import PostDetail from "./pages/PostDetail/PostDetail";
import { loader as postDetailLoader } from "./pages/PostDetail/PostDetail";
import PostLayout from "./components/PostLayout/PostLayout";
import CreatePost from "./pages/CreatePost/page";
import PersistUser from "./pages/PersistUser/PersistUser";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // { index: true, element: <Home />, loader: postLoader },
      { path: "/register", element: <Signup /> },
      { index: true, element: <Login /> },
      {
        element: <PersistUser />,
        children: [
          {
            element: <RequireAuth />,
            children: [
              {
                path: "/allposts",
                element: <Home />,
                loader: postLoader,
              },
              {
                element: <PostLayout />,
                children: [
                  {
                    path: "/posts",
                    element: <Posts />,
                  },
                  {
                    path: "/post/:id",
                    element: <PostDetail />,
                    loader: postDetailLoader,
                  },
                ],
              },
              {
                path: "/post/create",
                element: <CreatePost />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
function App() {
  return (
    <div className="app">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App;
