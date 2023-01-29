import Head from "next/head"
import React from "react"
import Details from "./Details"
import Sidebar from "./Sidebar"
import ActiveList from "./ActiveList"
import AddItem from "./AddItem"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import ItemModal from "../modals/ItemModal"
import { trpc } from "../../utils/trpc"

interface Props {
  children: JSX.Element
}

type menu = "ActiveList" | "AddItem" | "Details"

export default function Layout({ children }: Props) {
  const queryClient = useQueryClient()
  const { data: currentMenu } = useQuery<menu | undefined>(
    ["currentMenu"],
    () => queryClient.getQueryData<menu>(["currentMenu"]),
    {
      initialData: "ActiveList",
    }
  )
  const { data: showMenu } = useQuery<boolean | undefined>(
    ["showMenu"],
    () => queryClient.getQueryData(["showMenu"]),
    { initialData: false }
  )
  const { data: activeList, isLoading } = trpc.list.read.useQuery()

  return (
    <main className="h-screen w-screen bg-[#FAFAFE] flex">
      <Head>
        <title>Shoppingify</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ItemModal />
      <Sidebar queryClient={queryClient} totalItems={activeList} />

      <section className="flex-grow h-full px-12 overflow-scroll py-14 lg:px-32 hideScrollbar">
        {children}
      </section>

      <aside
        className={`${
          showMenu ? "block" : "hidden"
        } md:block sidePageRes h-full md:static md:top-auto md:right-auto fixed top-0 right-0`}
      >
        {currentMenu === "ActiveList" && (
          <ActiveList
            queryClient={queryClient}
            activeList={activeList}
            isLoading={isLoading}
          />
        )}
        {currentMenu === "AddItem" && <AddItem queryClient={queryClient} />}
        {currentMenu === "Details" && <Details queryClient={queryClient} />}
      </aside>
    </main>
  )
}
