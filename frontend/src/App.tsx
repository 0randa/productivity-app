import React, {useState, useEffect} from 'react'
import axios from "axios";

function App() {
  const [array, setArray] = useState([])

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/members")
    console.log(response.data.members)
    setArray(response.data.members);
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div>
      <p>
        {array.map((user, index) => (
          <span key={index}>{user}</span>
          ))}
      </p>
    </div>
  )
}

export default App