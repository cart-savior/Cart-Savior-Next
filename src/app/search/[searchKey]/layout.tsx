import Page from "@/app/search/[searchKey]/page";
import { Suspense } from "react";

export default function Layout({ params }: { params: { searchKey: string } }) {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "red" }}>Loading...</div>}>
      <Page params={params} />
    </Suspense>
  )
}
