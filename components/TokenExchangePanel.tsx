import React, { useState, useMemo } from 'react';
import { Car, Laptop, Plane, Coffee, ShoppingBag, Plus, Trash2, Coins } from 'lucide-react';
import { CalculationResult, InvestmentParams } from '../types';

interface TokenExchangePanelProps {
  result: CalculationResult;
  params: InvestmentParams;
  t: any;
}

interface ExchangeItem {
  id: string;
  name: string;
  price: number; // in Yuan
  icon: React.ReactNode;
  isCustom?: boolean;
}

const TokenExchangePanel: React.FC<TokenExchangePanelProps> = ({ result, params, t }) => {
  const [customItems, setCustomItems] = useState<ExchangeItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // 1. Calculate Real Wealth Difference (Inflation Adjusted)
  const wealthData = useMemo(() => {
    if (!result.yearlyData || result.yearlyData.length === 0) return { diff: 0, winner: 'None' };

    const finalYear = result.yearlyData[result.yearlyData.length - 1];
    const inflationRate = (params.inflationRate || 0) / 100;
    const discountFactor = 1 / Math.pow(1 + inflationRate, params.holdingYears);

    // Real House Equity = Real Property Value - Real Debt
    // Real Debt = Nominal Debt * Discount Factor
    const realHouseEquity = finalYear.realPropertyValue - (finalYear.remainingLoan * discountFactor);
    const realStockEquity = finalYear.realStockNetWorth;

    const diffWan = realHouseEquity - realStockEquity;
    const diffYuan = Math.abs(diffWan) * 10000;
    const winner = diffWan > 0 ? 'House' : 'Stock';

    return { diff: diffYuan, winner, diffWan: Math.abs(diffWan) };
  }, [result, params]);

  const defaultItems: ExchangeItem[] = [
    { id: 'tesla', name: 'Tesla Model 3', price: 250000, icon: <Car className="h-5 w-5" /> },
    { id: 'macbook', name: 'MacBook Pro', price: 15000, icon: <Laptop className="h-5 w-5" /> },
    { id: 'trip', name: t.luxuryTrip || '豪华海外游', price: 50000, icon: <Plane className="h-5 w-5" /> },
    { id: 'hermes', name: t.hermesBag || '爱马仕包包', price: 100000, icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'coffee', name: t.starbucks || '星巴克咖啡', price: 35, icon: <Coffee className="h-5 w-5" /> },
  ];

  const allItems = [...defaultItems, ...customItems];

  const handleAddCustomItem = () => {
    if (!newItemName || !newItemPrice) return;
    const price = parseFloat(newItemPrice);
    if (isNaN(price) || price <= 0) return;

    const newItem: ExchangeItem = {
      id: Date.now().toString(),
      name: newItemName,
      price,
      icon: <Coins className="h-5 w-5" />,
      isCustom: true,
    };

    setCustomItems([...customItems, newItem]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleDeleteCustom = (id: string) => {
    setCustomItems(customItems.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Result */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h2 className="text-2xl font-bold mb-2 relative z-10">
          {wealthData.winner === 'House' ? (t.houseWins || '买房路径多赚') : (t.stockWins || '租房投资多赚')}
        </h2>
        <div className="text-5xl font-black mb-2 tracking-tight relative z-10">
          ¥{Math.round(wealthData.diff).toLocaleString()}
        </div>
        <p className="text-indigo-100 text-sm relative z-10">
          {t.realWealthDesc || '*基于通胀调整后的真实购买力差异'}
        </p>
      </div>

      {/* Token Exchange List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allItems.map((item) => {
          const count = wealthData.diff / item.price;
          const countDisplay = count >= 100 ? Math.floor(count) : count.toFixed(1);
          
          return (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-slate-700 dark:text-white">{item.name}</div>
                  <div className="text-xs text-slate-400">¥{item.price.toLocaleString()} / {t.unit || '个'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  × {Number(countDisplay).toLocaleString()}
                </div>
                {item.isCustom && (
                  <button 
                    onClick={() => handleDeleteCustom(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 mt-1"
                  >
                    {t.delete || '删除'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Input */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 border-dashed">
        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4" /> {t.addCustomItem || '添加自定义愿望'}
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder={t.itemNamePlaceholder || "例如：环球旅行"}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="number"
            placeholder={t.itemPricePlaceholder || "单价 (元)"}
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="w-32 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={handleAddCustomItem}
            disabled={!newItemName || !newItemPrice}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-colors"
          >
            {t.add || '添加'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExchangePanel;
