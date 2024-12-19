import React, { useState } from "react";
import { GiWallet } from "react-icons/gi";
import { FaWallet } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { useIdentityKit } from "@nfid/identitykit/react";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { shortenAddress } from "../Utils/tid";
import { copyToClipboard } from "../Utils/constants";
import { BsCopy } from "react-icons/bs";
import Withdraw from "./Withdraw";

const Balance = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const { user } = useIdentityKit();

  return (
    <div>
      <FaWallet size={23} color="white" onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <div className="fixed inset-0 p-4 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-[#4e4c4c] text-white text-sm rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between border-b-2 ">
              <h2 className=" font-bold text-2xl text-white">Wallet</h2>
              <CgClose
                className="cursor-pointer text-white"
                onClick={() => setIsModalOpen(false)}
              />
            </div>

            <div className="flex mt-6 flex-row gap-2  items-center">
              <span>
                {shortenAddress(
                  AccountIdentifier.fromPrincipal({
                    principal: user.principal,
                  })?.toHex(),
                  18
                )}
              </span>

              <BsCopy
                className="cursor-pointer"
                onClick={() =>
                  copyToClipboard(
                    AccountIdentifier.fromPrincipal({
                      principal: user.principal,
                    })?.toHex()
                  )
                }
              />
            </div>
            <div className="flex mt-2 flex-row gap-2  items-center">
              <span>{user?.principal && shortenAddress(user?.principal.toString())}</span>

              <BsCopy
                className="cursor-pointer"
                onClick={() => copyToClipboard(user.principal)}
              />
              
            </div>

            <Withdraw/>


          </div>
        </div>
      )}
    </div>
  );
};

export default Balance;
