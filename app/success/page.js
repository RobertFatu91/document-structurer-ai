"use client"

import { useEffect, useState } from "react"

export default function SuccessPage() {

  const [message,setMessage] = useState("Checking payment...")

  useEffect(()=>{

    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get("session_id")

    if(!sessionId){
      setMessage("Missing session")
      return
    }

    fetch("/api/verify-session",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({sessionId})
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.valid){
        localStorage.setItem("isPro","true")
        setMessage("Payment successful. Pro activated.")
      }else{
        setMessage("Payment not verified.")
      }
    })

  },[])

  return(
    <div style={{padding:40,fontFamily:"Arial"}}>
      <h1>Payment</h1>
      <p>{message}</p>
      <a href="/">Back to app</a>
    </div>
  )
}