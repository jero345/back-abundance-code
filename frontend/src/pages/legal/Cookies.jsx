import LegalPage from './LegalPage.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Cookies() {
  const { t } = useLang();

  return (
    <LegalPage title={t('cookies.title')} updated={t('cookies.updated')}>
      <h2>{t('cookies.1h')}</h2>
      <p>{t('cookies.1p')}</p>
      <h2>{t('cookies.2h')}</h2>
      <p>{t('cookies.2p')}</p>
      <h2>{t('cookies.3h')}</h2>
      <p>{t('cookies.3p')}</p>
      <h2>{t('cookies.4h')}</h2>
      <p>{t('cookies.4p')}</p>
    </LegalPage>
  );
}
