import AuctionActivity from "./components/AuctionActivity";
import { NounishAuctions } from "@momentranks/database/models/revolution/auctions/nouns/NounsAuctions";
import { serializeSync } from "@momentranks/database";
import { notFound } from "next/navigation";

export default async function Home() {
  const revolutionId = "nouns";
  const auction = await NounishAuctions().getLatestAuction(revolutionId);

  const nft = await auction.nft();

  if (!nft) {
    notFound();
  }

  console.log({ auction, nft });

  return (
    <main className="flex min-h-screen w-full h-full flex-col items-center justify-between">
      <AuctionActivity nft={nft} auction={serializeSync(auction)} />
    </main>
  );
}
