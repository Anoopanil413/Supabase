import { Navigate, Outlet } from "react-router-dom";
import Layouts from "./Layout";
import { useEffect } from "react";
import { fetchProfile } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../supabase";

const Protected = () => {
  const dispatch = useDispatch()
  const token = sessionStorage.getItem("token");
  const prof  =useSelector((state:any)=>state.users)

  useEffect(()=>{
    if(token){
     (async()=>{
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      dispatch(fetchProfile(userId));
     } )()
    }

  },[])

  return token ? <Layouts /> : <Navigate to="/signin" />;
};

export default Protected;