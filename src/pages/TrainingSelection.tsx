import { BookOpen, Compass, Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { TrainingCard } from '../components/TrainingCard';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { localize } from '../curriculum/modules';
import { getPublishedModules } from '../services/curriculumStore';

const icons = [BookOpen, Compass, Sparkles];
export const TrainingSelection = () => {
  const { language } = useLanguage();
  const { updateSession, next } = useTraining();
  const [modules, setModules] = useState(getPublishedModules);
  useEffect(() => { setModules(getPublishedModules()); }, []);
  return <PageShell wide><MirrorPane>
    <p className="text-sm font-semibold uppercase tracking-wide text-primary">{language === 'id' ? 'PERPUSTAKAAN PENGALAMAN' : language === 'nl' ? 'ERVARINGSBIBLIOTHEEK' : 'EXPERIENCE LIBRARY'}</p>
    <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{language === 'id' ? 'Pilih pengalaman belajar' : language === 'nl' ? 'Kies een leerervaring' : 'Choose a learning experience'}</h2>
    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{language === 'id' ? 'Bukan kuis. Anda akan mengalami pola komunikasi, berinteraksi, lalu melihat kembali apa yang Anda lakukan.' : language === 'nl' ? 'Geen quiz. Je ervaart een communicatiepatroon, gaat in gesprek en kijkt daarna terug op wat je deed.' : 'Not a quiz. You will experience a communication pattern, interact with it, then look back at what you did.'}</p>
    <div className="mt-7 grid gap-4 md:grid-cols-2">
      {modules.map((module, index) => {
        const Icon = icons[index % icons.length];
        return <TrainingCard key={module.id} icon={Icon} title={localize(module.title, language)} description={localize(module.description, language)} disabled={!module.available} disabledLabel={module.available ? undefined : (language === 'id' ? 'Segera Hadir' : language === 'nl' ? 'Binnenkort' : 'Available Soon')} onClick={() => { if (!module.available) return; updateSession({ moduleId: module.id }); next(); }} />;
      })}
    </div>
  </MirrorPane></PageShell>;
};
