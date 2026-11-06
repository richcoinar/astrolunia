import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
export const metadata: Metadata = {
  title: {default:"Astrolunia | Tarot, astrología y numerología",template:"%s | Astrolunia"},
  description:"Descubrí tu universo simbólico con Tarot interactivo y numerología. Próximamente carta astral con cálculos astronómicos.",
  applicationName:"Astrolunia", metadataBase: new URL("https://astrolunia.publicalogratis.store"),
  manifest:"/manifest.webmanifest", appleWebApp:{capable:true,title:"Astrolunia",statusBarStyle:"black-translucent"},
  icons:{icon:[{url:"/icons/icon-192.png",sizes:"192x192",type:"image/png"}],apple:"/icons/icon-192.png"},
  robots:{index:false,follow:false}
};
export const viewport: Viewport = {width:"device-width",initialScale:1,themeColor:"#0c0b1c"};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="es-AR"><body><ServiceWorkerRegister/>{children}</body></html>}
