import LegalPage from './LegalPage.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Returns() {
  const { t } = useLang();

  return (
    <LegalPage title={t('returns.title')} updated={t('returns.updated')}>
      <h2>{t('returns.1h')}</h2>
      <p>{t('returns.1p')}</p>
      <h2>{t('returns.2h')}</h2>
      <p>{t('returns.2p')}</p>
      <h2>{t('returns.3h')}</h2>
      <p>{t('returns.3p')}</p>
      <h2>{t('returns.4h')}</h2>
      <p>{t('returns.4p')}</p>
      <h2>{t('returns.5h')}</h2>
      <p>{t('returns.5p')}</p>
      <h2>{t('returns.6h')}</h2>
      <p>{t('returns.6p')}</p>
      <h2>{t('returns.7h')}</h2>
      <p>{t('returns.7p')}</p>
    </LegalPage>
  );
}
