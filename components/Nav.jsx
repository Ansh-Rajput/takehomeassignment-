"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Nav = () => {
  const supabase = createClient();
  const router = useRouter();
  const [session, setSession] = useState(null);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href={"/"} className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="Promptopia Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Link Saver</p>
      </Link>

      <div className="sm:flex hidden">
        {session && (
          <button type="button" className="black_btn" onClick={signOut}>
            Log out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
