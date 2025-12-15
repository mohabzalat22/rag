"use client"
import {Settings} from "lucide-react"
import { redirect } from "next/navigation";
export default function Header() {
  return (
    <div className="w-full p-6 bg-white sticky top-0 z-50">
      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
          aria-label="Settings"
          onClick={()=>redirect("/prompt")}
        >
          <Settings className="h-5 w-5" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </div>
  );
}
