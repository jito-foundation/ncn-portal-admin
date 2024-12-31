import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import NcnPortal from "@/components/Dashboard/NcnPortal";

export const metadata: Metadata = {
  title: "NCN Portal Admin",
  description: "This is NCN Portal Admin Home",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <NcnPortal />
      </DefaultLayout>
    </>
  );
}
