import { ParticleBackground } from '@/components/ParticleBackground';
import { RegistrationForm } from '@/components/RegistrationForm';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Index;
