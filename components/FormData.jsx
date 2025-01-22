'use client'
import React from 'react'
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function FormData() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    
  
    const router = useRouter();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
    
        const res = await fetch("api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            
          }),
        });
  
        if (res.ok) {
          const form = e.target;
          window.alert("credentials added to database");
          form.reset();
          router.push("/");
        } else {
          console.log("User credential login failed.");
          window.alert("error occurred while adding credentials");
        }
      } catch (error) {
        console.log("Error during registration: ", error);
      }
    };
  return (
    <div>
      <div className="flex flex-col pt-20 h-auto">
      <div className="shadow-xl p-5 rounded-lg border-t-4 border-blue-500  w-96">
        <h1 className="text-4xl font-bold my-4 text-blue-600 text-center">Credentials</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input  
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email" className='gap-3'
          />
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name" className='gap-3'
            
          />
          <button className="bg-blue-500 text-white font-bold cursor-pointer px-6 py-2">
            Submit
          </button>
          

          
        </form>
      </div>
    </div>
    </div>
  )
}

