import { useIdentityKit } from "@nfid/identitykit/react";
import React from "react";
import Mint from "../components/Mint";
import DisplayNfts from "../components/DisplayNfts";
import MintImg from "../assets/nftmint.jpg";

const NftMinter = () => {
  const { user } = useIdentityKit();
  return (
    <div className="flex flex-col  items-center h-screen">
      {user ? (
        <Mint />
      ) : (
        <div className="flex flex-row  w-full md:w-3/4  justify-between">
          <div className=" flex mt-20 items-start gap-8 flex-col">
            <h1 className="text-8xl">


            Mint your NFTS 

            <span className="text-sm">
              
              with a few clicks
              </span>
            </h1>
            <button className="border  p-4 rounded-md hover:bg-gray-800">Explore</button>
            
            
            
            
             </div>
 
          <img src={MintImg} alt="" className="rounded-lg mt-16 h-[400px] w-[600px]" />
        </div>
      )}
    </div>
  );
};

export default NftMinter;
