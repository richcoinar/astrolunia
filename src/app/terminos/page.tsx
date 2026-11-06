import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Términos de uso — versión de desarrollo" };
export default function Page() { return <main className="container" style={{paddingTop:"3rem",paddingBottom:"5rem",maxWidth:"760px"}}><p><Link href="/">← Volver a Astrolunia</Link></p><h1>Términos de uso — versión de desarrollo</h1><p><strong>Documento informativo provisional · Versión 0.8</strong></p>      <p>Astrolunia ofrece herramientas de exploración simbólica y entretenimiento. No constituye una fuente científica de predicciones ni ofrece asesoramiento médico, jurídico, económico o psicológico.</p>
      <p>El tarot, la numerología y los preparativos para carta natal tienen fines informativos o recreativos. La carta natal astronómica completa todavía no está habilitada.</p>
      <p>Esta versión está destinada a pruebas. El acceso, las funcionalidades y la disponibilidad pueden variar durante el desarrollo.</p>
      <p>No se habilitarán funciones comerciales o de pago hasta publicar condiciones definitivas, información del responsable, precios y mecanismos de soporte y reclamos.</p>
      <p>Los textos presentes son provisionales y deben ser revisados conforme a la legislación aplicable antes de abrir registros públicos.</p></main>; }
