import LegalPage from './LegalPage.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Terms() {
  const { t } = useLang();

  return (
    <LegalPage title={t('terms.title')} updated={t('terms.updated')}>
      <h2>{t('terms.1h')}</h2>
      <p>{t('terms.1p')}</p>
      <h2>{t('terms.2h')}</h2>
      <p>{t('terms.2p')}</p>
      <h2>{t('terms.3h')}</h2>
      <p>{t('terms.3p')}</p>
      <h2>{t('terms.4h')}</h2>
      <p>{t('terms.4p')}</p>
      <h2>{t('terms.5h')}</h2>
      <p>{t('terms.5p')}</p>
      <h2>{t('terms.6h')}</h2>
      <p>{t('terms.6p')}</p>
      <h2>{t('terms.7h')}</h2>
      <p>{t('terms.7p')}</p>
      <h2>{t('terms.8h')}</h2>
      <p>{t('terms.8p')}</p>
    </LegalPage>
  );
}
