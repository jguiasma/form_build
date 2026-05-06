import { ShieldCheck, Server, Key, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CTA } from "../components/CTA";
import { useAuthStore } from "../../auth/store/authStore";

export default function SolutionsPage() {
  const navigate = useNavigate();
  const { setView, clearAlerts } = useAuthStore();

  const handleActionClick = () => {
    clearAlerts();
    setView("login");
    navigate("/auth");
  };
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="text-center px-4 max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
            Enterprise Solutions
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0A192F] tracking-tight mb-6 leading-tight">
            Intelligent Forms for the <br />
            <span className="text-blue-600 underline decoration-blue-600/30 underline-offset-8">Modern Enterprise</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Scale your data collection with bank-level security, automated workflows, and seamless deep-stack integrations designed for high-volume organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleActionClick} className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">
              Contact Sales
            </button>
            <button onClick={handleActionClick} className="bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold hover:border-gray-200 hover:bg-gray-50 transition-all">
              View Platform Demo
            </button>
          </div>
        </section>

        {/* Features Row */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-blue-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bank-Level Security</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                SOC2 Type II, HIPAA, and GDPR compliant infrastructure ensuring your enterprise data remains private and protected.
              </p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-blue-200">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Scalability</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Process millions of submissions concurrently with 99.99% uptime SLA and multi-region data residency options.
              </p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md shadow-blue-200">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Deep Integrations</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Connect directly with Salesforce, SAP, Microsoft Dynamics, and custom internal APIs via our robust SDK.
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Proven Impact Across Industries</h2>
                <p className="text-gray-500">See how global market leaders leverage FormFlow AI to automate critical business processes.</p>
              </div>
              <button onClick={handleActionClick} className="text-blue-600 font-bold flex items-center gap-2 hover:text-blue-800 transition-colors whitespace-nowrap">
                View all case studies <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Case Study 1 - Financial Services */}
              <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  {/* Background gradient with animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-600 animate-gradient">
                    {/* Animated floating particles */}
                    <div className="absolute inset-0">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full bg-white/20 animate-float"
                          style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 3 + 2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Decorative chart pattern */}
                  <div className="absolute inset-0 flex items-end opacity-30">
                    <div className="w-full px-8 pb-6">
                      <svg className="w-full h-32" viewBox="0 0 400 120">
                        <path d="M0,100 L50,80 L100,95 L150,60 L200,40 L250,55 L300,25 L350,45 L400,20"
                          fill="none" stroke="white" strokeWidth="2"
                          className="animate-drawLine" />
                        <path d="M0,100 L50,80 L100,95 L150,60 L200,40 L250,55 L300,25 L350,45 L400,20"
                          fill="none" stroke="white" strokeWidth="6" opacity="0.3"
                          className="animate-drawLine" />
                      </svg>
                    </div>
                  </div>

                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">Financial Services</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                    Global FinTech Transformation
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                    A top-tier European bank reduced account opening times by 70% and increased conversion rates by 45% using FormFlow's AI-driven identity verification forms.
                  </p>

                  {/* Metrics with animation */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="transform hover:scale-105 transition-transform duration-300">
                      <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        70%
                      </div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        Faster Processing
                      </div>
                    </div>
                    <button onClick={handleActionClick} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full text-xs font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      Read Full Study
                    </button>
                  </div>
                </div>
              </div>

              {/* Case Study 2 - Healthcare */}
              <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  {/* Background gradient with animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-teal-600 to-cyan-500 animate-gradient">
                    {/* Animated pulse rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute w-32 h-32 rounded-full border-4 border-white/30 animate-ping-slow"></div>
                        <div className="absolute w-32 h-32 rounded-full border-4 border-white/20 animate-pulse-slow"></div>
                      </div>
                    </div>

                    {/* Animated heartbeat line */}
                    <div className="absolute inset-x-0 bottom-8 opacity-30">
                      <svg className="w-full h-24" viewBox="0 0 600 60">
                        <path d="M0,30 L100,30 L120,10 L140,50 L160,30 L250,30 L270,15 L290,45 L310,30 L400,30 L420,20 L440,40 L460,30 L600,30"
                          fill="none" stroke="white" strokeWidth="2"
                          className="animate-heartbeat" />
                      </svg>
                    </div>
                  </div>

                  {/* Medical cross icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 transform rotate-0 group-hover:rotate-12 transition-transform duration-500">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">Healthcare</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                    Streamlining Patient Intake
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                    Securely handling millions of patient records for a national healthcare provider, reducing manual data entry errors by 92% across 400 clinics.
                  </p>

                  {/* Metrics with animation */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="transform hover:scale-105 transition-transform duration-300">
                      <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        92%
                      </div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        Error Reduction
                      </div>
                    </div>
                    <button onClick={handleActionClick} className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full text-xs font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      Read Full Study
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom CSS animations - add to your global CSS file */}
            <style>{`
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); opacity: 0; }
    50% { transform: translateY(-20px); opacity: 0.5; }
  }
  
  @keyframes drawLine {
    0% { stroke-dashoffset: 1000; }
    100% { stroke-dashoffset: 0; }
  }
  
  @keyframes heartbeat {
    0%, 100% { transform: scaleX(1); }
    50% { transform: scaleX(1.05); }
  }
  
  @keyframes ping-slow {
    0% { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.5; }
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-drawLine {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 2s ease-out forwards;
  }
  
  .animate-heartbeat {
    animation: heartbeat 1.5s ease-in-out infinite;
  }
  
  .animate-ping-slow {
    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
`}</style>
          </div>
        </section>

        {/* Developer Ecosystem Section */}
        <section className="bg-blue-700 py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                  Built for your technical ecosystem
                </h2>
                <p className="text-blue-100 text-lg mb-10 max-w-lg">
                  FormFlow AI isn't just a form builder. It's an enterprise-grade API-first platform that connects every part of your business logic.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-white font-bold">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    Webhooks & Real-time Events
                  </li>
                  <li className="flex items-center gap-3 text-white font-bold">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    Headless UI Support
                  </li>
                  <li className="flex items-center gap-3 text-white font-bold">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    Custom Field Mapping Engine
                  </li>
                </ul>
                <button onClick={handleActionClick} className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
                  Explore Developer Docs
                </button>
              </div>

              {/* Code Snippet Window */}
              <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 font-mono text-sm">
                <div className="flex items-center gap-2 p-4 border-b border-slate-700 bg-slate-800/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-4 text-[10px] text-slate-400 uppercase tracking-widest font-black">INTEGRATION: CONFIG.JSON</div>
                </div>
                <div className="p-6 overflow-x-auto text-slate-300">
                  <pre>
                    <code className="block leading-loose">
                      <span className="text-blue-400">{`{`}</span>
                      <span className="text-sky-300">"integration"</span>: <span className="text-emerald-400">"Salesforce_v2"</span>,
                      <span className="text-sky-300">"trigger"</span>: <span className="text-emerald-400">"OnSubmission"</span>,
                      <span className="text-sky-300">"mapping"</span>: <span className="text-blue-400">{`{`}</span>
                      <span className="text-sky-300">"FirstName"</span>: <span className="text-emerald-400">"lead.FirstName"</span>,
                      <span className="text-sky-300">"LastName"</span>: <span className="text-emerald-400">"lead.LastName"</span>,
                      <span className="text-sky-300">"Email"</span>: <span className="text-emerald-400">"lead.Email"</span>,
                      <span className="text-sky-300">"Company_size"</span>: <span className="text-emerald-400">"lead.EmployeeCount"</span>
                      <span className="text-blue-400">{`}`}</span>,
                      <span className="text-sky-300">"security"</span>: <span className="text-blue-400">{`{`}</span>
                      <span className="text-sky-300">"encryption"</span>: <span className="text-emerald-400">"AES-256-GCM"</span>,
                      <span className="text-sky-300">"auth"</span>: <span className="text-emerald-400">"OAuth_2.0"</span>
                      <span className="text-blue-400">{`}`}</span>
                      <span className="text-blue-400">{`}`}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}

