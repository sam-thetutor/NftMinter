import React, { useEffect, useState } from "react";
import { computeExtTokenIdentifier } from "../Utils/tid";

const DisplayNfts = ({ mynfts }) => {
  const [token, setToken] = useState("");

  console.log("dsbnidus b :", mynfts);

  useEffect(() => {
    const data = computeExtTokenIdentifier(0, "tx3w6-2iaaa-aaaap-qpm7q-cai");
    setToken(data);
  }, []);

  return (
    <div className="flex pt-6 flex-col justify-center items-center">
      <h1 className="text-lg p-2 font-bold flex">

      My NFTS
      </h1>
      <div className="flex-grow flex gap-4  justify-center items-center flex-wrap w-full h-[70vh] overflow-y-auto">
        {mynfts?.length > 0
          ? mynfts.map((nft, index) => (
              <div key={index} className="flex h-64 w-64">
                <img
                  src={`https://tx3w6-2iaaa-aaaap-qpm7q-cai.raw.icp0.io/?tokenid=${computeExtTokenIdentifier(
                    nft,
                    "tx3w6-2iaaa-aaaap-qpm7q-cai"
                  )}
&type=fullasset`}
                  alt=""
                  className="border rounded-lg p-1"
                />
              </div>
            ))
          : "no nfts"}
      </div>
    </div>
  );
};

export default DisplayNfts;
