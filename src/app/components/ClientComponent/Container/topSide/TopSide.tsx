import Image from "next/image";
import React from "react";

const TopSide = () => {
  return (
    <div className="relative w-full h-full rounded overflow-hidden">
      {/* <div className="relative rounded overflow-hidden w-full h-full "> */}
        <Image
          className="object-fill w-full hover:scale-110 h-full"
          style={{
            transition: "all 0.5s ease",
            
          }}
          src={
            "https://c589564.parspack.net/c589564//Vanak-Branches-Inside-04.webp"
          }
          alt=""
          priority
          quality={100}
         fill
        />
      {/* </div> */}
    </div>
  );
};

export default TopSide;
