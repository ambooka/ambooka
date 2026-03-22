export const getCardPattern = (index: number) => {
  const patterns = [
    // Pattern 1: Accent gradient + top right blob (Like featured blog post)
    {
      bgClass: "bg-gradient-to-br from-[hsl(var(--accent))/0.12] to-[hsl(var(--card))/0.4]",
      blobClass: "absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[hsl(var(--accent))]/10 transition-transform duration-500 group-hover:scale-110 border-none",
    },
    // Pattern 2: Glass + bottom left secondary blob
    {
      bgClass: "bg-[hsl(var(--card))/0.8] backdrop-blur-xl",
      blobClass: "absolute left-0 bottom-0 h-28 w-28 rounded-tr-full bg-[hsl(var(--secondary))]/10 transition-transform duration-500 group-hover:scale-125 border-none",
    },
    // Pattern 3: Secondary gradient + top left accent blob
    {
      bgClass: "bg-gradient-to-tr from-[hsl(var(--secondary))/0.08] to-[hsl(var(--card))/0.4]",
      blobClass: "absolute left-0 top-0 h-24 w-24 rounded-br-full bg-[hsl(var(--accent))]/10 transition-transform duration-500 group-hover:scale-110 border-none",
    },
    // Pattern 4: Glass + bottom right subtle accent blob
    {
      bgClass: "bg-[hsl(var(--card))/0.8] backdrop-blur-xl",
      blobClass: "absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-[hsl(var(--accent))]/5 transition-transform duration-500 group-hover:scale-125 border-none",
    }
  ];
  return patterns[index % patterns.length];
};
