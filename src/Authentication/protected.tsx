import { Navigate } from "react-router-dom";
import Layouts from "./Layout";
import { useEffect } from "react";
import { fetchProfile } from "../features/userSlice";
import { useDispatch   } from "react-redux";
import supabase from "../supabase";

const Protected = () => {
  const dispatch = useDispatch()
  const token = sessionStorage.getItem("token");

  let session = null


  useEffect(()=>{


    const checkSession = async () => {
      try {
        const session = await supabase.auth.getSession();

        if (session?.data) {
          const userId = session.data.session?.user.id;
         await dispatch(fetchProfile(userId));

        }
      } catch (error:any) {
        console.error("Error fetching session:", error.message);
      }
    };

    if (token) {
      checkSession();
    }

  },[dispatch, token,session])

  return (token||session) ? <Layouts /> : <Navigate to="/signin" />;
};

export default Protected;



