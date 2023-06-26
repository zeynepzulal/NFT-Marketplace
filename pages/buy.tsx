import { useContract, useNFTs } from "@thirdweb-dev/react";
import React, { useState } from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";
import styles from "../styles/Buy.module.css";
import Filter from "../components/Filter/Filter";

export default function Buy() {
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data, isLoading } = useNFTs(contract);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    "backgrounds": "",
    "left eye": "",
    "right eye": "",
    "mouth": ""
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const filterNFTs = (nft: any) => {
    const { attributes } = nft.metadata;
    console.log(nft.metadata);
    return (
      (!selectedFilters["backgrounds"] || attributes.find((attr: any) => attr.trait_type === "backgrounds" && attr.value === selectedFilters["backgrounds"])) &&
      (!selectedFilters["left eye"] || attributes.find((attr: any) => attr.trait_type === "left eye" && attr.value === selectedFilters["left eye"])) &&
      (!selectedFilters["right eye"] || attributes.find((attr: any) => attr.trait_type === "right eye" && attr.value === selectedFilters["right eye"])) &&
      (!selectedFilters["mouth"] || attributes.find((attr: any) => attr.trait_type === "mouth" && attr.value === selectedFilters["mouth"]))
    );
  };

  const filteredData = data?.filter(filterNFTs);

  return (
    <Container maxWidth="lg">
      <div>
        <h1>Buy NFTs</h1>
        <p>Browse which NFTs are available from the collection.</p>
      </div>

      <div>
        <div className={styles.filters}>

          <div className={styles.filter}>
            <Filter
              label="background"
              options={Array.from(
                new Set(
                  filteredData?.flatMap((nft: any) =>
                    nft.metadata.attributes
                      .filter((attr: any) => attr.trait_type === "backgrounds")
                      .map((attr: any) => attr.value)
                  )
                )
              ).sort()}
              value={selectedFilters["backgrounds"]}
              onChange={(value) => handleFilterChange("backgrounds", value)}
            />
          </div>

          <div className={styles.filter}>
            <Filter
              label="left eye"
              options={Array.from(
                new Set(
                  filteredData?.flatMap((nft: any) =>
                    nft.metadata.attributes
                      .filter((attr: any) => attr.trait_type === "left eye")
                      .map((attr: any) => attr.value)
                  )
                )
              ).sort()}
              value={selectedFilters["left eye"]}
              onChange={(value) => handleFilterChange("left eye", value)}
            />
          </div>

          <div className={styles.filter}>
            <Filter
              label="right eye"
              options={Array.from(
                new Set(
                  filteredData?.flatMap((nft: any) =>
                    nft.metadata.attributes
                      .filter((attr: any) => attr.trait_type === "right eye")
                      .map((attr: any) => attr.value)
                  )
                )
              ).sort()}
              value={selectedFilters["right eye"]}
              onChange={(value) => handleFilterChange("right eye", value)}
            />
          </div>

          <div className={styles.filter}>
            <Filter
              label="mouth"
              options={Array.from(
                new Set(
                  filteredData?.flatMap((nft: any) =>
                    nft.metadata.attributes
                      .filter((attr: any) => attr.trait_type === "mouth")
                      .map((attr: any) => attr.value)
                  )
                )
              ).sort()}
              value={selectedFilters["mouth"]}
              onChange={(value) => handleFilterChange("mouth", value)}
            />
          </div>

        </div>
      </div>



      <NFTGrid
        data={filteredData}
        isLoading={isLoading}
        emptyText="Looks like there are no NFTs matching the selected filters."
      />
    </Container>
  );
}