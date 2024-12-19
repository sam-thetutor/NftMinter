import React, { useDebugValue, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { idlFactory as MinterDL } from "../Utils/v2.did";
import { createActor } from "../Utils/createActor";
import { HttpAgent } from "@dfinity/agent";
import { adminIdentity } from "../Utils/admin";
import Resizer from "react-image-file-resizer";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { useIdentityKit } from "@nfid/identitykit/react";
import { computeExtTokenIdentifier } from "../Utils/tid";
import DisplayNfts from "./DisplayNfts";

const agent = new HttpAgent({
  identity: adminIdentity,
  host: "https://ic0.app",
});

const minterCanister = createActor(
  "tx3w6-2iaaa-aaaap-qpm7q-cai",
  MinterDL,
  agent
);

const Mint = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mynfts, setMyNfts] = useState([]);
  const [trigger, setTrigger] = useState("");
  const { user } = useIdentityKit();

  useEffect(() => {
    const fetchNfts = async () => {
      if (!user) return;

      try {
        let accID = AccountIdentifier.fromPrincipal({
          principal: user?.principal,
        }).toHex();

        let nfts = await minterCanister.tokens(accID);
        console.log("nfts :", Array.from(nfts.ok));

        if (nfts.ok) {
          setMyNfts(Array.from(nfts.ok));
        }
      } catch (error) {
        console.log("error in  getting user nfts :", error);
      }
    };

    fetchNfts();
  }, [user, trigger]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setRawImage(file);
    }
  };

  const uploadImage = async () => {
    console.log("minter canister", minterCanister);

    setUploading(true);
    const IMAGETYPE = rawImage.type;
    const CHUNKSIZE = 1900000;
    const imageName = crypto.randomUUID();

    const resizeImage = (img, type) => {
      console.log("resizing image", type);
      return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
          rawImage,
          1000,
          1000,
          type.split("/")[1].toUpperCase(),
          100,
          0,
          (uri) => {
            if (uri) {
              resolve(uri);
            } else {
              reject(new Error("Image resizing failed"));
            }
          },
          "blob",
          200,
          200
        );
      });
    };

    const resizedImageBlob = await resizeImage(image, IMAGETYPE);
    const resizedBuffer = await resizedImageBlob.arrayBuffer();
    const resizedImageArray = new Uint8Array(resizedBuffer);

    const uploadAsset = async (internal, ah, filename) => {
      let pl = [...resizedImageArray];
      var success = true;
      console.log({
        ah,
        ctype: IMAGETYPE,
        filename,
        atype: internal
          ? { direct: [] }
          : { canister: { canister: "", id: 0 } },
        size: pl.length,
      });
      await minterCanister.ext_assetAdd(
        ah,
        IMAGETYPE,
        filename,
        internal ? { direct: [] } : { canister: { canister: "", id: 0 } },
        pl.length
      );
      var c = 0;
      var first = true;
      while (pl.length > CHUNKSIZE) {
        c++;
        success &= await minterCanister.ext_assetStream(
          ah,
          pl.splice(0, CHUNKSIZE),
          first
        );
        if (first) first = false;
      }
      success &= await minterCanister.ext_assetStream(ah, pl, first);
      return success;
    };

    try {
      const thumbUploadedSuccess = await uploadAsset(
        true,
        "thumbnail",
        imageName + "." + IMAGETYPE.split("/")[1]
      );
      const assetUploadedSuccess = await uploadAsset(
        true,
        "fullasset",
        imageName + "." + IMAGETYPE.split("/")[1]
      );
      setUploading(false);
      return thumbUploadedSuccess & assetUploadedSuccess;
    } catch (error) {
      console.error(error);
      setUploading(false);
      console.error("Error uploading image: " + error.message);

      return false;
    }
  };

  const handleMintNFT = async () => {
    const uploadSuccess = await uploadImage();
    if (!uploadSuccess) {
      console.error("Image upload failed");
      return;
    }

    console.log(
      "token identifier :",
      computeExtTokenIdentifier(5, "tx3w6-2iaaa-aaaap-qpm7q-cai")
    );
    const jsonMetadata = {
      name: title,
      desc: description,
    };

    let accID = AccountIdentifier.fromPrincipal({
      principal: user?.principal,
    }).toHex();

    console.log("accout identifier :", accID);

    let _data = [
      [
        accID,

        {
          nonfungible: {
            name: "title",
            asset: "fullasset",
            thumbnail: "thumbnail",

            metadata: [
              {
                json: JSON.stringify(jsonMetadata),
              },
            ],
          },
        },
      ],
    ];

    try {
      const tokenId = await minterCanister.ext_mint(_data);
      setTrigger(Math.random().toString());
      console.log("Minted token ID:", tokenId);
    } catch (err) {
      console.error("error in minting the nft :", err);
    } finally {
      setUploading(false);
      setTitle("");
      setDescription("");
      setImage(null);
      setRawImage(null);
    }
  };

  return (
    <div className="flex flex-col  md:flex-row gap-6 py-6 border px-4 mt-4 mx-4 rounded-lg justify-center">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col mt-8 gap-2">
          <h2>Mint your NFT</h2>
          <input
            type="text"
            className="text-black"
            value={title}
            placeholder="enter title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="text-black"
            value={description}
            placeholder="enter description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <input id="fileInput" type="file" onChange={handleImageChange} />

          <div>
            {uploading ? (
              <ClipLoader color="white" size={20} />
            ) : (
              <button
                onClick={handleMintNFT}
                className="border justify-items-center rounded-lg py-1 px-3 font-bold hover:bg-gray-400"
              >
                Mint
              </button>
            )}
          </div>
        </div>

        {image && (
          <div className="flex h-48 w-72 md:h-64 md:w-96">
            <img src={image} alt="Preview" className="mt-2" />
          </div>
        )}
      </div>
      <div>{user && mynfts && <DisplayNfts mynfts={mynfts} />}</div>
    </div>
  );
};

export default Mint;
