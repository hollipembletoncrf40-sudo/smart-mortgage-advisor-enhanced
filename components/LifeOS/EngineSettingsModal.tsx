import React, { useState, useEffect } from 'react';
import { LifeOSState, IncomeParams, AssetParams, FreedomParams, RiskParams, LearningParams, IncomeSource, Asset, Skill } from './types';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  engineType: keyof LifeOSState | null;
  data: any;
  onSave: (newData: any) => void;
}

import { createPortal } from 'react-dom';

const EngineSettingsModal: React.FC<Props> = ({ isOpen, onClose, title, engineType, data, onSave }) => {
  const [formData, setFormData] = useState<any>(data);

  useEffect(() => {
    setFormData(data);
  }, [data, isOpen]);

  console.log('Modal Render:', { isOpen, engineType });
  if (!isOpen || !engineType) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50 rounded-t-2xl">
           <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             Edit {title} Parameters
           </h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-5 w-5"/></button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           {engineType === 'income' && <IncomeForm data={formData as IncomeParams} onChange={setFormData} />}
           {engineType === 'assets' && <AssetForm data={formData as AssetParams} onChange={setFormData} />}
           {engineType === 'freedom' && <FreedomForm data={formData as FreedomParams} onChange={setFormData} />}
           {engineType === 'risk' && <RiskForm data={formData as RiskParams} onChange={setFormData} />}
           {engineType === 'learning' && <LearningForm data={formData as LearningParams} onChange={setFormData} />}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-b-2xl flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">取消</button>
           <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
             <Save className="h-4 w-4" /> 保存修改
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Sub-Forms ---

const IncomeForm = ({ data, onChange }: { data: IncomeParams, onChange: (d: IncomeParams) => void }) => {
   const addSource = () => {
      const newSource: IncomeSource = { id: Date.now().toString(), name: '新增收入', type: 'salary', amount: 0, taxable: true, taxRate: 20, stabilityScore: 80, growthRate: 5, replicability: 'low' };
      onChange({ ...data, sources: [...data.sources, newSource] });
   };

   const updateSource = (idx: number, field: keyof IncomeSource, val: any) => {
      const newSources = [...data.sources];
      newSources[idx] = { ...newSources[idx], [field]: val };
      onChange({ ...data, sources: newSources });
   };

   return (
     <div className="space-y-8">
        <Section title="基础配置 (Base Config)">
           <div className="grid grid-cols-2 gap-6">
              <Input label="Liquid Savings (Months)" value={data.liquidSavings} onChange={v => onChange({...data, liquidSavings: Number(v)})} type="number" />
              <Input label="Industry Risk Score (0-100)" value={data.industryRiskScore} onChange={v => onChange({...data, industryRiskScore: Number(v)})} type="number" help="Higher = More Risky" />
              <Input label="Projected 3-Year Income" value={data.projectedIncome3Yr} onChange={v => onChange({...data, projectedIncome3Yr: Number(v)})} type="number" />
           </div>
        </Section>
        
        <Section title="收入来源 (Income Sources)">
           <div className="space-y-4">
               {data.sources.map((s, i) => (
                  <div key={s.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative group transition-all hover:border-indigo-500/30">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <Input sm label="Name" value={s.name} onChange={v => updateSource(i, 'name', v)} />
                        <Select sm label="Type" value={s.type} onChange={v => updateSource(i, 'type', v)} options={['salary','contract','investment','business','royalty']} />
                        <Input sm label="Amount/mo" value={s.amount} onChange={v => updateSource(i, 'amount', Number(v))} type="number" />
                        <Select sm label="Replicability" value={s.replicability} onChange={v => updateSource(i, 'replicability', v)} options={['low','medium','high']} />
                     </div>
                     <div className="grid grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Input sm label="Tax Rate %" value={s.taxRate} onChange={v => updateSource(i, 'taxRate', Number(v))} type="number" />
                        <Input sm label="Growth %" value={s.growthRate} onChange={v => updateSource(i, 'growthRate', Number(v))} type="number" />
                        <Input sm label="Stability (0-100)" value={s.stabilityScore} onChange={v => updateSource(i, 'stabilityScore', Number(v))} type="number" />
                     </div>
                     <button onClick={() => onChange({...data, sources: data.sources.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Trash2 className="h-4 w-4" />
                     </button>
                  </div>
               ))}
               <button onClick={addSource} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 font-bold">
                  <Plus className="h-5 w-5"/> Add Income Source
               </button>
           </div>
        </Section>
     </div>
   );
};

const AssetForm = ({ data, onChange }: { data: AssetParams, onChange: (d: AssetParams) => void }) => {
  const addAsset = () => {
     const newAsset: Asset = { id: Date.now().toString(), name: '新增资产', type: 'stock', value: 0, cost: 0, liability: 0, interestRate: 0, liquidity: 'T0', expectedReturn: 5, volatility: 10 };
     onChange({ ...data, assets: [...data.assets, newAsset] });
  };

  const updateAsset = (idx: number, field: keyof Asset, val: any) => {
     const newAssets = [...data.assets];
     newAssets[idx] = { ...newAssets[idx], [field]: val };
     onChange({ ...data, assets: newAssets });
  };

  return (
    <div className="space-y-8">
       <Section title="财务基础 (Baseline)">
          <div className="grid grid-cols-2 gap-6">
             <Input label="Monthly Expense (Average)" value={data.monthlyExpense} onChange={v => onChange({...data, monthlyExpense: Number(v)})} type="number" />
             <Input label="Target Debt Ratio Limit (Optional)" value={0.5} onChange={()=>{}} type="number" disabled />
          </div>
       </Section>
       
       <Section title="资产详情 (Portfolio)">
          <div className="space-y-4">
             {data.assets.map((a, i) => (
                <div key={a.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative group transition-all hover:border-indigo-500/30">
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <Input sm label="Name" value={a.name} onChange={v => updateAsset(i, 'name', v)} />
                      <Select sm label="Type" value={a.type} onChange={v => updateAsset(i, 'type', v)} options={['cash','stock','fund','property','bond','business','crypto','gold']} />
                      <Select sm label="Liquidity Level" value={a.liquidity} onChange={v => updateAsset(i, 'liquidity', v)} options={['T0','T7','T30','T365','Locked']} />
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <Input sm label="Market Value" value={a.value} onChange={v => updateAsset(i, 'value', Number(v))} type="number" />
                      <Input sm label="Liability (Debt)" value={a.liability} onChange={v => updateAsset(i, 'liability', Number(v))} type="number" />
                      <Input sm label="Exp. Return %" value={a.expectedReturn} onChange={v => updateAsset(i, 'expectedReturn', Number(v))} type="number" />
                      <Input sm label="Volatility %" value={a.volatility} onChange={v => updateAsset(i, 'volatility', Number(v))} type="number" />
                   </div>
                   <button onClick={() => onChange({...data, assets: data.assets.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
                      <Trash2 className="h-4 w-4" />
                   </button>
                </div>
             ))}
             <button onClick={addAsset} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 font-bold">
                  <Plus className="h-5 w-5"/> Add Asset
             </button>
          </div>
       </Section>
    </div>
  );
};

const FreedomForm = ({ data, onChange }: { data: FreedomParams, onChange: (d: FreedomParams) => void }) => (
  <div className="space-y-8">
     <Section title="支出分层 (Expense Layers)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Input label="Survival Monthly Cost (Base)" value={data.survivalMonthlyCost} onChange={v => onChange({...data, survivalMonthlyCost: Number(v)})} type="number" help="Rent + Food + Utilities" />
           <Input label="Comfort Monthly Cost (Target)" value={data.comfortMonthlyCost} onChange={v => onChange({...data, comfortMonthlyCost: Number(v)})} type="number" help="Lifestyle + Travel + Shopping" />
        </div>
     </Section>
     <Section title="自由度参数 (Freedom Parameters)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Input label="Dependents Count" value={data.dependents} onChange={v => onChange({...data, dependents: Number(v)})} type="number" />
           <Input label="Location Lock Score (0-100)" value={data.locationLockScore} onChange={v => onChange({...data, locationLockScore: Number(v)})} type="number" help="100 = Cannot move (Mortgage/School)" />
           <Input label="Skill Transferability (0-100)" value={data.skillTransferability} onChange={v => onChange({...data, skillTransferability: Number(v)})} type="number" />
           <Input label="FIRE Projection (Years)" value={data.fireYearProjection} onChange={v => onChange({...data, fireYearProjection: Number(v)})} type="number" />
        </div>
     </Section>
  </div>
);

const RiskForm = ({ data, onChange }: { data: RiskParams, onChange: (d: RiskParams) => void }) => (
   <div className="space-y-8">
      <Section title="稳定性指标 (Stability Matrix)">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Monthly Burn Rate" value={data.monthlyBurn} onChange={v => onChange({...data, monthlyBurn: Number(v)})} type="number" />
            <Input label="Emergency Fund Cash" value={data.emergencyFund} onChange={v => onChange({...data, emergencyFund: Number(v)})} type="number" />
            <Input label="Income Volatility (0-100)" value={data.incomeVolatility} onChange={v => onChange({...data, incomeVolatility: Number(v)})} type="number" />
            <Input label="Market Correlation (0-100)" value={data.marketCorrelation} onChange={v => onChange({...data, marketCorrelation: Number(v)})} type="number" />
         </div>
      </Section>
      <Section title="保险覆盖 (Insurance Checks)">
          <div className="grid grid-cols-2 gap-4">
               {data.insurance.map((ins, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <input type="checkbox" checked={ins.valid} onChange={e => {
                          const newIns = [...data.insurance];
                          newIns[i].valid = e.target.checked;
                          onChange({...data, insurance: newIns});
                      }} className="w-5 h-5 accent-indigo-500 rounded" />
                      <div>
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{ins.type} Insurance</div>
                          <div className="text-xs text-slate-400">Coverage: ${(ins.coverage/10000).toFixed(0)}W</div>
                      </div>
                  </div>
               ))}
          </div>
      </Section>
   </div>
);

const LearningForm = ({ data, onChange }: { data: LearningParams, onChange: (d: LearningParams) => void }) => {
  const addSkill = () => {
    const newSkill: Skill = { id: Date.now().toString(), name: 'New Skill', proficiency: 50, marketDemand: 50, aiReplacability: 50, decayHalfLife: 5, investmentHoursPerMonth: 0 };
    onChange({...data, skills: [...data.skills, newSkill]});
  };

  const updateSkill = (idx: number, field: keyof Skill, val: any) => {
     const newSkills = [...data.skills];
     newSkills[idx] = { ...newSkills[idx], [field]: val };
     onChange({ ...data, skills: newSkills });
  };

  return (
    <div className="space-y-8">
       <Section title="学习投入 (Input)">
          <div className="grid grid-cols-2 gap-6">
            <Input label="Monthly Learning Budget ($)" value={data.monthlyLearningBudget} onChange={v => onChange({...data, monthlyLearningBudget: Number(v)})} type="number" />
            <Input label="Est. Learning ROI %" value={data.learningRoi} onChange={v => onChange({...data, learningRoi: Number(v)})} type="number" />
          </div>
       </Section>
       
       <Section title="技能组合 (Skill Stack)">
          <div className="space-y-4">
              {data.skills.map((s, i) => (
                 <div key={s.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative group transition-all hover:border-indigo-500/30">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <Input sm label="Skill Name" value={s.name} onChange={v => updateSkill(i, 'name', v)} />
                       <Input sm label="Proficiency (0-100)" value={s.proficiency} onChange={v => updateSkill(i, 'proficiency', Number(v))} type="number" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Input sm label="Market Demand" value={s.marketDemand} onChange={v => updateSkill(i, 'marketDemand', Number(v))} type="number" />
                        <Input sm label="AI Replacability" value={s.aiReplacability} onChange={v => updateSkill(i, 'aiReplacability', Number(v))} type="number" />
                        <Input sm label="Half Life (Years)" value={s.decayHalfLife} onChange={v => updateSkill(i, 'decayHalfLife', Number(v))} type="number" />
                    </div>
                     <button onClick={() => onChange({...data, skills: data.skills.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Trash2 className="h-4 w-4" />
                     </button>
                 </div>
              ))}
              <button onClick={addSkill} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 font-bold">
                  <Plus className="h-5 w-5"/> Add Skill
              </button>
          </div>
       </Section>
    </div>
  );
};

// --- Form Helpers ---

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">{title}</h4>
        {children}
    </div>
);

const Input = ({ label, value, onChange, type = 'text', sm, help, disabled }: { label: string, value: any, onChange: (v: string) => void, type?: string, sm?: boolean, help?: string, disabled?: boolean }) => (
  <div>
    <label className={`block ${sm ? 'text-[10px]' : 'text-xs'} font-medium text-slate-500 dark:text-slate-400 mb-1`}>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      disabled={disabled}
      className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg ${sm ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
    {help && <p className="text-[10px] text-slate-400 mt-1 italic">{help}</p>}
  </div>
);

const Select = ({ label, value, onChange, options, sm }: { label: string, value: string, onChange: (v: string) => void, options: string[], sm?: boolean }) => (
  <div>
    <label className={`block ${sm ? 'text-[10px]' : 'text-xs'} font-medium text-slate-500 dark:text-slate-400 mb-1`}>{label}</label>
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg ${sm ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white capitalize`}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default EngineSettingsModal;
