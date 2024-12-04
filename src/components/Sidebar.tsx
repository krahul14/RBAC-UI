"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Key, Menu } from "lucide-react";
import { cn, menuItems } from "@/lib/utils";
import { Button } from "@/components/ui/button";


export function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <motion.aside
      initial={{ width: 250 }}
      animate={{ width: isSidebarOpen ? 250 : 80 }}
      className="bg-gray-800 p-4 flex flex-col h-screen"
    >
      <div className="flex items-center justify-between mb-8">
        {isSidebarOpen && (
          <motion.h1
            initial={{ opacity: 1 }}
            animate={{ opacity: isSidebarOpen ? 1 : 0 }}
            className="text-2xl font-bold text-white"
          >
            Dashboard
          </motion.h1>
        )}
        {~isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
      </div>
      <nav className="flex-grow">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start mb-2 text-white hover:bg-gray-700",
              activeTab === item.id && "bg-gray-700",
              !isSidebarOpen && "justify-center"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className={cn("h-5 w-5", isSidebarOpen && "mr-2")} />
            <motion.span
              initial={{ opacity: 1 }}
              animate={{
                opacity: isSidebarOpen ? 1 : 0,
                width: isSidebarOpen ? "auto" : 0,
              }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          </Button>
        ))}
      </nav>
    </motion.aside>
  );
}
