"use client";

import { nounsAuctionHouseABI } from "@/web3/wagmi";
import React, { useState } from "react";
import { useAccount, useContractWrite, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { DynamicProvider } from "@momentranks/libs/user/DynamicProvider";

export const AuctionActivity = () => {
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const { data, isLoading, write } = useContractWrite({
    abi: nounsAuctionHouseABI,
    functionName: "createBid",
    args: [BigInt(877)],
    address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
    //1 eth
    value: BigInt(1000000000000000000),
  });

  const { connect } = useConnect({ connector: new InjectedConnector() });

  const { address } = useAccount();

  const toggleBidHistoryModal = () => {
    setShowBidHistoryModal(!showBidHistoryModal);
  };

  return (
    <div className="bg-gray-200 p-10">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-4xl">Noun 8277</span>
        <button
          onClick={toggleBidHistoryModal}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          View all bids
        </button>
      </div>

      <div className="rounded bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="block text-lg font-bold">Current bid</span>
            <span className="block text-2xl">Ξ 7.00</span>
          </div>
          <div>
            <span className="block text-lg">Auction ends in</span>
            <span className="block text-2xl">11h 36m 53s</span>
          </div>
        </div>

        {auctionEnded ? (
          <div className="text-center text-3xl">Auction Ended</div>
        ) : (
          <button
            onClick={() => {
              console.log({ address });
              if (!address) {
                connect();
              }
              write();
            }}
            className="w-full rounded bg-blue-600 py-4 text-white"
          >
            Place bid
          </button>
        )}
      </div>

      {showBidHistoryModal && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="rounded bg-white p-10 shadow-lg">
            {/* Bid history content goes here */}
            <h2 className="mb-4 text-2xl">Bid History</h2>
            {/* Sample bid entries */}
            <div className="border-b py-2">Bidder 1: Ξ 6.50</div>
            <div className="border-b py-2">Bidder 2: Ξ 6.00</div>
            <button
              onClick={toggleBidHistoryModal}
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionActivity;
