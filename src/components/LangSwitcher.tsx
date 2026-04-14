import { useTranslation } from '../i18n/LanguageContext';

export default function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useTranslation();

  return (
    <div className={['flex items-center gap-1', className].join(' ')}>
      <button
        onClick={() => setLang('pl')}
        className={[
          'text-lg leading-none transition-opacity',
          lang === 'pl' ? 'opacity-100' : 'opacity-30 hover:opacity-60',
        ].join(' ')}
        title="Polski"
      >
        🇵🇱
      </button>
      <button
        onClick={() => setLang('en')}
        className={[
          'text-lg leading-none transition-opacity',
          lang === 'en' ? 'opacity-100' : 'opacity-30 hover:opacity-60',
        ].join(' ')}
        title="English"
      >
        🇬🇧
      </button>
    </div>
  );
}
