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
import Chat from "../Pages/Chat";
import Pdfviewer from "../Pages/Pdfviewer";
import Try from "../Pages/Try";
import VideoCall from "../Pages/videoCall";
import Editor from "../Pages/Editor";
import PotreeViewer from "../Pages/Potree";
import LocationData from "../ComponenetPages/Location";
import Scrapper from "../ComponenetPages/Scrapper";



  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={<Protected />}>
          <Route index  element={<Home />} />
          <Route path="chat" element={<Chat/>}/>
          <Route path="pdf" element={<Pdfviewer/>}/>
          <Route path="try" element={<Try/>}/>
          <Route path="videoCall" element={<VideoCall/>}/>
          <Route path="potree" element = {<PotreeViewer />}/>
          <Route path="editor" element = {<Editor/>}/>
          <Route path="location" element = {<LocationData/>}/>
          <Route path="scrap" element = {<Scrapper/>}/>
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