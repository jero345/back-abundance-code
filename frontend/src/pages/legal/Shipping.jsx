import LegalPage from './LegalPage.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Shipping() {
  const { t } = useLang();

  return (
    <LegalPage title={t('shipping.title')} updated={t('shipping.updated')}>
      <h2>{t('shipping.1h')}</h2>
      <p>{t('shipping.1p')}</p>
      <h2>{t('shipping.2h')}</h2>
      <p>{t('shipping.2p')}</p>
      <h2>{t('shipping.3h')}</h2>
      <p>{t('shipping.3p')}</p>
      <h2>{t('shipping.4h')}</h2>
      <p>{t('shipping.4p')}</p>
      <h2>{t('shipping.5h')}</h2>
      <p>{t('shipping.5p')}</p>
    </LegalPage>
  );
}
