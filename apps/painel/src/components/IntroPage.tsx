import { ArrowRight, TreePine, Factory, Sofa } from 'lucide-react';

export function IntroPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 dark:bg-charcoal-900 py-20 px-6 transition-colors">
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="inline-block px-4 py-1.5 rounded-full bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 font-semibold text-sm mb-6 border border-forest-200 dark:border-forest-800">
          Cadeia de Fornecimento • Soroban Smart Contracts
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          O Futuro Seguro do <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-500 to-emerald-400">
            Mogno Africano
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Rastreabilidade ESG B2B irrefutável na Blockchain Stellar. 
          Acompanhe o ciclo de vida absoluto do RWA: do viveiro florestal até a entrega da peça de luxo mobiliária.
        </p>

        <div className="pt-8">
          <button 
            onClick={onEnter} 
            className="group inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-charcoal-950 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-gray-200 dark:shadow-none"
          >
            Acessar Sistema de Registros 
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Informational Cards */}
        <div className="grid md:grid-cols-3 gap-6 pt-24 text-left">
          <div className="bg-white dark:bg-charcoal-950 p-8 rounded-2xl border border-gray-100 dark:border-charcoal-800 shadow-xl shadow-gray-100 dark:shadow-none hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-forest-50 dark:bg-forest-900/30 rounded-xl flex items-center justify-center mb-6">
              <TreePine className="text-forest-600 dark:text-forest-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Viveiro & Genética</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Registro na blockchain do lote de sementes, garantindo a origem e pureza da espécie Khaya senegalensis desde o dia zero.</p>
          </div>
          
          <div className="bg-white dark:bg-charcoal-950 p-8 rounded-2xl border border-gray-100 dark:border-charcoal-800 shadow-xl shadow-gray-100 dark:shadow-none hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-forest-50 dark:bg-forest-900/30 rounded-xl flex items-center justify-center mb-6">
              <Factory className="text-forest-600 dark:text-forest-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Manejo Florestal</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Apontamento satelital da evolução arbórea e registro criptográfico de transação comercial C-Level para Serrarias licenciadas.</p>
          </div>

          <div className="bg-white dark:bg-charcoal-950 p-8 rounded-2xl border border-gray-100 dark:border-charcoal-800 shadow-xl shadow-gray-100 dark:shadow-none hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-forest-50 dark:bg-forest-900/30 rounded-xl flex items-center justify-center mb-6">
              <Sofa className="text-forest-600 dark:text-forest-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Mobiliário de Luxo</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Vinculação do lote processado à etiqueta inteligente do móvel, comprovando desmatamento zero ao consumidor final.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
