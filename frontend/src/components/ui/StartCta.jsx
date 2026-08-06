import { Link } from 'react-router-dom';

/* =========================================================
   StartCta — CTA principal del embudo.

   Ahora el pago ocurre en la web, así que el botón lleva a
   /pricing, no a la app. `campaign` viaja en la URL para
   saber qué sección del sitio generó la venta; la página de
   precios lo reenvía a Stripe como metadato.
   ========================================================= */
export default function StartCta({
  children,
  campaign = 'generic',
  variant = 'primary',
  className = '',
}) {
  const base = variant === 'outline' ? 'btn-outline' : 'btn-primary';

  return (
    <Link to={`/pricing?from=${encodeURIComponent(campaign)}`} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}
