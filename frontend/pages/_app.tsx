import "@/styles/globals.css";
import type { AppProps } from "next/app";
import MouseEffects from "@/components/originkit/ui/clickeffects";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MouseEffects color="#06b6d4" interactionMode="sniper" effectSize={60} />
      <Component {...pageProps} />
    </>
  );
}
