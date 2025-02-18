"use client";

import React, { useContext, useMemo, useState } from "react";
import { Badge, Button, Dialog, DropdownMenu, Flex, Heading } from "@radix-ui/themes";
import { ChainContext } from "@/components/Provider/ChainContext";
import { ConnectWalletMenu } from "@/components/ConnectWalletMenu";
import { SelectedWalletAccountContext } from "@/components/context/SelectedWalletAccountContext";
import { NO_ERROR } from "@/util/errors";
import SignIn from "@/components/SignIn";

const SignInPage: React.FC = () => {
  const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSignature, setLastSignature] = useState<Uint8Array | undefined>();
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [error, setError] = useState<symbol | any>(NO_ERROR);
  const [isSendingTransaction, setIsSendingTransaction] = useState(false);

  const {
    displayName: currentChainName,
    chain,
    setChain,
  } = useContext(ChainContext);
  const currentChainBadge = (
    <Badge color="gray" style={{ verticalAlign: "middle" }}>
      {currentChainName}
    </Badge>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 bg-gray-900">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="">
          <Flex align="center" gap="3" className="ml-auto">
            <ConnectWalletMenu>Connect Wallet</ConnectWalletMenu>
          </Flex>
          {selectedWalletAccount ? (
            <SignIn account={selectedWalletAccount} />

          ) : (<div></div>)}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
