import React, { useEffect, useState } from 'react'
import FunForm from '../components/FunForm'
import supabase from '../supabase'
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const SignUp = () => {



  const [session, setSession] = useState(null);

  useEffect(() => {
      
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      return () => subscription.unsubscribe();
    }, []);

  const register = (email:any, password:any) =>
      supabase.auth.signUp({ email, password });


  const handleSignupSubmit = async(dataa:{password:any,useremail:any})=>{

      const { password,useremail} = dataa
      console.log(useremail)

      const { data, error } = await register(
          useremail,
          password
        );

        console.log("chekingt he data from form",data, error )

    }
return (
  <>

  {/* <FunForm handleSubmit= {handleSignupSubmit}/> */}
  { !session ?


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
  
  }


  </>

)
}

export default SignUp
