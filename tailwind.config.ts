import type { Config } from "tailwindcss";
export default { content:["./app/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"], theme:{extend:{colors:{ink:"#07110f",panel:"#0b1916",mint:"#8fffc8",lime:"#d8ff75",coral:"#ff796b"},boxShadow:{glow:"0 0 40px rgba(143,255,200,.14)"}}},plugins:[] } satisfies Config;
