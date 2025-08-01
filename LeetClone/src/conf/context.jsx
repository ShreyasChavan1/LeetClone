// ContextProvider.jsx
import { createContext, useState ,useEffect} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";

export const Mycontext = createContext();

const ContextProvider = ({ children }) => {
  const [navBar, setNavBar] = useState(true); 
  const [currentuser,setCurrentuser] = useState({});
  const [problem,setProblem] = useState([]);
  const [code,setCode] = useState("");
  const [language,setLanguage] = useState("python");
  const [output,setOutput] = useState("");

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (User) => {
    if (User) {
      setCurrentuser({
        name: User.displayName,
        email: User.email,
        avatar: User.photoURL,
        uid: User.uid,
      });
    } else {
      setCurrentuser(null);
    }
  });

  return () => unsubscribe();
}, []);


  const providers = {
  navBar,
  setNavBar,
  currentuser,
  setCurrentuser,
  problem,
  setProblem,
  code,
  setCode,
  language,
  setLanguage,
  output,
  setOutput
};
  return (
    <Mycontext.Provider value={providers}>
      {children}
    </Mycontext.Provider>
  );
};

export default ContextProvider;
