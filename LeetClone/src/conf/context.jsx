// ContextProvider.jsx
import { createContext, useState ,useEffect} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";

export const Mycontext = createContext();

const ContextProvider = ({ children }) => {
  //all the varibles needed to have access throughout the project will be declared here and this
  //provider is then wrapped around the app so that entire app can have acces to these
  const [navBar, setNavBar] = useState(true); 
  const [currentuser,setCurrentuser] = useState({});
  const [problem,setProblem] = useState([]);
  const [code,setCode] = useState("");
  const [language,setLanguage] = useState("python");
  const [output,setOutput] = useState("");
  const [suburl,setSuburl] = useState("");

  const [allsubmissions,setAllsubmissions] = useState([]);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (User) => {
    //this function checks if user is signedin or signed out
    // if signed in then septs all the details in state obejct or sets null otherwise
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
//clears listener after unmounts
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
  setOutput,
  suburl,
  setSuburl,
  allsubmissions,setAllsubmissions
};
  return (
    <Mycontext.Provider value={providers}>
      {children}
    </Mycontext.Provider>
  );
  //whenever this component is used as wrapper then it's all providers will be availabe for it's children here Entire app
};

export default ContextProvider;
