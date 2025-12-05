import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Bell, Calendar as CalendarIcon } from 'lucide-react';

interface PaymentEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  reminder?: boolean;
}

interface PaymentCalendarProps {
  onDateSelect: (year: number, month: number) => void;
  selectedYear: number;
  selectedMonth: number;
  paymentData?: Array<{ year: number; month: number; principalRatio: number }>;
  t: any;
}

const PaymentCalendar: React.FC<PaymentCalendarProps> = ({ 
  onDateSelect, 
  selectedYear, 
  selectedMonth,
  paymentData = [],
  t 
}) => {
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const [currentMonth, setCurrentMonth] = useState(selectedMonth);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', reminder: false });

  // Load events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('paymentEvents');
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('paymentEvents', JSON.stringify(events));
  }, [events]);

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    onDateSelect(currentYear, currentMonth);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return;
    
    const event: PaymentEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEvent.title,
      description: newEvent.description,
      reminder: newEvent.reminder
    };
    
    setEvents([...events, event]);
    setNewEvent({ title: '', description: '', reminder: false });
    setShowEventModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr);
  };

  const getPaymentDataForMonth = (year: number, month: number) => {
    return paymentData.find(d => d.year === year && d.month === month);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateStr);
      const isSelected = selectedDate === dateStr;
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`aspect-square p-1 rounded-xl cursor-pointer transition-all duration-200 relative group ${
            isSelected 
              ? 'bg-indigo-500 text-white shadow-lg scale-105' 
              : isToday
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="text-xs font-bold text-center">{day}</div>
          {dayEvents.length > 0 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              {dayEvents.slice(0, 3).map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </button>
        
        <div className="text-center">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            {currentYear}年 {monthNames[currentMonth]}
          </div>
        </div>
        
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-400 dark:text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendarDays()}
      </div>

      {/* Events for Selected Date */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {selectedDate} {t.events || '事件'}
            </div>
            <button
              onClick={() => setShowEventModal(true)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-3 w-3 text-indigo-500" />
            </button>
          </div>
          
          {selectedDateEvents.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-2">{t.noEvents || '暂无事件'}</div>
          ) : (
            <div className="space-y-2">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="flex items-start justify-between p-2 bg-white dark:bg-slate-900 rounded-lg">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-700 dark:text-white flex items-center gap-1">
                      {event.title}
                      {event.reminder && <Bell className="h-3 w-3 text-amber-500" />}
                    </div>
                    {event.description && (
                      <div className="text-[10px] text-slate-500 mt-0.5">{event.description}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <X className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.addEvent || '添加事件'}</h3>
              <button onClick={() => setShowEventModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                  {t.eventTitle || '标题'}
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={t.eventTitlePlaceholder || "例如：提前还款"}
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                  {t.eventDescription || '描述（可选）'}
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  rows={2}
                  placeholder={t.eventDescPlaceholder || "添加更多详情..."}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={newEvent.reminder}
                  onChange={(e) => setNewEvent({ ...newEvent, reminder: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="reminder" className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Bell className="h-3 w-3" /> {t.setReminder || '设置提醒'}
                </label>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowEventModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                {t.cancel || '取消'}
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white transition-colors text-sm font-bold"
              >
                {t.add || '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCalendar;
