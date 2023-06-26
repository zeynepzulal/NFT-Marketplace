
import { ConnectWallet, Web3Button } from "@thirdweb-dev/react";
import { useContract, useContractWrite, useAddress, useClaimedNFTSupply, useUnclaimedNFTSupply, useActiveClaimConditionForWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import Image from "next/image";
import styles from "../styles/Claim.module.css"
import { NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../util/toastConfig";


const nftDropContractAddress = NFT_COLLECTION_ADDRESS

export default function Home() {

  const { contract: nftDrop } = useContract(nftDropContractAddress);
  const address = useAddress();

  const [quantity, setQuantity] = useState(1);

  const unclaimedSupply = useUnclaimedNFTSupply(nftDrop);
  console.log(Number(unclaimedSupply.data));

  const claimedSupply = useClaimedNFTSupply(nftDrop);
  console.log(Number(claimedSupply.data));

  const activeClaimCondition = useActiveClaimConditionForWallet(nftDrop, address)
  console.log("activeClaimCondition", Number(activeClaimCondition?.data?.maxClaimablePerWallet))

  console.log(activeClaimCondition?.data?.currencyMetadata.displayValue);


  return (
    <div className={styles.container}>
      <main className={styles.mintInfoContainer}>

        <div className={styles.imageSide}>
          <Image
            className={styles.image}
            width={400}
            height={400}
            src="/preview.gif"
            alt="Emoji faces NFT preview"
          />
        </div>

        <div className={styles.mintCompletionArea}>
          <div className={styles.mintAreaLeft}>
            Total Minted
          </div>

          <div className={styles.mintAreaRight}>
            <p>
              <b>{Number(claimedSupply.data)} / {Number(unclaimedSupply.data) + Number(claimedSupply.data)} </b>
            </p>
          </div>

          <div>
            <h2>Quantity</h2>
            <div className={styles.quantityContainer}>
              <button
                className={styles.quantityControlButton}
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= 1} //quantity birden küçükse deaktif et dedik.
              >
                -
              </button>

              <h4>{quantity}</h4>

              <button
                className={styles.quantityControlButton}
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= Number(activeClaimCondition?.data?.maxClaimablePerWallet)}
              >

                +

              </button>
            </div>
          </div>

        </div>

        <div className={styles.mintContainer}>
          {Number(unclaimedSupply?.data) + Number(claimedSupply?.data) == Number(claimedSupply.data)
            ?
            <div>
              <h2>Sold Out !!!</h2>
            </div>

            :



            <Web3Button
              contractAddress={nftDropContractAddress}
              action={(contract) => contract.erc721.claim(quantity)}
              onError={(err) => {
                toast(`Error minting NFTs`, {
                  icon: "❌",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
              onSuccess={() => {
                toast(`Succesfully minted NFT!`, {
                  icon: "✅",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}

            >
              Mint NFT Mint  ({Number(activeClaimCondition.data?.currencyMetadata?.displayValue) * quantity} {activeClaimCondition.data?.currencyMetadata?.symbol} )
            </Web3Button>
          }
        </div>

      </main>
    </div>
  );
}
