import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Building, Search, TrendingUp, BarChart3, ChevronRight, Calendar, DollarSign, TreePine, X, Home, Loader, Star, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, Info } from 'lucide-react';
import communityStats from '../data/community-stats.json';

interface Community {
  name: string;
  province: string;
  city: string;
  area: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
  management_fee: number | null;
  build_year: number | null;
  plot_ratio: number | null;
  greening_rate: number | null;
  developer: string | null;
  property_company: string | null;
  school: string | null;
}

interface LiveabilityFactor {
  name: string;
  score: number; // 0-100
  rating: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  explanation: string;
  tips: string;
}

// Calculate livability factors and overall score
const evaluateCommunity = (community: Community): { 
  overallScore: number; 
  rating: string;
  factors: LiveabilityFactor[];
  summary: string;
} => {
  const factors: LiveabilityFactor[] = [];
  let totalScore = 0;
  let factorCount = 0;

  const currentYear = new Date().getFullYear();

  // 1. Building Age Factor
  if (community.build_year) {
    const age = currentYear - community.build_year;
    let score = 0, rating: LiveabilityFactor['rating'] = 'fair', explanation = '', tips = '';
    
    if (age <= 5) {
      score = 95; rating = 'excellent';
      explanation = `建于${community.build_year}年，房龄仅${age}年，属于次新房，设施新、维护成本低。`;
      tips = '次新房通常无需大修，居住体验佳。';
    } else if (age <= 10) {
      score = 85; rating = 'good';
      explanation = `建于${community.build_year}年，房龄${age}年，属于较新小区，设施相对完善。`;
      tips = '可能需要关注电梯、管道等设施状况。';
    } else if (age <= 20) {
      score = 65; rating = 'fair';
      explanation = `建于${community.build_year}年，房龄${age}年，可能面临设施老化问题。`;
      tips = '建议实地查看水电、外墙、电梯状况，预留维修预算。';
    } else {
      score = 40; rating = 'poor';
      explanation = `建于${community.build_year}年，房龄已${age}年，属于老旧小区。`;
      tips = '老旧小区可能有安全隐患，需评估是否值得投资装修。';
    }
    
    factors.push({ name: '房龄新旧', score, rating, explanation, tips });
    totalScore += score; factorCount++;
  }

  // 2. Greening Rate Factor
  if (community.greening_rate) {
    const rate = community.greening_rate;
    let score = 0, rating: LiveabilityFactor['rating'] = 'fair', explanation = '', tips = '';
    
    if (rate >= 40) {
      score = 95; rating = 'excellent';
      explanation = `绿化率${rate}%，远超国家标准(30%)，绿树成荫，空气清新。`;
      tips = '高绿化率有助于降温、减噪、提升幸福感。';
    } else if (rate >= 35) {
      score = 80; rating = 'good';
      explanation = `绿化率${rate}%，高于标准，环境较优美。`;
      tips = '绿化维护成本较高，需关注物业养护情况。';
    } else if (rate >= 25) {
      score = 60; rating = 'fair';
      explanation = `绿化率${rate}%，接近国家标准，满足基本需求。`;
      tips = '可关注小区是否有中心花园或休闲区域。';
    } else {
      score = 35; rating = 'poor';
      explanation = `绿化率仅${rate}%，低于标准，环境一般。`;
      tips = '低绿化率意味着更多硬化地面，夏季可能更热。';
    }
    
    factors.push({ name: '绿化环境', score, rating, explanation, tips });
    totalScore += score; factorCount++;
  }

  // 3. Plot Ratio Factor (容积率)
  if (community.plot_ratio) {
    const ratio = community.plot_ratio;
    let score = 0, rating: LiveabilityFactor['rating'] = 'fair', explanation = '', tips = '';
    
    if (ratio <= 1.5) {
      score = 95; rating = 'excellent';
      explanation = `容积率${ratio}，属于低密度住宅，楼间距大，采光通风好。`;
      tips = '低容积率意味着更少的邻居、更好的私密性。';
    } else if (ratio <= 2.5) {
      score = 75; rating = 'good';
      explanation = `容积率${ratio}，密度适中，居住舒适度较高。`;
      tips = '选房时注意楼层和朝向，避免遮挡。';
    } else if (ratio <= 4) {
      score = 55; rating = 'fair';
      explanation = `容积率${ratio}，属于中高密度，可能存在拥挤感。`;
      tips = '电梯等候时间可能较长，需考虑出行便利性。';
    } else {
      score = 30; rating = 'poor';
      explanation = `容积率${ratio}，密度过高，居住体验可能受影响。`;
      tips = '高容积率小区需特别关注消防、采光、噪音问题。';
    }
    
    factors.push({ name: '居住密度', score, rating, explanation, tips });
    totalScore += score; factorCount++;
  }

  // 4. Property Management Factor
  if (community.management_fee) {
    const fee = community.management_fee;
    let score = 0, rating: LiveabilityFactor['rating'] = 'fair', explanation = '', tips = '';
    
    if (fee >= 3) {
      score = 85; rating = 'excellent';
      explanation = `物业费¥${fee}/㎡/月，属于高端物业服务水平。`;
      tips = '高物业费通常意味着更好的安保、保洁和维护服务。';
    } else if (fee >= 1.5) {
      score = 75; rating = 'good';
      explanation = `物业费¥${fee}/㎡/月，服务水平中等偏上。`;
      tips = '建议实地考察物业响应速度和服务态度。';
    } else if (fee >= 0.8) {
      score = 55; rating = 'fair';
      explanation = `物业费¥${fee}/㎡/月，属于大众化水平。`;
      tips = '物业费较低可能影响公共设施维护质量。';
    } else {
      score = 40; rating = 'poor';
      explanation = `物业费仅¥${fee}/㎡/月，服务可能较基础。`;
      tips = '低物业费小区建议关注安保和卫生状况。';
    }
    
    factors.push({ name: '物业服务', score, rating, explanation, tips });
    totalScore += score; factorCount++;
  }

  // 5. School Factor
  const hasSchool = community.school && /学校|小学|中学|幼儿园|大学|学院|附小|附中|实验|外国语/.test(community.school);
  if (hasSchool) {
    factors.push({ 
      name: '教育资源', 
      score: 80, 
      rating: 'good',
      explanation: `周边有学校：${community.school}`,
      tips: '学区房通常保值能力较强，但需确认是否划片。'
    });
    totalScore += 80; factorCount++;
  }

  // 6. Developer Reputation (简单判断)
  if (community.developer) {
    const topDevelopers = ['万科', '恒大', '碧桂园', '保利', '中海', '融创', '龙湖', '华润', '绿城', '金地', '招商'];
    const isTop = topDevelopers.some(d => community.developer!.includes(d));
    
    if (isTop) {
      factors.push({
        name: '开发商',
        score: 85,
        rating: 'excellent',
        explanation: `开发商：${community.developer}，属于品牌房企。`,
        tips: '品牌开发商通常建筑质量和配套更有保障。'
      });
      totalScore += 85; factorCount++;
    }
  }

  // Calculate overall
  const overallScore = factorCount > 0 ? Math.round(totalScore / factorCount) : 0;
  
  let rating = '数据不足';
  let summary = '暂无足够数据进行评估，建议实地考察。';
  
  if (factorCount >= 2) {
    if (overallScore >= 85) {
      rating = '⭐ 优质宜居';
      summary = '该小区多项指标表现优秀，是理想的居住选择。建议重点关注房价是否在预算范围内。';
    } else if (overallScore >= 70) {
      rating = '👍 较为宜居';
      summary = '该小区综合表现良好，适合大多数家庭居住。可根据个人需求权衡各因素。';
    } else if (overallScore >= 55) {
      rating = '😐 中规中矩';
      summary = '该小区表现一般，有一定的优缺点。建议实地考察，特别关注弱项指标。';
    } else {
      rating = '⚠️ 需谨慎考虑';
      summary = '该小区部分指标不够理想，购买前请仔细评估是否符合您的需求。';
    }
  }

  return { overallScore, rating, factors, summary };
};

interface CommunityDataPanelProps {
  t: Record<string, string>;
}

const CommunityDataPanel: React.FC<CommunityDataPanelProps> = ({ t }) => {
  const [searchCity, setSearchCity] = useState('');
  const [searchCommunity, setSearchCommunity] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [communityData, setCommunityData] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [displayCount, setDisplayCount] = useState(50); // Pagination: show 50 at a time

  const stats = communityStats as {
    total: number;
    byProvince: Record<string, number>;
    byCity: Record<string, number>;
    topCities: { city: string; count: number }[];
    topProvinces: { province: string; count: number }[];
    avgManagementFee: number;
  };

  // Load community data
  useEffect(() => {
    setLoading(true);
    import('../data/community-data.json')
      .then(data => {
        setCommunityData(data.default as Community[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Reset display count when city changes
  useEffect(() => {
    setDisplayCount(50);
  }, [selectedCity, searchCommunity]);

  const filteredCities = useMemo(() => {
    let cities = Object.entries(stats.byCity);
    if (searchCity) {
      cities = cities.filter(([city]) => city.includes(searchCity));
    }
    return cities.sort((a, b) => b[1] - a[1]).slice(0, 50);
  }, [stats.byCity, searchCity]);

  // Filter communities by selected city and search term
  const allFilteredCommunities = useMemo(() => {
    if (!selectedCity) return [];
    let communities = communityData.filter(c => c.city === selectedCity);
    if (searchCommunity) {
      communities = communities.filter(c => 
        c.name?.includes(searchCommunity) || 
        c.address?.includes(searchCommunity) ||
        c.area?.includes(searchCommunity)
      );
    }
    return communities;
  }, [communityData, selectedCity, searchCommunity]);

  // Paginated communities for display
  const displayedCommunities = useMemo(() => {
    return allFilteredCommunities.slice(0, displayCount);
  }, [allFilteredCommunities, displayCount]);

  const hasMore = displayCount < allFilteredCommunities.length;

  const maxCityCount = stats.topCities[0]?.count || 1;

  return (
    <div className="space-y-6">
      {/* Dashboard Header - 4 Visualization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Communities - Gradient Purple */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building className="h-5 w-5" />
              </div>
              <span className="text-purple-100 text-sm font-medium">小区总数</span>
            </div>
            <div className="text-4xl font-bold mb-2">{stats.total.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-purple-200 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>全国数据覆盖</span>
            </div>
            {/* Mini bar chart visualization */}
            <div className="flex items-end gap-1 mt-3 h-8">
              {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Cities - Gradient Cyan */}
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-teal-100 text-sm font-medium">覆盖城市</span>
            </div>
            <div className="text-4xl font-bold mb-2">{Object.keys(stats.byCity).length}</div>
            <div className="flex items-center gap-1 text-teal-200 text-xs">
              <Star className="h-3 w-3" />
              <span>主要城市全覆盖</span>
            </div>
            {/* Circular progress visualization */}
            <div className="mt-3 flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="white" strokeWidth="4" strokeDasharray="126" strokeDashoffset="25" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">80%</div>
              </div>
              <div className="text-xs text-teal-100">
                <div>一线城市: 100%</div>
                <div>新一线: 100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Provinces - Gradient Orange */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-5 text-white shadow-lg">
          <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/10 rounded-full translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-amber-100 text-sm font-medium">覆盖省份</span>
            </div>
            <div className="text-4xl font-bold mb-2">{Object.keys(stats.byProvince).length}</div>
            <div className="flex items-center gap-1 text-amber-200 text-xs">
              <CheckCircle className="h-3 w-3" />
              <span>全国省份覆盖率</span>
            </div>
            {/* Horizontal progress bars */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs w-10">华东</span>
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[95%] rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-10">华南</span>
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[88%] rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-10">华北</span>
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[82%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Top City - Gradient Rose/Pink */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/3 -translate-x-1/3" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-pink-100 text-sm font-medium">冠军城市</span>
            </div>
            <div className="text-2xl font-bold mb-1">{stats.topCities[0]?.city || '上海市'}</div>
            <div className="text-3xl font-bold text-pink-100">{stats.topCities[0]?.count.toLocaleString() || '0'}</div>
            <div className="flex items-center gap-1 text-pink-200 text-xs mt-1">
              <Star className="h-3 w-3" />
              <span>小区数量最多</span>
            </div>
            {/* Top 3 mini ranking */}
            <div className="mt-2 space-y-1">
              {stats.topCities.slice(1, 4).map((item, i) => (
                <div key={item.city} className="flex items-center gap-2 text-xs">
                  <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">{i + 2}</span>
                  <span className="flex-1 truncate text-pink-100">{item.city}</span>
                  <span className="text-pink-200">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* City Selection & Community Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* City List */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700 max-h-[600px] overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">选择城市</h3>
          </div>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索城市..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredCities.map(([city, count]) => (
              <button
                key={city}
                onClick={() => { setSelectedCity(city); setSearchCommunity(''); }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                  selectedCity === city 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="font-medium truncate">{city}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{count}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Community List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700 max-h-[600px] overflow-hidden flex flex-col">
          {selectedCity ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {selectedCity} 小区列表
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    ({allFilteredCommunities.length} 个)
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedCity(null)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索小区名称、地址、区域..."
                  value={searchCommunity}
                  onChange={(e) => setSearchCommunity(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm border-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader className="h-8 w-8 text-emerald-500 animate-spin" />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2">
                  {displayedCommunities.map((community, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedCommunity(community)}
                      className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-800 dark:text-white truncate">
                            {community.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {community.area} · {community.address}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2 shrink-0">
                          {community.build_year && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                              {community.build_year}年
                            </span>
                          )}
                          {community.management_fee && (
                            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded">
                              ¥{community.management_fee}/㎡
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <button
                      onClick={() => setDisplayCount(prev => prev + 100)}
                      className="w-full py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors font-medium"
                    >
                      显示更多 ({displayedCommunities.length}/{allFilteredCommunities.length})
                    </button>
                  )}
                  
                  {allFilteredCommunities.length === 0 && (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                      暂无匹配的小区数据
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <MapPin className="h-12 w-12 mb-3 opacity-30" />
              <p>👈 请先选择一个城市查看小区详情</p>
            </div>
          )}
        </div>
      </div>

      {/* Community Detail Modal */}
      {selectedCommunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCommunity(null)}>
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{selectedCommunity.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {selectedCommunity.province} · {selectedCommunity.city} · {selectedCommunity.area}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCommunity(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">地址</div>
                  <div className="font-medium text-slate-800 dark:text-white">{selectedCommunity.address || '暂无'}</div>
                </div>
              </div>

              {/* Property Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                {selectedCommunity.build_year && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">建造年代</div>
                      <div className="font-bold text-blue-700 dark:text-blue-300">{selectedCommunity.build_year}年</div>
                    </div>
                  </div>
                )}
                
                {selectedCommunity.management_fee && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                    <div>
                      <div className="text-xs text-amber-600 dark:text-amber-400">物业费</div>
                      <div className="font-bold text-amber-700 dark:text-amber-300">¥{selectedCommunity.management_fee}/㎡/月</div>
                    </div>
                  </div>
                )}

                {selectedCommunity.greening_rate && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <TreePine className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-xs text-green-600 dark:text-green-400">绿化率</div>
                      <div className="font-bold text-green-700 dark:text-green-300">{selectedCommunity.greening_rate}%</div>
                    </div>
                  </div>
                )}

                {selectedCommunity.plot_ratio && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Building className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">容积率</div>
                      <div className="font-bold text-purple-700 dark:text-purple-300">{selectedCommunity.plot_ratio}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Developer & Property Company */}
              {(selectedCommunity.developer || selectedCommunity.property_company) && (
                <div className="space-y-2">
                  {selectedCommunity.developer && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="text-xs text-slate-500 dark:text-slate-400">开发商</div>
                      <div className="font-medium text-slate-800 dark:text-white">{selectedCommunity.developer}</div>
                    </div>
                  )}
                  {selectedCommunity.property_company && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="text-xs text-slate-500 dark:text-slate-400">物业公司</div>
                      <div className="font-medium text-slate-800 dark:text-white">{selectedCommunity.property_company}</div>
                    </div>
                  )}
                </div>
              )}

              {/* School - only show if it contains school-related keywords */}
              {selectedCommunity.school && /学校|小学|中学|幼儿园|大学|学院|附小|附中|实验|外国语/.test(selectedCommunity.school) && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">周边学校</div>
                  <div className="font-medium text-indigo-700 dark:text-indigo-300">{selectedCommunity.school}</div>
                </div>
              )}

              {/* Coordinates */}
              {selectedCommunity.latitude && selectedCommunity.longitude && (
                <div className="text-xs text-slate-400 text-center pt-2">
                  📍 坐标: {selectedCommunity.latitude.toFixed(4)}, {selectedCommunity.longitude.toFixed(4)}
                </div>
              )}

              {/* Livability Evaluation */}
              {(() => {
                const evaluation = evaluateCommunity(selectedCommunity);
                return (
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {/* Overall Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500" />
                        宜居评估
                      </h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {evaluation.overallScore > 0 ? `${evaluation.overallScore}分` : '--'}
                        </div>
                        <div className="text-sm font-medium">{evaluation.rating}</div>
                      </div>
                    </div>

                    {/* Overall Score Bar */}
                    {evaluation.overallScore > 0 && (
                      <div className="mb-4">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              evaluation.overallScore >= 85 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                              evaluation.overallScore >= 70 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                              evaluation.overallScore >= 55 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                              'bg-gradient-to-r from-red-400 to-red-500'
                            }`}
                            style={{ width: `${evaluation.overallScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-600 dark:text-slate-300">{evaluation.summary}</p>
                      </div>
                    </div>

                    {/* Factor Analysis */}
                    {evaluation.factors.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">详细评估</h5>
                        {evaluation.factors.map((factor, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {factor.rating === 'excellent' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                                {factor.rating === 'good' && <ThumbsUp className="h-4 w-4 text-blue-500" />}
                                {factor.rating === 'fair' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                                {factor.rating === 'poor' && <ThumbsDown className="h-4 w-4 text-red-500" />}
                                <span className="font-medium text-slate-800 dark:text-white">{factor.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      factor.score >= 80 ? 'bg-emerald-500' :
                                      factor.score >= 60 ? 'bg-blue-500' :
                                      factor.score >= 40 ? 'bg-amber-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${factor.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8">
                                  {factor.score}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{factor.explanation}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 italic">💡 {factor.tips}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {evaluation.factors.length === 0 && (
                      <div className="text-center py-4 text-slate-400">
                        暂无足够数据进行详细评估
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Top 10 Cities Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Top 10 城市
        </h3>
        <div className="space-y-3">
          {stats.topCities.slice(0, 10).map(({ city, count }, index) => (
            <div 
              key={city} 
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
              onClick={() => { setSelectedCity(city); setSearchCommunity(''); }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-slate-100 text-slate-600' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-slate-50 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {index + 1}
              </div>
              <div className="w-24 text-sm font-medium text-slate-700 dark:text-slate-200">{city}</div>
              <div className="flex-1">
                <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                  <div 
                    className={`h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-3 ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                      index === 1 ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                      index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                      'bg-gradient-to-r from-emerald-400 to-teal-500'
                    }`}
                    style={{ width: `${(count / maxCityCount) * 100}%` }}
                  >
                    <span className="text-white text-sm font-bold">{count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Note */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
        📊 数据来源：全国小区数据库 | 样本量：{stats.total.toLocaleString()} 个小区 | 点击城市或小区查看详情
      </div>
    </div>
  );
};

export default CommunityDataPanel;
