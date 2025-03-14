import React, {useState, useEffect} from 'react'
import axios from "axios";

function App() {

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:5000/members")
    console.log(response.data.members)
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div>App</div>
  )
}

export default App