//Deps
import React from "react";
import { useOutletContext } from "react-router-dom";

//MUI

//Components
import Authenticate from "../Authenticate/Authenticate";
import Login from "../Authenticate/Login";
import Register from "../Authenticate/Register";

//Props
type ContextType = { isAuthenticated: boolean | null | undefined };
interface IProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({children}): JSX.Element => {
  const {isAuthenticated} = useOutletContext<ContextType>();

  return( 
    <>
    {isAuthenticated ? (children) : 
    (
    <Authenticate childrenProps={[
      {label: "Sign In", index: 0},
      {label: "Register", index: 1}
    ]}>
      <Login/>
      <Register/>
    </Authenticate>
    )}
  </>);
}

export default ProtectedRoute;
