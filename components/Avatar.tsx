import { avatarUrl } from "@/lib/avatar";

export function Avatar({ seed, size = 32, className = "" }: { seed: string; size?: number; className?: string }) {
  return (
    <img
      src={avatarUrl(seed)}
      alt=""
      width={size}
      height={size}
      className={`rounded-full bg-white object-cover shrink-0 ${className}`}
      loading="lazy"
    />
  );
}
