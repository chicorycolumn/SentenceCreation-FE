import { createContext } from "react";

const LanguageContext = createContext("ENG");
export const LanguageContextProvider = LanguageContext.Provider;
export default LanguageContext;
