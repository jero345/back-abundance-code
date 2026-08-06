import { appUrl, SIGNUP_PATH } from '../../config.js';

/* =========================================================
   AppCta — enlace externo a la web app.
   Reemplaza a los <Link to="/checkout"> del sitio ecommerce.
   `campaign` identifica el bloque que generó el clic (UTM).
   ========================================================= */
export default function AppCta({
  children,
  campaign = 'generic',
  path = SIGNUP_PATH,
  variant = 'primary',
  className = '',
}) {
  const base =
    variant === 'link'    ? ''
    : variant === 'outline' ? 'btn-outline'
    : 'btn-primary';

  return (
    <a
      href={appUrl(path, campaign)}
      className={`${base} ${className}`}
      rel="noopener"
    >
      {children}
    </a>
  );
}
