import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AdminPortal } from './pages/AdminPortal';
import { PrivacyProvider } from './context/PrivacyContext';
import { PrivacyNotice } from './components/PrivacyNotice';
import { TrainingProvider, useTraining } from './context/TrainingContext';
import { Welcome } from './pages/Welcome';
import { NameInput } from './pages/NameInput';
import { TrainingSelection } from './pages/TrainingSelection';
import { SituationInput } from './pages/SituationInput';
import { MirrorPhase } from './pages/MirrorPhase';
import { InitialThought } from './pages/InitialThought';
import { Analysis } from './pages/Analysis';
import { Reframe } from './pages/Reframe';
import { PerspectiveShift } from './pages/PerspectiveShift';
import { Roleplay } from './pages/Roleplay';
import { Analyzing } from './pages/Analyzing';
import { TrainingResult } from './pages/TrainingResult';
import { ResultDetails } from './pages/ResultDetails';
import { NLPInsights } from './pages/NLPInsights';
import { BeforeAfter } from './pages/BeforeAfter';
import { TrainingComplete } from './pages/TrainingComplete';

const StepRouter = () => {
  const { step } = useTraining();

  switch (step) {
    case 'welcome':
      return <Welcome />;
    case 'name':
      return <NameInput />;
    case 'training-selection':
      return <TrainingSelection />;
    case 'situation':
      return <SituationInput />;
    case 'mirror':
      return <MirrorPhase />;
    case 'initial-thought':
      return <InitialThought />;
    case 'analysis':
      return <Analysis />;
    case 'reframe':
      return <Reframe />;
    case 'perspective-shift':
      return <PerspectiveShift />;
    case 'roleplay':
      return <Roleplay />;
    case 'analyzing':
      return <Analyzing />;
    case 'result':
      return <TrainingResult />;
    case 'result-details':
      return <ResultDetails />;
    case 'nlp-insights':
      return <NLPInsights />;
    case 'before-after':
      return <BeforeAfter />;
    case 'complete':
      return <TrainingComplete />;
    default:
      return <Welcome />;
  }
};

function App() {
  const isAdminPortal = window.location.pathname.startsWith('/admin');
  return (
    <LanguageProvider>
      <AuthProvider>
        {isAdminPortal ? <AdminPortal /> : (
          <PrivacyProvider>
            <TrainingProvider>
              <StepRouter />
              <PrivacyNotice />
            </TrainingProvider>
          </PrivacyProvider>
        )}
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
