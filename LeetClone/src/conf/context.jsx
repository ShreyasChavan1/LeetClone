// ContextProvider.jsx
import { createContext, useState ,useEffect, useRef} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";
import io from 'socket.io-client'

export const Mycontext = createContext();

const ContextProvider = ({ children }) => {
  //all the varibles needed to have access throughout the project will be declared here and this
  //provider is then wrapped around the app so that entire app can have acces to these
  const [navBar, setNavBar] = useState(true);
  const [currentuser,setCurrentuser] = useState({});
  const [problems, setProblems] = useState([]);
  const [problem,setProblem] = useState([]);
  const [code,setCode] = useState("");
  const [language,setLanguage] = useState("python");
  const [output,setOutput] = useState("");
  const [solvedQuestions,setSolvedQuestions] = useState([])
  const [allsubmissions,setAllsubmissions] = useState([]);
  const [status,setStatus] = useState("");
  const [verdict,setVerdict] = useState("");
  const suburl = useRef("")
  const socketRef = useRef(null);
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

useEffect(() => {
  socketRef.current = io("http://localhost:4000");

  socketRef.current.on("connect", () => {
    console.log("✅ Connected to WebSocket server:", socketRef.current.id);
  });

  const handler = async (data) => {
    console.log(data)
    console.log("Handler fired:", data, "suburl:", suburl.current);
    if (data.submissionId === suburl.current) {
      setStatus(data.status || "Processing");
      setVerdict(data.verdict || "Pending");
    }
    if(data.verdict !== 'Accepted'){
      const sub = await fetch(`http://localhost:4000/status/${encodeURIComponent(suburl.current)}`)
      const res = await sub.json();
      setOutput(res.result)
    }
  };

  socketRef.current.on('jobUpdate', handler);

  return () => {
    if (socketRef.current) {
      socketRef.current.off('jobUpdate', handler);
      socketRef.current.disconnect();
    }
  };
}, []); // Run once to establish connection

useEffect(() => {
  if (socketRef.current && suburl.current) {
    console.log("changed submissionid ",suburl.current)
    socketRef.current.emit('joinSubmission', suburl.current);
  }
}, [suburl]);

  const providers = {
  navBar,setNavBar,
  currentuser,setCurrentuser,
  problem,setProblem,
  code,setCode,
  language,setLanguage,
  output,setOutput,
  suburl,socketRef,
  allsubmissions,setAllsubmissions,
  problems,setProblems,
  solvedQuestions,setSolvedQuestions,
  status,setStatus,
  verdict,setVerdict,
};
  return (
    <Mycontext.Provider value={providers}>
      {children}
    </Mycontext.Provider>
  );
  //whenever this component is used as wrapper then it's all providers will be availabe for it's children here Entire app
};

export default ContextProvider;
