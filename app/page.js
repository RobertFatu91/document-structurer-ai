"use client";

import { useState } from "react";

export default function Home() {

const [text,setText] = useState("")
const [result,setResult] = useState("")
const [mode,setMode] = useState("Meeting Notes")

async function transform(){

const res = await fetch("/api/ai",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify({text,mode})
})

const data = await res.json()
setResult(data.result)

}

function downloadTXT(){

const element = document.createElement("a")
const file = new Blob([result],{type:"text/plain"})
element.href = URL.createObjectURL(file)
element.download = "structured.txt"
document.body.appendChild(element)
element.click()

}

function copyText(){

navigator.clipboard.writeText(result)

}

return (

<div style={{maxWidth:"900px",margin:"auto",padding:"40px",fontFamily:"Arial"}}>

<h1 style={{fontSize:"42px",fontWeight:"700",marginBottom:"10px"}}>
Turn messy notes into structured reports in seconds
</h1>

<p style={{fontSize:"18px",color:"#555",marginBottom:"30px"}}>
Perfect for freelancers, consultants and contractors who deal with messy meeting notes, client calls or raw ideas.
</p>

<div style={{display:"flex",gap:"25px",marginBottom:"40px",flexWrap:"wrap"}}>

<div>⚡ Turn messy notes into structured reports</div>
<div>📋 Extract action items automatically</div>
<div>✉ Convert notes into professional emails</div>

</div>

<h2 style={{marginBottom:"10px"}}>Mode</h2>

<select
value={mode}
onChange={(e)=>setMode(e.target.value)}
style={{padding:"10px",marginBottom:"20px"}}
>

<option>Meeting Notes</option>
<option>Professional Email</option>
<option>Task List</option>
<option>Summary</option>

</select>

<h2>Paste text</h2>

<textarea
value={text}
onChange={(e)=>setText(e.target.value)}
placeholder="meeting with client
need invoice
prepare contract
call supplier tomorrow"
style={{
width:"100%",
height:"150px",
padding:"10px",
marginTop:"10px",
marginBottom:"20px"
}}
/>

<div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>

<button
onClick={transform}
style={{
background:"black",
color:"white",
padding:"10px 20px",
border:"none",
cursor:"pointer"
}}
> 
Transform
</button>

<button
onClick={copyText}
style={{
padding:"10px 20px",
cursor:"pointer"
}}
> 
Copy
</button>

<button
onClick={downloadTXT}
style={{
padding:"10px 20px",
cursor:"pointer"
}}
> 
DownloadTXT
</button>

</div>

<h2 style={{marginTop:"40px"}}>Result</h2>

<pre style={{
background:"#f4f4f4",
padding:"20px",
whiteSpace:"pre-wrap",
marginTop:"10px"
}}>
{result || "Your structured result will appear here."}
</pre>

</div>

)

}