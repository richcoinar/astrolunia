import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Privacidad en Astrolunia" };
export default function Page() { return <main className="container" style={{paddingTop:"3rem",paddingBottom:"5rem",maxWidth:"760px"}}><p><Link href="/">← Volver a Astrolunia</Link></p><h1>Privacidad en Astrolunia</h1><p><strong>Documento informativo provisional · Versión 0.8</strong></p>      <p>Esta página describe el funcionamiento de la versión de desarrollo v0.8. Antes de habilitar cuentas y lanzar el servicio públicamente, se debe publicar una política definitiva que identifique al responsable del tratamiento y los canales de contacto.</p>
      <p>El tarot y la numerología se procesan localmente en el navegador. Si una persona inicia sesión y decide guardar una lectura, la aplicación puede almacenarla en el proyecto Supabase de Astrolunia, vinculada a su identificador de usuario.</p>
      <p>Una cuenta utiliza el proveedor Supabase Auth para gestionar credenciales y sesiones. La aplicación no debe almacenar contraseñas en tablas propias ni exponer claves privilegiadas al navegador.</p>
      <p>Los datos de nacimiento son personales; no deberían almacenarse en un servidor sin una finalidad informada, consentimiento apropiado, condiciones de conservación y posibilidad de ejercicio de derechos.</p>
      <p>La eliminación de lecturas individuales no equivale al borrado integral de una cuenta. La eliminación integral y el canal para solicitudes de privacidad siguen pendientes de implementar y verificar.</p>
      <p>La instalación PWA puede guardar recursos técnicos en la caché del dispositivo para permitir el funcionamiento offline. El usuario puede borrarlos desde la configuración del navegador.</p></main>; }
