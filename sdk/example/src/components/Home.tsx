import React, { useEffect, useState } from "react";
import { num } from "starknet";
import {
  TokenboundClient,
  Call,
  TBAVersion,
  TBAChainID,
} from "starknet-tokenbound-sdk";
import { useAccount, useConnect } from "@starknet-react/core";
import FormatAddress from "./Address";
import { disconnect } from "starknetkit";

function Home() {
  const [deployStatus, setDeployStatus] = useState<boolean>();
  const [accountClassHash, setAccountClassHash] = useState<string>();
  const [tbaAccount, setTbaAccount] = useState<string | undefined>("");
  const [owner, setOwner] = useState<string>("");
  const [nftOwner, setNftOwner] = useState<string>();
  const [nftOwnerId, setNftOwnerId] = useState<string>();
  const [txHash, setTxHash] = useState<string>("");
  const [lockStatus, setLockStatus] = useState<boolean>();
  const [permissionStatus, setPermissionStatus] = useState<boolean | null>();
  const [timeUntilUnlocks, setTimeUntilUnlocks] = useState<string>();

  const V2_SALT = "";

  // replace with your own permissioned address
  const testPermissionedAddr: string = "";

  const { connect, connectors } = useConnect();
  const { address, account } = useAccount();

  const registryAddress: string = "";
  const implementationAddress: string = "";

  const [tokenbound, setTokenbound] = useState<TokenboundClient | null>(null);

  useEffect(() => {
    // configuration
    if (account) {
      const options = {
        account: account,
        registryAddress: registryAddress,
        implementationAddress: implementationAddress,
        version: TBAVersion.V3,
        chain_id: TBAChainID.main,
        jsonRPC: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
      };
      const client = new TokenboundClient(options);
      setTokenbound(client);
    }
  }, [account]);

  const tokenContract = "";
  const tokenId = "";
  const url = `https://sepolia.starkscan.co/contract/${account}`;

  const deployAccount = async () => {
    if (tokenbound) {
      try {
        // TODO
      } catch (error) {
        console.log(error);
      }
    }
  };

  const execute = async () => {
    try {
      // TO DO
    } catch (error) {
      console.log(error);
    }
  };

  // transfer ETH to your tokenbound account and replace here
  const transferERC20 = async () => {
    try {
      // TO DO
      alert("Transfer was successful");
    } catch (error) {
      console.log(error);
    }
  };

  // transfer an NFT to your tokenbound account and replace here
  const transferNFT = async () => {
    try {
      //  TO DO
      alert("Transfer was successful");
    } catch (error) {
      console.log(error);
    }
  };

  // replace with a valid timestamp
  const lockAccount = async () => {
    try {
      //  TO DO
      alert("Account was locked successfully");
    } catch (error) {
      console.log(error, "lock");
    }
  };

  // upgrades (or less) downgrades to V2
  const upgradeAccount = async () => {
    try {
      //  TO DO
      alert("Account was upgraded successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const setPermissions = async () => {
    try {
      //  TO DO
      alert("Permissions added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (tbaAccount && deployStatus) {
      // const getAccountOwner = async () => {
      //   const nftowner = await tokenbound?.getOwner({
      //     tbaAddress: tbaAccount,
      //   });
      //   setOwner(num.toHex(nftowner));
      // };
      // const getNFTOwner = async () => {
      //   const nftowner = await tokenbound?.getOwnerNFT(tbaAccount as string);
      //   setNftOwner(num.toHex(nftowner[0]));
      //   setNftOwnerId(nftowner[1].toString());
      // };
      // getAccountOwner();
      // getNFTOwner();
    }
  }, [tbaAccount, deployStatus]);

  useEffect(() => {
    if (tbaAccount && deployStatus) {
      // const getLockStatus = async () => {
      //   const isLocked = await tokenbound?.isLocked({
      //     tbaAddress: tbaAccount,
      //   });
      //   setLockStatus(Boolean(isLocked[0]));
      //   setTimeUntilUnlocks(isLocked[1].toString());
      // };
      // const getAccountPermissions = async () => {
      //   const permission = await tokenbound?.getPermission({
      //     tbaAddress: tbaAccount,
      //     owner: owner,
      //     permissionedAddress: testPermissionedAddr,
      //   });
      // if (permission != null) {
      //   setPermissionStatus(permission);
      // }
      // };
      // getAccountPermissions();
      // getLockStatus();
    }
  }, [tbaAccount, owner, deployStatus]);

  useEffect(() => {
    // const getAccount = async () => {
    //   const account = await tokenbound?.getAccount({
    //     tokenContract: tokenContract,
    //     tokenId: tokenId,
    //     salt: V2_SALT,
    //   });
    //   setTbaAccount(num.toHexString(account ?? ""));
    // };
    // const getDeploymentStatus = async () => {
    //   const status = await tokenbound?.checkAccountDeployment({
    //     tokenContract,
    //     tokenId,
    //     salt: V2_SALT,
    //   });
    //   setDeployStatus(status?.deployed);
    //   setAccountClassHash(status?.classHash);
    // };
    // getAccount();
    // getDeploymentStatus();
  }, [tokenContract]);

  return (
    <div className="">
      <section className="App-header py-10">
        <h1 className="my-2 text-gray-300">Testing Tokenbound SDK</h1>

        <div>
          {!address &&
            connectors.map((connector) => (
              <button
                key={connector.id}
                className="bg-blue-400 rounded-md px-2 mr-5 py-2"
                onClick={() => connect({ connector })}
              >
                Connect {connector.id}
              </button>
            ))}

          {account && (
            <button
              className="bg-blue-400 rounded-md px-2 mr-5 py-2"
              onClick={async () => await disconnect()}
            >
              <FormatAddress address={address} />
              Disconnect
            </button>
          )}
        </div>
        <br />
        <div className="space-y-4 py-10">
          <div className=" flex gap-2">
            <p className="text-[18px]">NFT Contract:</p>
            <FormatAddress address={tokenContract} />
          </div>

          <p className="text-lg">
            Token ID: <span className="text-bold">{tokenId}</span>
          </p>
          <div className="flex items-center gap-2">
            <p className="text-lg ">Tokenbound Account: </p>
            <a className="text-[#61dafb]" href={url} target="_blank">
              {" "}
              <FormatAddress address={tbaAccount} />
            </a>
          </div>
          <p className="text-lg">
            Deployed: [Status: {deployStatus?.toString()}]
          </p>
          <div className="flex items-center gap-2">
            <p className="text-lg"> ClassHash:</p>
            <FormatAddress address={accountClassHash} />
          </div>
          <p className="text-lg">
            Locked Status: [Status: {lockStatus?.toString()}, Time until
            unlocks: {timeUntilUnlocks} secs]
          </p>
          <p className="text-lg">
            Permission Status: [Status: {permissionStatus?.toString()}]
          </p>
          <div className="flex items-center gap-2">
            <p className="text-lg">Account Owner:</p>
            <FormatAddress address={owner} />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-lg">NFT Owner Contract:</p>
            <FormatAddress address={nftOwner} />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-lg">NFT Owner ID:</p>
            <FormatAddress address={nftOwnerId} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={deployAccount}
            className="bg-blue-400 text-medium  rounded-lg px-2 mr-5 py-1"
          >
            Deploy
          </button>

          <button
            onClick={execute}
            className="bg-green-400 text-medium  rounded-lg px-2 mr-5 py-2"
          >
            execute txn
          </button>
          <button
            onClick={transferERC20}
            className="bg-blue-800 text-medium  rounded-lg px-2 mr-5 py-2"
          >
            send ERC20
          </button>

          <button
            onClick={transferNFT}
            className="bg-yellow-500 text-medium rounded-lg px-2 py-2"
          >
            send NFT
          </button>

          <button
            onClick={lockAccount}
            className="bg-yellow-500 text-medium rounded-lg px-2 py-2"
          >
            Lock
          </button>

          <button
            onClick={upgradeAccount}
            className="bg-orange-500 text-medium rounded-lg px-2 py-2"
          >
            Upgrade
          </button>

          <button
            onClick={setPermissions}
            className="bg-orange-500 text-medium rounded-lg px-2 py-2"
          >
            Set Permissions
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
