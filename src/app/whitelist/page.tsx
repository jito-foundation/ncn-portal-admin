import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WhitelistTable from "@/components/Tables/WhitelistTable";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Whitelist",
  description: "This is Whitelist Tables page",
};

const WhitelistPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <WhitelistTable />
      </div>
    </DefaultLayout>
  );
};

export default WhitelistPage;
