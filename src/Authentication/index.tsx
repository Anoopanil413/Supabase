import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
  } from "react-router-dom";
  import Home from "../Pages/Home";
  import Signin from "../Pages/Login";
  import Signup from "../Pages/Signup";
import Protected from "./protected";


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={<Protected />}>
          <Route index  element={<Home />} />
        </Route>
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Route>
    )
  );
  
  const Index = () => {
    return <RouterProvider router={router} />;
  };
  
  export default Index;