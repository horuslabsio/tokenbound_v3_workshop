import React, { useEffect, useState } from "react";
import { cairo, num } from "starknet";
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

  const SALT = "230000000";

  // replace with your own permissioned address
  const testPermissionedAddr: string =
    "0x010f7970496Dc785b89fb692cD80a2d8591ee6C2616C0C331Ae9Cf36D77CC135";

  const { connect, connectors } = useConnect();
  const { address, account } = useAccount();

  const [tokenbound, setTokenbound] = useState<TokenboundClient | null>(null);

  useEffect(() => {
    // configuration
    if (account) {
      const options = {
        account: account,
        version: TBAVersion.V3,
        chain_id: TBAChainID.main,
        jsonRPC:
          "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/tiuYdkP4DRSPX1otnf6jf7eraBLAgF6s",
      };
      const client = new TokenboundClient(options);
      setTokenbound(client);
    }
  }, [account]);

  const tokenContract =
    "0x05c20131088071b6dba22127758a273da1941d018bcb19472d741d947e3b35c6";
  const tokenId = "77181798961753142530";
  const url = `https://starkscan.co/contract/${tbaAccount}`;

  const deployAccount = async () => {
    if (tokenbound) {
      try {
        const response = await tokenbound.createAccount({
          tokenContract,
          tokenId,
          salt: SALT,
        });
        setTxHash(response.transaction_hash);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const execute = async () => {
    let recipient: string =
      "0x010f7970496Dc785b89fb692cD80a2d8591ee6C2616C0C331Ae9Cf36D77CC135";
    let amount = "100000000000000000";
    const call: Call = {
      to: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      selector:
        "0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e",
      calldata: [recipient, amount],
    };

    try {
      await tokenbound?.execute(tbaAccount ?? "", [call]);
    } catch (error) {
      console.log(error);
    }
  };

  const STRK_ADDRESS: string =
    "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
  const RECIPIENT: string =
    "0x010f7970496Dc785b89fb692cD80a2d8591ee6C2616C0C331Ae9Cf36D77CC135";
  // transfer ETH to your tokenbound account and replace here
  const transferERC20 = async () => {
    try {
      await tokenbound?.transferERC20({
        tbaAddress: tbaAccount ?? "",
        contractAddress: STRK_ADDRESS,
        recipient: RECIPIENT,
        amount: "100000000000000000",
      });
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
      await tokenbound?.lock({
        tbaAddress: tbaAccount as string,
        lockUntill: 1734015965,
      });
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
      await tokenbound?.setPermission({
        tbaAddress: tbaAccount as string,
        permissionedAddresses: [testPermissionedAddr],
        permissions: [true],
      });
      alert("Permissions added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Account and tba owner
  useEffect(() => {
    if (tbaAccount && deployStatus) {
      const getAccountOwner = async () => {
        const nftowner = await tokenbound?.getOwner({
          tbaAddress: tbaAccount,
        });
        setOwner(num.toHex(nftowner));
      };
      const getNFTOwner = async () => {
        const nftowner = await tokenbound?.getOwnerNFT(tbaAccount as string);
        setNftOwner(num.toHex(nftowner[0]));
        setNftOwnerId(nftowner[1].toString());
      };
      getAccountOwner();
      getNFTOwner();
    }
  }, [tbaAccount, deployStatus]);

  // fetch tokenbound locked and permission status
  useEffect(() => {
    if (tbaAccount && deployStatus) {
      const getLockStatus = async () => {
        const isLocked = await tokenbound?.isLocked({
          tbaAddress: tbaAccount,
        });
        setLockStatus(Boolean(isLocked[0]));
        setTimeUntilUnlocks(isLocked[1].toString());
      };
      const getAccountPermissions = async () => {
        const permission = await tokenbound?.getPermission({
          tbaAddress: tbaAccount,
          owner: owner,
          permissionedAddress: testPermissionedAddr,
        });
        if (permission != null) {
          setPermissionStatus(permission);
        }
      };
      getAccountPermissions();
      getLockStatus();
    }
  }, [tbaAccount, owner, deployStatus]);

  // fetch account address and deployment status
  useEffect(() => {
    const getAccount = async () => {
      const account = await tokenbound?.getAccount({
        tokenContract: tokenContract,
        tokenId: tokenId,
        salt: SALT,
      });
      console.log(account);
      setTbaAccount(num.toHexString(account ?? ""));
    };
    const getDeploymentStatus = async () => {
      const status = await tokenbound?.checkAccountDeployment({
        tokenContract,
        tokenId,
        salt: SALT,
      });
      setDeployStatus(status?.deployed);
      setAccountClassHash(status?.classHash);
    };
    getAccount();
    getDeploymentStatus();
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
