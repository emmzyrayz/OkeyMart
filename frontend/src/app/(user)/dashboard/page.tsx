'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaSearch,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";
import { Analytic, DashContent, SideBar } from "@/components/analytic/page";
import { ExpPost, ExpStatus, ExpBlog, SellShop, MessageTab } from "@/components/explore/explore";
import { Chat, User } from "@/types/component";
import { mockApi } from "@/utils/mockApi";

export default function Dashboard({params}: {params: {messageListId: string}}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await mockApi.delay(500); // Simulate network delay
      const user = await mockApi.getCurrentUser();
      const chatsData = await mockApi.getChats();

      setCurrentUser(user);
      setChats(chatsData);
    };

    fetchData();
  }, [params.messageListId]);

  
  return (
    <div className="flex flex-row w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-3/4 min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex flex-row items-start justify-between w-full py-4 px-4 md:px-6 lg:px-8">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
              Welcome Back, Zac!
            </h1>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaSearch className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaBell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Image
                  src="/avatar.png"
                  alt="Zac Hudson"
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  Zac Hudson
                </span>
                <FaChevronDown className="text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Area */}
        {/* <div className="flex-1 overflow-y-auto"> */}
        {/* Analytics Section */}
        <div className="analytic_sections hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              <Analytic />
            </div>
            <div className="w-full lg:w-[400px] p-4 md:p-6 lg:p-8">
              <DashContent />
            </div>
          </div>
        </div>

        <div className="explore_section px-[2%] pt-[2%] hidden">
          <ExpStatus />
          <ExpPost />
          <ExpBlog />
        </div>

        <div className="sellshop_section">
          <SellShop />
        </div>

        <div className="sellchat_section hidden">
          {chats.map((chat) => (
            <MessageTab key={chat.id} chat={chat} currentUser={currentUser} />
          ))}
        </div>

        
      </div>
    </div>
  );
}
