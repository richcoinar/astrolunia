import type { MetadataRoute } from "next";
export default function manifest():MetadataRoute.Manifest {return {
 id:"/",name:"Astrolunia — Tarot, Astrología y Numerología",short_name:"Astrolunia",description:"Portal místico interactivo de Tarot y numerología",
 start_url:"/",scope:"/",display:"standalone",background_color:"#0c0b1c",theme_color:"#0c0b1c",lang:"es-AR",
 icons:[{src:"/icons/icon-192.png",sizes:"192x192",type:"image/png",purpose:"any"},{src:"/icons/icon-512.png",sizes:"512x512",type:"image/png",purpose:"any"},{src:"/icons/icon-maskable-512.png",sizes:"512x512",type:"image/png",purpose:"maskable"}]
};}
