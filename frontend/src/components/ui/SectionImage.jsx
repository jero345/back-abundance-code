/* =========================================================
   ABUNDANCE CODE — Imagen de sección

   Marco común para las fotos de la web: hereda el lenguaje visual de las
   tarjetas (esquinas rounded-2xl + borde beige) para que las imágenes no
   parezcan pegadas encima del diseño.

   width/height van siempre al <img> aunque el tamaño real lo decida el CSS:
   el navegador reserva el hueco con esa proporción y el texto de debajo no
   salta cuando la imagen termina de cargar.
   ========================================================= */
export default function SectionImage({
  src,
  alt,
  width,
  height,
  className = '',
  imgClassName = '',
  priority = false,
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl ${className}`}
      style={{ border: '1px solid #E8DCC8', boxShadow: '0 10px 30px rgba(61,40,23,0.07)' }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
