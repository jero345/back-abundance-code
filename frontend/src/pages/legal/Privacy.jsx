import LegalPage from './LegalPage.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Privacy() {
  const { t } = useLang();

  return (
    <LegalPage title={t('privacy.title')} updated={t('privacy.updated')}>
      <h2>{t('privacy.1h')}</h2>
      <p>{t('privacy.1p')}</p>
      <h2>{t('privacy.2h')}</h2>
      <p>{t('privacy.2p')}</p>
      <h2>{t('privacy.3h')}</h2>
      <p>{t('privacy.3p')}</p>
      <h2>{t('privacy.4h')}</h2>
      <p>{t('privacy.4p')}</p>
      <h2>{t('privacy.5h')}</h2>
      <p>{t('privacy.5p')}</p>
      <h2>{t('privacy.6h')}</h2>
      <p>{t('privacy.6p')}</p>
      <h2>{t('privacy.7h')}</h2>
      <p>{t('privacy.7p')} <strong>support@abundancecode.com</strong></p>
    </LegalPage>
  );
}
