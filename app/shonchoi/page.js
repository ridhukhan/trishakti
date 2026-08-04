"use client"
import { useState } from "react"
export default function shonchoi(){
const [showpopup,setShowpopup]=useState(false)
const [name,setName]=useState("")
const [adress,setAdress]=useState("")
const[list,setList]=useState([])
    const popup = (e)=>{
        e.preventDefault()
        setShowpopup(true)
    }

    const handlesave=(e)=>{
        e.preventDefault()
        if(!name || !adress){
            return alert("someone missing")
        }
        setList([...list,{
            name,adress
        }])
        setName("")
        setAdress("")
setShowpopup(false)    }
return(

    <div>
<nav className="bg-red-700 h-10 font-bold text-center text-3xl">
    <h1>সঞ্চয়
           হিসাব</h1>


</nav>
<div className="gap-2">
{
    list.map((item,index)=>(
        <div key={index} className="flex gap-2 
        rounded-2xl justify-center ml-20
        
        w-80
         mt-3.5 text-center bg-amber-500">
            <h1 className="font-bold text-3xl">{item.name}</h1>
<p>{item.adress}</p>
        </div>
    ))
}
</div>
<div className="text-center text-3xl font-bold text-red-600">
    <button onClick={popup}>+</button>
</div>
{showpopup && (
    <div className="fixed inset-0 bg-red-600 flex items-center justify-center">
<div className="bg-white p-5 rounded-lg w-80">
<h2>NEW ENTRY</h2>
<input type="text" name="name" 
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Enter name" className="border w-full p-2 mb-2 rounded"/>
<input type="text" name="address"
value={adress}
onChange={(e)=>setAdress(e.target.value)}
placeholder="Enter address" className="border w-full p-2 mb-2 rounded"/>
<div className="flex justify-between">
<button onClick={handlesave}>SAVE</button>
<button onClick={()=>setShowpopup(false)}>CANCEL</button>

</div>
</div>
    </div>
)}
    </div>
)
}