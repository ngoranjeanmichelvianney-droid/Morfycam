import Image from "next/image";
import Link from "next/link";

export default function Logo({ taille = 40, className = "" }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logos/L7.jpeg"
        alt="VibeCam"
        width={taille}
        height={taille}
        className="rounded-lg object-cover"
      />
      <span className="mirage-word text-2xl">MorfyCam</span>
    </Link>
  );
}