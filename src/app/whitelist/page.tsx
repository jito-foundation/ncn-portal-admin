import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WhitelistTable from "@/components/Tables/WhitelistTable";

export const metadata: Metadata = {
  title: "Whitelist",
  description:
    "This is Whitelist Tables page",
};

const WhitelistPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <WhitelistTable />
      </div>
    </DefaultLayout>
  );
};

export default WhitelistPage;
