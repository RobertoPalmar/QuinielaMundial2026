// Avatar determinista por usuario (DiceBear notionists-neutral). Mismo seed -> misma cara.
export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(seed)}`;
}
