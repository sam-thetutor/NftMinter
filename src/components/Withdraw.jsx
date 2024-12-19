import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { CgClose } from "react-icons/cg";
import { Principal } from "@dfinity/principal";
import { useAgent, useIdentity, useIdentityKit } from "@nfid/identitykit/react";
import {
  isPrincipalOrAccount,
  MY_LEDGER_CANISTER_ID,
} from "../Utils/constants";
import { idlFactory as ICPDL } from "../Utils/icptoken.did";
import { createActor } from "../Utils/createActor";
import { PiHandWithdrawBold } from "react-icons/pi";
import { HttpAgent } from "@dfinity/agent";

const agent = new HttpAgent({ host: "https://ic0.app", retryTimes: 10 });
const icpActor = createActor(MY_LEDGER_CANISTER_ID, ICPDL, agent);

const Withdraw = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [refetchBalance, setRefetchBalance] = useState("");

  const [icpBalance, setIcpBalance] = useState(0);

  const { user } = useIdentityKit();

  // const authenticatedAgent = useAgent();

  const identity = useIdentity();
  const authenticatedAgent = HttpAgent.createSync({
    host: "https://ic0.app",
    identity: identity,
  });

  // Fetch data using React Query

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) return;
      try {
        setBalanceLoading(true);

        let balance = await icpActor.icrc1_balance_of({
          owner: user.principal,
          subaccount: [],
        });
        console.log("rs", balance);
        setIcpBalance(Number(balance) / 1e8);
      } catch (error) {
        console.log("Error in fetching balance", error);
      }
      setBalanceLoading(false);
    };
    fetchBalance();
  }, [user, refetchBalance]);

  //   const { mutateAsync: handleWithdraw } = useMutation({
  //     mutationFn: (e) => processWithdraw(e),
  //     onSuccess: async () => {
  //       setButtonLoading(false);
  //     },
  //   });

  const displayNotificationModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  const processWithdraw = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    if (!authenticatedAgent) {
      return;
    }
    let isPrincipal = isPrincipalOrAccount(recipient);

    try {
      const IcpActor = createActor(
        MY_LEDGER_CANISTER_ID,
        ICPDL,
        authenticatedAgent
      );

      let transferResults;

      if (isPrincipal === "pa") {
        transferResults = await IcpActor.icrc1_transfer({
          to: { owner: Principal.fromText(recipient), subaccount: [] },
          fee: [],
          memo: [],
          from_subaccount: [],
          created_at_time: [],
          amount: Number(amount) * 1e8,
        });
      } else if (isPrincipal === "ac") {
        transferResults = await IcpActor.send_dfx({
          to: recipient,
          fee: { e8s: 10000 },
          memo: 1234,
          from_subaccount: [],
          created_at_time: [],
          amount: { e8s: Number(amount) * 1e8 },
        });
      }

      if (transferResults.Ok) {
        displayNotificationModal("ICP transfer successful", "success");
      } else if (typeof transferResults === "bigint") {
        displayNotificationModal("ICP transfer successful", "success");
      } else {
        displayNotificationModal(transferResults.Err, "error");
      }
    } catch (error) {
      console.error("Error in sending ICP:", error);
      displayNotificationModal(
        "An error occurred during the transfer",
        "error"
      );
    }

    setButtonLoading(false);
    setRefetchBalance(Math.random());
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setPreviewOpen(true);
  };

  return (
    <div className="relative flex  flex-row gap-1 text-white">
      <div className="flex flex-col w-full ">
        {/* <span className="font-bold">Balance</span> */}

        <div className="flex flex-row mt-3 justify-between w-full items-center">
          <span>
            {balanceLoading ? (
              <ClipLoader size={15} color="white" />
            ) : (
              icpBalance?.toFixed(5)
            )}{" "}
            ICP
          </span>

          <button
            className="border p-1 rounded-sm"
            onClick={() => setIsModalOpen(true)}
          >
            Withdraw
          </button>
          {/* <PiHandWithdrawBold
            size={20}
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          /> */}
        </div>
        {/* <span>{userIcpBalance && userIcpBalance} ICP</span> */}
      </div>

      {/* Modal for withdrawal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          {/* Notification Modal */}
          {showModal && (
            <div
              className={`absolute text-xs top-10 z-50 left-1/2 transform -translate-x-1/2 transition-transform duration-500 ease-out ${
                modalType === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              } rounded-lg p-1`}
            >
              <p>{modalMessage}</p>
            </div>
          )}

          {/* Preview or Input Form */}
          {isPreviewOpen ? (
            <PreviewSection
              recipient={recipient}
              amount={amount}
              buttonLoading={buttonLoading}
              onWithdraw={processWithdraw}
              onClose={() => {
                setIsModalOpen(false);
                setPreviewOpen(false);
              }}
            />
          ) : (
            <InputSection
              recipient={recipient}
              amount={amount}
              buttonLoading={buttonLoading}
              onPreview={handlePreview}
              onRecipientChange={setRecipient}
              onAmountChange={setAmount}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

const InputSection = ({
  recipient,
  amount,
  buttonLoading,
  onPreview,
  onRecipientChange,
  onAmountChange,
  onClose,
}) => (
  <div className="bg-[#252525] rounded-lg text-sm shadow-lg p-6 w-96">
    <div className="flex justify-between">
      <h2 className="mb-4">Withdraw ICP</h2>
      <CgClose className="cursor-pointer" onClick={onClose} />
    </div>

    <form onSubmit={onPreview}>
      <input
        type="text"
        id="recipient"
        value={recipient}
        placeholder="Enter principal address or account identifier"
        onChange={(e) => onRecipientChange(e.target.value)}
        className="border border-white text-black rounded p-1 w-full mb-4"
        required
      />
      <input
        type="number"
        id="amount"
        value={amount}
        placeholder="Enter amount"
        onChange={(e) => onAmountChange(e.target.value)}
        className="border border-white text-black rounded p-1 w-full mb-4"
        required
      />
      <div className="flex justify-end">
        {buttonLoading ? (
          <ClipLoader color="white" size={20} />
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black rounded"
          >
            Preview
          </button>
        )}
      </div>
    </form>
  </div>
);
const shortenAddress = (address) =>
  `${address.slice(0, 15)}...${address.slice(-10)}`;

// Component for Preview Section
const PreviewSection = ({
  recipient,
  amount,
  buttonLoading,
  onWithdraw,
  onClose,
}) => (
  <div className="bg-[#252525] text-sm rounded-lg shadow-lg p-6 w-96">
    <div className="flex justify-between">
      <h2 className="text-xl border-b w-full mb-4">Withdraw Preview</h2>
      <CgClose className="cursor-pointer" onClick={onClose} />
    </div>

    <div className="flex text-sm flex-col gap-1 w-full">
      <DetailItem label="Destination:" value={shortenAddress(recipient)} />
      <DetailItem label="Amount:" value={`${amount} ICP`} />
      <DetailItem label="Fee:" value="0.0001 ICP" />
    </div>

    <div className="flex mt-3 justify-end">
      {buttonLoading ? (
        <ClipLoader color="white" size={20} />
      ) : (
        <button
          onClick={onWithdraw}
          className="px-4 py-2 bg-white text-black rounded"
        >
          Send
        </button>
      )}
    </div>
  </div>
);

// Component for displaying detail items in the preview section
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span>{label}</span>
    <span className="flex text-gray-400">{value}</span>
  </div>
);

export default Withdraw;
