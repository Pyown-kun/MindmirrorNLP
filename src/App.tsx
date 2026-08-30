import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { TrainingProvider, useTraining } from './context/TrainingContext';
import { PrivacyProvider } from './context/PrivacyContext';
import { PrivacyConsent } from './components/PrivacyConsent';
import { Welcome } from './pages/Welcome';
import { NameInput } from './pages/NameInput';
import { TrainingSelection } from './pages/TrainingSelection';
import { ModuleIntro } from './pages/ModuleIntro';
import { MirrorPhase } from './pages/MirrorPhase';
import { Roleplay } from './pages/Roleplay';
import { LookBack } from './pages/LookBack';
import { Reflection } from './pages/Reflection';
import { AhaMoment } from './pages/AhaMoment';
import { Takeaway } from './pages/Takeaway';
import { Analyzing } from './pages/Analyzing';
import { ResultDetails } from './pages/ResultDetails';
import { TrainingComplete } from './pages/TrainingComplete';
import { AdminPortal } from './pages/AdminPortal';
import { AdminLogin, isAdminAuthenticated } from './pages/AdminLogin';

const StepRouter=()=>{const {step}=useTraining();switch(step){case'welcome':return <Welcome/>;case'name':return <NameInput/>;case'training-selection':return <TrainingSelection/>;case'module-intro':return <ModuleIntro/>;case'mirror':return <MirrorPhase/>;case'roleplay':return <Roleplay/>;case'look-back':return <LookBack/>;case'reflection':return <Reflection/>;case'aha':return <AhaMoment/>;case'takeaway':return <Takeaway/>;case'analyzing':return <Analyzing/>;case'result-details':return <ResultDetails/>;case'complete':return <TrainingComplete/>;default:return <Welcome/>;}};
function App(){return <LanguageProvider><TrainingProvider><AppMode/></TrainingProvider></LanguageProvider>}
const AppMode=()=>window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/') ? (isAdminAuthenticated() ? <AdminPortal/> : <AdminLogin onLogin={() => window.location.reload()} />) : <PrivacyGate/>;
const PrivacyGate=()=>{const[consented,setConsented]=useState(false);const[modalOpen,setModalOpen]=useState(true);const{resetSession}=useTraining();return <PrivacyProvider openPrivacy={()=>setModalOpen(true)}><div className={modalOpen&&!consented?'blur-sm':''}><StepRouter/></div>{modalOpen&&<PrivacyConsent showDeleteButton={consented} onContinue={()=>{setConsented(true);setModalOpen(false)}} onRequestClose={consented?()=>setModalOpen(false):undefined} onDeleteData={()=>resetSession()}/>}</PrivacyProvider>};
export default App;
