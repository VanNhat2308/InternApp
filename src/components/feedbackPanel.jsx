import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import avatar from "../assets/images/avatar.png";
import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import Avatar from "react-avatar";

function FeedbackPanel() {
  const [messages, setMessages] = useState({});
  const [searchTerm,setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const role = localStorage.getItem('role')
  const path = role === 'Student' ? `/messages/feedback-panel-student`: `messages/feedback-panel`  
  const id = role === 'Student'? localStorage.getItem('maSV') : localStorage.getItem('maAdmin')


  useEffect(() => {
    setLoading(true)
  axiosClient.get(path,{
    params:{
     id : id,
     search:searchTerm
    }
  }
  )
    .then(res => {
      
      setMessages(res.data)

    
    }).catch(err=>{
      console.log(err);
      
    }).finally(()=>{
      setLoading(false)
    })
    
}, [searchTerm]);


  const navigate = useNavigate();
  const userRole = localStorage.getItem('role')
  const handleNavigate = (conversation_id)=>{
    if(userRole === 'Student'){
      navigate(`/student/feedback/conversation/${conversation_id}`)
    }
    else{
      navigate(`/admin/feedback/conversation/${conversation_id}`)
    }
  }

  return (
    <div className="border border-gray-300 lg:rounded-xl shadow-md mt-10 p-4 bg-white max-w-full w-full lg:w-full mx-auto">
      {/* Search */}
      <div className="relative mb-4">
        <input
          onChange={(e)=>setSearchTerm(e.target.value)}
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md transition"
        />
        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Message list */}
      {loading ? (   <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>):(<div className="space-y-3 max-h-[65vh] overflow-y-auto">
        {Object.values(messages).map((msg) => (
          <div
            key={msg.id}
            onClick={()=>handleNavigate(msg.conversation_id)}
            className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition`}
          >
            <div className="flex items-center gap-3">
              <Avatar name={msg.name} round size="32" />
              <div className="flex flex-col">
                <span className="font-medium text-sm md:text-base">{msg.name}</span>
                <span className="text-sm text-gray-500 truncate max-w-[180px]">
                  {msg.preview}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end text-xs text-gray-500 min-w-[60px]">
              {msg.unread && (
                <div className="w-2 h-2 bg-red-500 rounded-full mb-1" />
              )}
              <span>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>)}
    </div>
  );
}

export default FeedbackPanel;
