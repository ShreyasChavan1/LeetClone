import React, { useContext, useEffect ,useState} from 'react'
import { Mycontext } from '../conf/context'
import { auth } from '../conf/config'
import { signInWithCustomToken } from 'firebase/auth'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const Submissions = ({extract}) => {
  const {output,setAllsubmissions,allsubmissions,setCode,problem} = useContext(Mycontext)
  const [selectedcode,setSelectedcode] = useState(null)
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const getprev = async() =>{
      const token = await auth.currentUser.getIdToken()
      const prev_submissions = await fetch(`${BACKEND_URL}/Getsubmissions?prob_name=${encodeURIComponent(problem.title)}`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        }
      })
      const data = await prev_submissions.json();
      
      setAllsubmissions(data)
    }
    getprev()
  },[problem.title])
  const getsubmittedcode = async(supabasepath,lang) =>{
    try{
      console.log(supabasepath)
      const submittedcode = await fetch(`${BACKEND_URL}/file/${supabasepath}/Submissions`);
      const Data = await submittedcode.json();
      
      const code = extract(Data,lang);
      console.log(code)
      setSelectedcode(code);
      setShowPopup(true);
    }catch(err){
      console.error("Error while getting submitted code",err)
    }
  }

  return (
    <div className="relative">
      {allsubmissions.length !== 0 ? 

        allsubmissions.map((submission, ind) => (
          <div
            key={ind}
            className={`bg-[#2c2c2c] text-xl font-semibold ${submission.verdict === "Accepted" ? "text-green-500" : "text-red-500"} w-full p-3 cursor-pointer`}
            onClick={() => getsubmittedcode(submission.getfireurl,submission.language)}
          >
            {submission.verdict === "Accepted" ? "Accepted" : "Wrong Answer"}
          </div>
        )) : <p className='text-white'>No Submissions Found</p>}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-5 rounded-lg w-[80%] max-w-3xl shadow-lg">
            <h2 className="text-white text-2xl mb-3 font-bold">Submitted Code</h2>
            <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-700">
              <SyntaxHighlighter
                // language={subm}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{ background: "#1e1e1e", fontSize: "14px" }}
              >
                {selectedcode || "// No code found"}
              </SyntaxHighlighter>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Submissions

// const isAccepted = submission.verdict === "Accepted";
// const displayDate = submission.date ? new Date(submission.date).toLocaleDateString() : "";
// {isAccepted ? `Accepted On ${displayDate}` : "Wrong Answer"}

