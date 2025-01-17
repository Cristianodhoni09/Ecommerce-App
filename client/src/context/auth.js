import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: "" });
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({ 
        ...auth, 
        user: parseData.user, 
        token: parseData.token 
      });
    } 
    else {

    }
    /*
      > The comment is not just a regular comment. It’s a directive specifically for ESLint, a tool used to analyze 
        your code.
      > By default, ESLint checks your useEffect hooks to ensure all variables used inside the effect are declared in 
        the dependency array. This is to ensure the code behaves consistently and avoids stale variables.
      
      #When you include // eslint-disable-next-line:
      > It tells ESLint to ignore the rule checking for dependencies in the next line only.
      > Without this directive, ESLint would throw a warning asking you to include auth in the dependency array.
    */
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

//Custom hook
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
