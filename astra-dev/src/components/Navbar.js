import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "./LoginModal";
import { useLoginDialog } from "@/utils";

export default function Navbar() {
  const { setLoginOpen } = useLoginDialog();
  const user = useUser();
  return (
    <>
      <nav className="shadow px-2 z-40">
        <div className="flex w-full max-w-4xl py-3 items-center justify-between mx-auto">
          <div className="text-2xl font-medium text-white flex items-center">
            <Link href="/">
              <Image
                src="/Astra.jpeg"
                height={32}
                width={50}
                className="hidden md:block object-contain"
                alt="logo"
                unoptimized
              />
              <span>Astra</span>
              <Image
                src="/Astra.jpeg"
                height={32}
                width={32}
                className="md:hidden object-contain"
                alt="logo"
                unoptimized
              />
            </Link>
          </div>
          <div>
            <Link href="/" className="text-white hover:text-blue-600 ml-4">
              Home
            </Link>
            <Link
              href="/build"
              className="text-white hover:text-blue-600 ml-4"
            >
              Build
            </Link>
            {/* <Link
              href="https://github.com/jovianhq/jobot"
              className="text-white hover:text-blue-600 ml-4"
              target="_blank"
              rel="noreferrer"
            >
              Docs
            </Link> */}
            {user ? (
              <Link
                href="/account"
                className="text-white hover:text-blue-600 ml-4"
              >
                Account
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  setLoginOpen(true);
                }}
                className="text-white hover:text-blue-600 ml-4"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </nav>
      {!user && <LoginModal />}
    </>
  );
}
