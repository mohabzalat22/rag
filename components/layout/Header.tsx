"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignUpButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { MenuIcon, SparklesIcon, InfoIcon, LightbulbIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-lg">
                M
              </span>
            </div>
            <span className="font-bold text-xl bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Morag
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="#features">
            <Button variant="ghost" size="sm" className="gap-2">
              <SparklesIcon className="h-4 w-4" />
              Features
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="ghost" size="sm" className="gap-2">
              <LightbulbIcon className="h-4 w-4" />
              How It Works
            </Button>
          </Link>
          <Link href="#about">
            <Button variant="ghost" size="sm" className="gap-2">
              <InfoIcon className="h-4 w-4" />
              About
            </Button>
          </Link>
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm" className="shadow-sm">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/chat">
              <Button variant="outline" size="sm" className="shadow-sm">
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center space-x-2">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                      <span className="text-primary-foreground font-bold text-lg">
                        M
                      </span>
                    </div>
                    <span className="font-bold text-xl bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Morag
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 py-6">
                {/* Navigation Links */}
                <nav className="flex flex-col space-y-1">
                  <SheetClose asChild>
                    <Link href="#features">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12"
                      >
                        <SparklesIcon className="h-5 w-5" />
                        <span className="text-base">Features</span>
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="#how-it-works">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12"
                      >
                        <LightbulbIcon className="h-5 w-5" />
                        <span className="text-base">How It Works</span>
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="#about">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12"
                      >
                        <InfoIcon className="h-5 w-5" />
                        <span className="text-base">About</span>
                      </Button>
                    </Link>
                  </SheetClose>
                </nav>

                <Separator />

                {/* Auth Actions */}
                <div className="flex flex-col gap-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full h-11">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button className="w-full h-11 shadow-sm">
                        Get Started
                      </Button>
                    </SignUpButton >
                  </SignedOut>
                  <SignedIn>
                    <SheetClose asChild>
                      <Link href="/chat">
                        <Button
                          variant="default"
                          className="w-full h-11 shadow-sm"
                        >
                          Go to Dashboard
                        </Button>
                      </Link>
                    </SheetClose>
                  </SignedIn>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
