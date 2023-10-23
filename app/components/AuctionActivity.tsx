"use client";

import { nounsAuctionHouseABI } from "@/web3/wagmi";
import React, { useState } from "react";
import { useAccount, useContractWrite, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Nft } from "prisma-eth";
import { INounsAuction } from "@momentranks/database/models/revolution/auctions/nouns/INounsAuction";
import { Serialized } from "@momentranks/database/types";
import Image from "next/image";
import { formatEther } from "viem";
import Countdown from "./Countdown";
import { etherscanNetworkUrl, shortenIfEthAddress } from "@momentranks/libs";

export const AuctionActivity = ({
  nft,
  auction,
}: {
  nft: Nft;
  auction: Serialized<INounsAuction>;
}) => {
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const [bidValue, setBidValue] = useState("");

  const { data, isLoading, write } = useContractWrite({
    abi: nounsAuctionHouseABI,
    functionName: "createBid",
    args: [BigInt(877)],
    address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
    //1 eth
    value: BigInt(1000000000000000000),
  });
  const currentBid = formatEther(BigInt(auction.details.highestBid || "0"));
  const minNextBid =
    (parseFloat(currentBid) *
      (100 + parseInt(auction.details.minBidIncrementPercentage))) /
    100;

  const { connect } = useConnect({ connector: new InjectedConnector() });

  const { address } = useAccount();

  const toggleBidHistoryModal = () => {
    setShowBidHistoryModal(!showBidHistoryModal);
  };

  return (
    <div className="flex h-full w-full flex-row items-start justify-center p-10">
      <div className="">
        {nft.imageUrl && (
          <Image
            alt={nft.name || nft.tokenId}
            src={nft.imageUrl}
            width={750}
            height={750}
          />
        )}
      </div>
      <div className="lg:w-[500px] px-5">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-nouns text-7xl">{nft.name}</span>
        </div>

        <div className="rounded py-6 shadow-lg">
          <div className="mb-6 flex items-start flex-row justify-between w-full">
            <div className="w-full">
              <span className="block text-lg font-semibold">Current bid</span>
              <span className="block text-4xl">Ξ {currentBid}</span>
            </div>
            <div className="w-full">
              <span className="block text-lg font-semibold">
                Auction ends in
              </span>
              <Countdown
                size="lg"
                countdownText=""
                className="text-4xl"
                targetTime={new Date(auction.details.endTime).toISOString()}
                tooltipPrefix="Closes on"
              />
            </div>
          </div>

          <div className="mb-5 flex w-full items-center space-x-2 flex-row">
            <input
              type="text"
              value={bidValue}
              onChange={(e) => setBidValue(e.target.value)}
              placeholder={`Ξ ${minNextBid} or more`}
              className="border p-4 text-3xl rounded-xl text-black font-medium w-full"
            />
            <button
              className="bg-blue-500 rounded-xl whitespace-nowrap text-white py-5 text-2xl px-4 ml-2"
              onClick={() => {
                /* your bidding logic here */
              }}
            >
              Place bid
            </button>
          </div>

          <BidHistoryList bids={auction.bidHistory} chainId={auction.chainId} />
        </div>
      </div>
    </div>
  );
};

export const BidHistoryList = ({
  bids,
  chainId,
}: {
  bids: INounsAuction["bidHistory"];
  chainId: number;
}) => {
  return (
    <div className="flex flex-col space-y-4 text-lg">
      {bids.map((bid: any) => (
        <div
          key={bid.transactionHash}
          className="flex flex-row justify-between w-full items-center"
        >
          <div className="flex flex-row items-center space-x-2">
            <Image
              width={30}
              height={30}
              className="rounded-full w-[30px] h-[30px]"
              src="https://revolution.mypinata.cloud/ipfs/bafybeid4lgvz77jt5vat3jcefjt4r7worxxeconuwnuegruos27f344uii"
              alt="Profile Icon"
            />
            <span className="font-medium">
              {shortenIfEthAddress(bid.bidder)}
            </span>
          </div>
          <div className="flex flex-row space-x-3 items-center">
            <div className="font-medium">Ξ {formatEther(bid.bidAmount)}</div>
            <a
              href={etherscanNetworkUrl(bid.transactionHash, chainId)}
              target="_blank"
              rel="noopener noreferrer"
              title="View on Etherscan"
            >
              ↗
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuctionActivity;
