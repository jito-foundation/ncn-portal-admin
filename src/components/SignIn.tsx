"use client";

import React, { useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@solana/react";
import { Badge, Button, Dialog } from "@radix-ui/themes";
import { ChainContext } from "@/components/Provider/ChainContext";
import { SelectedWalletAccountContext } from "@/components/context/SelectedWalletAccountContext";
import { NO_ERROR } from "@/util/errors";
import { UiWalletAccount } from "@wallet-standard/react";
import { signIn } from "next-auth/react";

type Props = Readonly<{
    account: UiWalletAccount;
}>;

const SignIn = ({ account }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
    const signInWithSolana = useSignIn(account);

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
            const { account, signedMessage, signature } = await signInWithSolana(
                messageJson.data,
            );

            console.log("Signing in with NextAuth...");



            const callbackUrl = searchParams.get("callbackUrl") || "/";

            const result = await signIn("solana", {
                redirect: false,
                callbackUrl,
                host: window.location.host,
                address: account.address,
                account: JSON.stringify(account),
                signedMessage: JSON.stringify(signedMessage),
                signature: JSON.stringify(signature),
            })

            console.log("NextAuth response:", result);

            if (result?.ok) {
                router.push(callbackUrl);
            } else {
                setError({ message: "Authentication failed" });
            }
        } catch (e) {
            setLastSignature(undefined);
            setError({ message: "You are not whitelisted" });
        } finally {
            setIsSendingTransaction(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
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
