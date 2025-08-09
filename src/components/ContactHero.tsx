
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ContactHero = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  return (
    <section 
      ref={elementRef}
      className={`relative py-20 sm:py-32 md:py-44 px-4 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Hero Image Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl text-center sm:text-left">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 transition-all duration-700 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Contact <span className="text-red-500">Us</span>
          </h1>
          <p className={`text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed transition-all duration-700 delay-200 transform px-4 sm:px-0 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            We're here to help! Reach out to our team for support, inquiries, or collaboration opportunities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
