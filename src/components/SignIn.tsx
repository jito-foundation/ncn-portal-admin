"use client";

import React, { useContext, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@solana/react";
import { Badge, Button, Dialog, DropdownMenu, Flex, Heading } from "@radix-ui/themes";
import NextLink from "next/link";
import { ChainContext } from "@/components/Provider/ChainContext";
import { ConnectWalletMenu } from "@/components/ConnectWalletMenu";
import { SelectedWalletAccountContext } from "@/components/context/SelectedWalletAccountContext";
import { NO_ERROR } from "@/util/errors";
import { UiWalletAccount } from "@wallet-standard/react";

type Props = Readonly<{
    account: UiWalletAccount;
}>;

const SignIn = ({ account }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
    const signIn = useSignIn(account);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [lastSignature, setLastSignature] = useState<Uint8Array | undefined>();
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const [error, setError] = useState<symbol | any>(NO_ERROR);
    const [isSendingTransaction, setIsSendingTransaction] = useState(false);

    // const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //   event.preventDefault();

    //   const callbackUrl = searchParams.get("callbackUrl") || "/";

    //   try {
    //     const response = await signIn("credentials", {
    //       redirect: false,
    //       username,
    //       password,
    //       callbackUrl,
    //     });
    //     if (response?.error) {
    //       setErrorMessage("Sign-in failed. Please check your credentials.");
    //     } else {
    //       setErrorMessage(null);
    //       router.push(callbackUrl);
    //     }
    //   } catch (err) {
    //     setErrorMessage("An unexpected error occurred. Please try again.");
    //   }
    // };

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

    const request = async (requestType: string) => {
        const url = "/api/login";

        const data = {
            requestType,
            address: selectedWalletAccount?.address,
            domain: window.location.host,
        };

        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setError(NO_ERROR);
        setIsSendingTransaction(true);
        try {
            const resMessage = await request("getSiwsMessage");
            const messageJson = await resMessage.json();
            const { account, signedMessage, signature } = await signIn(
                messageJson.data,
            );

            const url = "/api/login";

            const data = {
                requestType: "validateAndVerify",
                domain: window.location.host,
                address: account.address,
                account,
                signedMessage,
                signature,
            };

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (json.data) {
                // login!();
                const callbackUrl = searchParams.get("callbackUrl") || "/";
                router.push(callbackUrl);
            } else {
                setError({ message: "You are not whitelisted" });
            }
        } catch (e) {
            setLastSignature(undefined);
            setError({ message: "You are not whitelisted" });
        } finally {
            setIsSendingTransaction(false);
        }
    };

    return (
        <div>
            {selectedWalletAccount ? (
                <Dialog.Root
                    open={!!lastSignature}
                    onOpenChange={(open) => {
                        if (!open) {
                            setLastSignature(undefined);
                        }
                    }}
                >
                    <Dialog.Trigger>
                        <Button
                            color={error ? undefined : "red"}
                            loading={isSendingTransaction}
                            type="button"
                            className="cursor-pointer"
                            onClick={handleLogin}
                        >
                            Sign In With Solana
                        </Button>
                    </Dialog.Trigger>
                </Dialog.Root>

            ) : (<div></div>)}
        </div>
    );
};

export default SignIn;
