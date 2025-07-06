// src/app/components/ClientComponent/ClientComponent.tsx
"use client";

import CenterSide from "./Container/centerSide/CenterSide";
import TopSide from "./Container/topSide/TopSide";

import styles from '@/styles/center.module.scss'

const ClientComponent = () => {
 
  return (
   <div className={` ${styles.container} w-full md:w-[80%] lg:w-[60%] xl:w-[45%] flex flex-col mx-auto items-center h-[90%] rounded-3xl overflow-y-auto relative`}>

    <div className="top h-[250px]  w-full">
      <TopSide/>
    </div>
    <div className={`  ${styles.container_center}`}>
      <CenterSide/>
    </div>
   


   </div>
  );
};

export default ClientComponent;
