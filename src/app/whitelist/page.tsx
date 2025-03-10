import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WhitelistTable from "@/components/Tables/WhitelistTable";

export const metadata: Metadata = {
  title: "Whitelist",
  description: "This is Whitelist Tables page",
};

const WhitelistPage = async () => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Whitelist</h1>
        </div>
        <WhitelistTable />
      </div>
    </DefaultLayout>
  );
};

export default WhitelistPage;
