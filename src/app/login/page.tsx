"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="grid h-screen w-full grid-cols-1 md:grid-cols-2">
      <div className="relative h-full w-full md:block border">
        <img
          src="/aion-background.png"
          width={1920}
          height={1080}
          alt="Hero Image"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="absolute top-0 right-0 flex flex-col items-center justify-center space-y-6 px-8 text-center">
          <div className="absolute top-4 right-4">
            <Button variant="ghost">Sign Up</Button>
          </div>
        </div>
        <div className="w-full max-w-md space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Sign in to your account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link
                href="#"
                className="font-medium text-primary-600 hover:underline"
                prefetch={false}
              >
                create a new account
              </Link>
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn("google")}
            >
              <GoogleIcon className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
