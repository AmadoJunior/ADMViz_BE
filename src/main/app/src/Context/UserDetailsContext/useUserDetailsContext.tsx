//Deps
import {createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

//Interfaces
import { IUserDetailsContext, IAuthority, IUserDetails } from "./interfaces";

//Context
export const UserDetailsContext = createContext<IUserDetailsContext>({
  isAuthenticated: false,
  errored: false,
  handleIsAuthenticated: (): Promise<void> => { 
    return new Promise((resolve, reject) => reject())
  },
  clearAuthentication: (): void => {},
  handleErrored: (isErrored: boolean): void => {},
});

export const useUserDetailsContext = (): IUserDetailsContext => {
  //Nav
  const navigate = useNavigate();

  //State
  const [userDetails, setUserDetails] = useState<IUserDetails | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errored, setErrored] = useState(false);

  //Methods
  const handleIsAuthenticated = (): Promise<any> => {
      //Fetch User Details
      const basePath = "http://localhost:8080";
      return fetch(`/api/self`, {
        method: "GET"
      })
      .then(res => {
        console.log(res);
        if(res.status !== 200) throw new Error("Could Not Get User Details RES");
        return res.json();
      })
      .then(data => {
        console.log(data);
        if(!data) throw new Error("Could Not Get User Details JSON");
        setUserDetails(data);
        //Set Is Auth
        setIsAuthenticated(true);
        setErrored(false);
        navigate("/");
      })
      .catch(e => {
        console.error(e);
        //Set State
        setUserDetails(undefined);
        setIsAuthenticated(false);
      })
  }

  const clearAuthentication = (): void => {
    setUserDetails(undefined);
    setIsAuthenticated(false);
  }

  const handleErrored = (isErrored: boolean): void => {
    setErrored(isErrored);
  }

  useEffect(() => {
    try{
      handleIsAuthenticated();
    } catch(e) {
      console.error(e);
    }
  }, [])

  useEffect(() => {
    if(errored) {
      clearAuthentication();
    }
  }, [errored])

  return {userDetails, isAuthenticated, errored, handleIsAuthenticated, handleErrored, clearAuthentication};
}

export default useUserDetailsContext;
