import { useIdentityKit } from "@nfid/identitykit/react";
import React from "react";
import Mint from "../components/Mint";
import DisplayNfts from "../components/DisplayNfts";

const NftMinter = () => {
  const { user } = useIdentityKit();
  return (
    <div className="flex flex-col items-center h-screen">
      {user && <Mint />}
      {user && <DisplayNfts />}
      
    </div>
  );
};

export default NftMinter;
