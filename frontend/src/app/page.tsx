import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="bg-primary-normal">Hello world</h1>
      <Link href={"/sign-up"}>Sign Up</Link>
      <Link href={"/log-in"}>Log In</Link>
    </div>
  );
}
