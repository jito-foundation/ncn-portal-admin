import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import NcnPortal from "@/components/Dashboard/NcnPortal";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "NCN Portal Admin",
  description: "This is NCN Portal Admin Home",
};

export default async function Home() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <DefaultLayout>
        <NcnPortal />
      </DefaultLayout>
    </>
  );
}
