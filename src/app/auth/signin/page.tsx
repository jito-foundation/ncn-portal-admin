"use client";

import React, { useContext } from "react";
import { Badge, Card, Flex, Heading } from "@radix-ui/themes";
import { ChainContext } from "@/components/Provider/ChainContext";
import { ConnectWalletMenu } from "@/components/ConnectWalletMenu";
import { SelectedWalletAccountContext } from "@/components/context/SelectedWalletAccountContext";
import SignIn from "@/components/SignIn";

const SignInPage: React.FC = () => {
  const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">
      <Card className="w-96 rounded-xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-lg">
        <Heading size="4" align="center" className="mb-4 font-semibold">
          Welcome to NCN Portal Admin
        </Heading>
        <Flex align="center" justify="center" gap="3" className="mb-4">
          <Badge color="gray">{currentChainName}</Badge>
        </Flex>
        <div className="flex flex-col gap-4">
          <ConnectWalletMenu>Connect Wallet</ConnectWalletMenu>
          {selectedWalletAccount && <SignIn account={selectedWalletAccount} />}
        </div>
      </Card>
    </div>
  );
};

export default SignInPage;
