// src\app\page.tsx
"use server";
import React from 'react'
import ClientComponent from './components/ClientComponent/ClientComponent';


export default async function Page() {

console.log('dfefef')
  return (
   <div className="w-full h-screen bg-gray-100 flex justify-center items-center ">
  
      <ClientComponent/>
    
    </div>
  )
}

