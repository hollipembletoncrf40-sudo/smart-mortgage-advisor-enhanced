import { InvestmentParams, LoanType, RepaymentMethod, PurchaseScenario } from '../types';

export interface PresetTemplate {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
  params: Partial<InvestmentParams>;
}

export const PRESETS: PresetTemplate[] = [
  {
    id: 'beijing-essential',
    name: '北京刚需',
    nameEn: 'Beijing Essential',
    icon: '🏠',
    description: '首套房，普通工薪家庭，35%首付',
    descriptionEn: 'First home, average income, 35% down payment',
    params: {
      totalPrice: 500,
      downPaymentRatio: 35,
      loanTerm: 30,
      interestRate: 4.1,
      providentInterestRate: 3.1,
      providentQuota: 120,
      loanType: LoanType.COMBINATION,
      familyMonthlyIncome: 30000,
      monthlyRent: 6000,
      holdingYears: 10,
      rentAppreciationRate: 3,
      deedTaxRate: 1,
      agencyFeeRatio: 1,
      educationBudget: 0,
      renovationCost: 20,
      holdingCostRatio: 0.3,
      propertyMaintenanceCost: 0.5,
      alternativeReturnRate: 4,
      enablePrepayment: false,
      prepaymentYear: 5,
      prepaymentAmount: 50
    }
  },
  {
    id: 'shanghai-upgrade',
    name: '上海改善',
    nameEn: 'Shanghai Upgrade',
    icon: '🏢',
    description: '二套房，中产家庭，50%首付',
    descriptionEn: 'Second home, middle class, 50% down payment',
    params: {
      totalPrice: 800,
      downPaymentRatio: 50,
      loanTerm: 25,
      interestRate: 4.9,
      providentInterestRate: 3.575,
      providentQuota: 100,
      loanType: LoanType.COMBINATION,
      familyMonthlyIncome: 50000,
      monthlyRent: 10000,
      holdingYears: 15,
      rentAppreciationRate: 2.5,
      deedTaxRate: 3,
      agencyFeeRatio: 1,
      educationBudget: 50,
      renovationCost: 50,
      holdingCostRatio: 0.3,
      propertyMaintenanceCost: 1,
      alternativeReturnRate: 5,
      enablePrepayment: true,
      prepaymentYear: 5,
      prepaymentAmount: 100
    }
  },
  {
    id: 'shenzhen-investment',
    name: '深圳投资',
    nameEn: 'Shenzhen Investment',
    icon: '💰',
    description: '投资房，高收入，40%首付，注重租金回报',
    descriptionEn: 'Investment property, high income, 40% down, rental focus',
    params: {
      totalPrice: 600,
      downPaymentRatio: 40,
      loanTerm: 20,
      interestRate: 4.3,
      providentInterestRate: 3.25,
      providentQuota: 90,
      loanType: LoanType.COMMERCIAL,
      familyMonthlyIncome: 60000,
      monthlyRent: 8000,
      holdingYears: 10,
      rentAppreciationRate: 4,
      deedTaxRate: 3,
      agencyFeeRatio: 1,
      educationBudget: 0,
      renovationCost: 30,
      holdingCostRatio: 0.3,
      propertyMaintenanceCost: 0.8,
      alternativeReturnRate: 6,
      enablePrepayment: false,
      prepaymentYear: 3,
      prepaymentAmount: 80
    }
  },
  {
    id: 'guangzhou-balanced',
    name: '广州平衡',
    nameEn: 'Guangzhou Balanced',
    icon: '⚖️',
    description: '首套房，稳健型，30%首付',
    descriptionEn: 'First home, balanced approach, 30% down',
    params: {
      totalPrice: 400,
      downPaymentRatio: 30,
      loanTerm: 30,
      interestRate: 3.95,
      providentInterestRate: 3.1,
      providentQuota: 100,
      loanType: LoanType.COMBINATION,
      familyMonthlyIncome: 25000,
      monthlyRent: 5000,
      holdingYears: 12,
      rentAppreciationRate: 3,
      deedTaxRate: 1,
      agencyFeeRatio: 1,
      educationBudget: 20,
      renovationCost: 15,
      holdingCostRatio: 0.3,
      propertyMaintenanceCost: 0.5,
      alternativeReturnRate: 4.5,
      enablePrepayment: false,
      prepaymentYear: 5,
      prepaymentAmount: 30
    }
  }
];

export function getPresetById(id: string): PresetTemplate | undefined {
  return PRESETS.find(p => p.id === id);
}
