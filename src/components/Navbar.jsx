import { ConnectWallet, useIdentityKit } from "@nfid/identitykit/react";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaTimes } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import Balance from "./Balance";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connect, user, disconnect } = useIdentityKit();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" mx-4 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">CMint</div>
        <div className=" hidden md:flex text-black font-semibold justify-center items-center gap-1 text-lg   p-1 rounded-md cursor-pointer">
          {user?.principal ? (
            <div className="flex flex-row justify-center border px-4 py-1 rounded-md items-center gap-8">
              <Balance />
              <LuLogOut onClick={() => disconnect()} color="white" size={23} />
            </div>
          ) : (
            <div className="flex font-semibold justify-center text-white items-center gap-1 text-lg border  p-1 rounded-md cursor-pointer">
              <button onClick={() => connect()}>Login</button>
            </div>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        user?.principal ? (
          <div className="flex flex-row mt-6 justify-center border px-4 py-1 rounded-md items-center gap-8">
            <Balance />
            <LuLogOut onClick={() => disconnect()} color="white" size={23} />
          </div>
        ) : (
          <div className="flex mt-6 font-semibold justify-center text-white items-center gap-1 text-lg border  p-1 rounded-md cursor-pointer">
            <button onClick={() => connect()}>Login</button>
          </div>
        )
      )
      
      }
    </nav>
  );
};

export default Navbar;
