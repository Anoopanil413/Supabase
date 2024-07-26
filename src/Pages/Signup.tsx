// import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import FunForm from "../components/FunForm";
import supabase from "../supabase";
import { Auth } from "@supabase/auth-ui-react";
// import { Auth } from "@supabase/auth-ui-react";
// import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const SignUp = () => {
  const navigate = useNavigate();

  // const [session, setSession] = useState(null);

  // useEffect(() => {

  //     supabase.auth.getSession().then(({ data: { session } }) => {
  //       setSession(session);
  //     });
  //     const {
  //       data: { subscription },
  //     } = supabase.auth.onAuthStateChange((_event, session) => {
  //       setSession(session);
  //     });
  //     return () => subscription.unsubscribe();
  //   }, []);

  const register = (email: any, password: any) =>
    supabase.auth.signUp({ email, password });

  const handleSignupSubmit = async (dataa: {
    password: any;
    useremail: any;
  }) => {
    const { password, useremail } = dataa;
    console.log(useremail);

    const { data, error } = await register(useremail, password);

    console.log("chekingt he data from form", data, error);
    if(error)return
    if(data.user){
      const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data?.user.id, email: data?.user.email });

      if(profileError)return
  
      navigate("/signin");
    }

  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height:'100%',
        }}
      >
    <div style={{textAlign:'center'}}><p style={{fontSize:'20px'}}>Signup</p></div>
      <div className="LoginPage">
          <FunForm handleSubmit={handleSignupSubmit} />
        </div>

        <div className="custon_google">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
      </div>
        {/* <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >


    </div> */}
        <div><p>Already have an account?  <span ><a href="/signin">Signin</a></span></p></div>
      </div>

      {/* { !session ?


(
  <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "facebook", "github"]}
        />
      </div>

    </div>

  
):(
  <>
  <div>
      Logged in
  </div>
  </>
)
  
  } */}
    </>
  );
};

export default SignUp;
