//Deps
import {createContext, useState, useEffect} from "react";

//Interfaces
import { IScreenContext } from "./interfaces";

//Context
export const ScreenContext = createContext<IScreenContext>({
  height: 0,
  width: 0,
});

function getCurrentDimension(){
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

const useScreenContext = (): IScreenContext => {
  //State
  const [screenSize, setScreenSize] = useState<IScreenContext>(getCurrentDimension());

  //Effect
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    }
    window.addEventListener('resize', updateDimension);
    
    return(() => {
        window.removeEventListener('resize', updateDimension);
    })
  }, [screenSize])

  return screenSize;
}

export default useScreenContext;
