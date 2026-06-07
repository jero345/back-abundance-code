import LegalPage from './LegalPage.jsx';
import { useLang } from '../../context/LanguageContext.jsx';

export default function Disclaimer() {
  const { t } = useLang();

  return (
    <LegalPage title={t('disclaimer.title')} updated={t('disclaimer.updated')}>
      <h2>{t('disclaimer.1h')}</h2>
      <p>{t('disclaimer.1p')}</p>
      <h2>{t('disclaimer.2h')}</h2>
      <p>{t('disclaimer.2p')}</p>
      <h2>{t('disclaimer.3h')}</h2>
      <p>{t('disclaimer.3p')}</p>
      <h2>{t('disclaimer.4h')}</h2>
      <p>{t('disclaimer.4p')}</p>
    </LegalPage>
  );
}
