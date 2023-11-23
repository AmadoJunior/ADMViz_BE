//Deps
import React from "react";
import { useOutletContext, Navigate } from "react-router-dom";

//MUI

//Props
type ContextType = { isAuthenticated: boolean | null | undefined };
interface IProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({children}): JSX.Element => {
  const {isAuthenticated} = useOutletContext<ContextType>();

  return( 
    <>
    {
      isAuthenticated ? 
        (children) : 
        (<Navigate to={`/authenticate`}></Navigate>)
    }
  </>);
}

export default ProtectedRoute;
