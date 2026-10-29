import React from 'react';
import { useMemo, useState, useEffect } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Search, Bell,
  ChevronDown, ArrowUpRight, ArrowDownRight, MoreHorizontal, CalendarDays,
  ShoppingBag, Car, Utensils, HeartPulse, GraduationCap, House, BriefcaseBusiness,
  Laptop, Gift, CircleDollarSign, SlidersHorizontal, X, Trash2, Pencil,
  Download, ChartNoAxesCombined, Menu, Check, RotateCcw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const initialTransactions = [
  { id: 1, title: 'Monthly salary', category: 'Salary', date: '2026-10-28', amount: 52000, type: 'income', note: 'October salary' },
  { id: 2, title: 'Grocery shopping', category: 'Food & Dining', date: '2026-10-27', amount: 2450, type: 'expense', note: 'Weekly groceries' },
  { id: 3, title: 'Apartment rent', category: 'Housing', date: '2026-10-25', amount: 12000, type: 'expense', note: 'Monthly rent' },
  { id: 4, title: 'Freelance project', category: 'Freelance', date: '2026-10-23', amount: 8500, type: 'income', note: 'Website project' },
  { id: 5, title: 'Cab rides', category: 'Transport', date: '2026-10-22', amount: 680, type: 'expense', note: 'Commute' },
  { id: 6, title: 'Electricity bill', category: 'Utilities', date: '2026-10-20', amount: 1450, type: 'expense', note: 'Monthly bill' },
  { id: 7, title: 'Coffee & lunch', category: 'Food & Dining', date: '2026-10-19', amount: 520, type: 'expense', note: 'Cafe' },
  { id: 8, title: 'Online course', category: 'Education', date: '2026-10-17', amount: 1999, type: 'expense', note: 'React course' },
  { id: 9, title: 'Gym membership', category: 'Health', date: '2026-10-15', amount: 1200, type: 'expense', note: 'Monthly membership' },
  { id: 10, title: 'Gift from family', category: 'Other', date: '2026-10-12', amount: 3000, type: 'income', note: 'Festival gift' },
];

const expenseCategories = ['Food & Dining', 'Transport', 'Housing', 'Utilities', 'Shopping', 'Health', 'Education', 'Entertainment', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const categoryColors = {
  'Food & Dining': '#f59e0b', Transport: '#3b82f6', Housing: '#8b5cf6',
  Utilities: '#14b8a6', Shopping: '#ec4899', Health: '#10b981',
  Education: '#6366f1', Entertainment: '#f97316', Other: '#94a3b8',
};
const categoryIcons = {
  'Food & Dining': Utensils, Transport: Car, Housing: House, Utilities: ZapIcon,
  Shopping: ShoppingBag, Health: HeartPulse, Education: GraduationCap,
  Entertainment: Gift, Other: CircleDollarSign, Salary: BriefcaseBusiness,
  Freelance: Laptop, Investment: TrendingUp, Gift: Gift,
};
function ZapIcon(props) { return <CircleDollarSign {...props} />; }
const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
const prettyDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('pennywise-transactions');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch { return initialTransactions; }
  });
  const [budget, setBudget] = useState(() => Number(localStorage.getItem('pennywise-budget')) || 25000);
  const [period, setPeriod] = useState('This month');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showBudget, setShowBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(budget));
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem('pennywise-transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('pennywise-budget', String(budget)), [budget]);

  const visibleTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const d = new Date(`${t.date}T12:00:00`);
      let inPeriod = true;
      if (period === 'This month') inPeriod = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (period === 'Last month') {
        const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        inPeriod = d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear();
      }
      const matchesSearch = `${t.title} ${t.category} ${t.note || ''}`.toLowerCase().includes(search.toLowerCase());
      return inPeriod && matchesSearch && (filterType === 'all' || t.type === filterType) && (filterCategory === 'all' || t.category === filterCategory);
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, period, search, filterType, filterCategory]);

  const periodTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const d = new Date(`${t.date}T12:00:00`);
      if (period === 'This month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (period === 'Last month') {
        const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear();
      }
      return true;
    });
  }, [transactions, period]);

  const income = periodTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = periodTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const budgetPercent = budget ? Math.min((expenses / budget) * 100, 100) : 0;

  const chartData = useMemo(() => {
    const now = new Date();
    const month = period === 'Last month' ? new Date(now.getFullYear(), now.getMonth() - 1, 1) : new Date(now.getFullYear(), now.getMonth(), 1);
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const group = {};
    for (let d = 1; d <= days; d++) group[d] = { day: String(d), income: 0, expenses: 0 };
    periodTransactions.forEach(t => {
      const d = new Date(`${t.date}T12:00:00`);
      if (d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()) {
        if (t.type === 'income') group[d.getDate()].income += t.amount;
        else group[d.getDate()].expenses += t.amount;
      }
    });
    return Object.values(group).filter((_, i) => i % 3 === 0 || i === days - 1);
  }, [periodTransactions, period]);

  const categoryData = useMemo(() => {
    const totals = {};
    periodTransactions.filter(t => t.type === 'expense').forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
    return Object.entries(totals).map(([name, value]) => ({ name, value, color: categoryColors[name] || '#94a3b8' })).sort((a,b) => b.value - a.value);
  }, [periodTransactions]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }
  function openAdd() { setEditing(null); setShowModal(true); }
  function saveTransaction(transaction) {
    if (editing) {
      setTransactions(prev => prev.map(t => t.id === editing.id ? { ...transaction, id: editing.id } : t));
      notify('Transaction updated successfully');
    } else {
      setTransactions(prev => [{ ...transaction, id: Date.now() }, ...prev]);
      notify('Transaction added successfully');
    }
    setShowModal(false); setEditing(null);
  }
  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
    notify('Transaction deleted');
  }
  function exportCsv() {
    const header = ['Title', 'Type', 'Category', 'Date', 'Amount (INR)', 'Note'];
    const rows = visibleTransactions.map(t => [t.title, t.type, t.category, t.date, t.amount, t.note || '']);
    const csv = [header, ...rows].map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'pennywise-transactions.csv'; a.click(); URL.revokeObjectURL(url);
    notify('CSV exported');
  }
  function resetDemo() {
    setTransactions(initialTransactions);
    setPeriod('This month'); setSearch(''); setFilterType('all'); setFilterCategory('all');
    notify('Demo data restored');
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Wallet size={21}/></div><span>Pennywise</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          <button className="nav-item active"><ChartNoAxesCombined size={18}/> Overview</button>
          <button className="nav-item" onClick={() => document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth' })}><ArrowLeftRightIcon/> Transactions</button>
          <button className="nav-item" onClick={() => setShowBudget(true)}><PiggyBank size={18}/> Budgets</button>
          <button className="nav-item" onClick={() => document.getElementById('spending')?.scrollIntoView({ behavior: 'smooth' })}><ChartNoAxesCombined size={18}/> Reports</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><PiggyBank size={19}/></div>
            <strong>Make every rupee count.</strong>
            <p>Small steps today, stronger savings tomorrow.</p>
            <button onClick={() => setShowBudget(true)}>Set your budget <ArrowUpRight size={14}/></button>
          </div>
          <div className="profile">
            <div className="avatar">HP</div><div className="profile-info"><strong>Harshita Patidar</strong><span>Personal account</span></div><MoreHorizontal size={19} className="muted"/>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={20}/></button><span>Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
          <div className="top-actions"><span className="today-label"><CalendarDays size={15}/>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span><button className="icon-btn notification-btn" aria-label="Notifications" onClick={() => notify('You’re all caught up!')}><Bell size={18}/><i/></button><button className="add-btn" onClick={openAdd}><Plus size={17}/> Add transaction</button></div>
        </header>

        <section className="welcome-row">
          <div><p className="eyebrow">YOUR FINANCES AT A GLANCE</p><h1>Good afternoon, Harshita <span>✦</span></h1><p className="welcome-subtitle">Here’s what’s happening with your money.</p></div>
          <div className="period-select"><CalendarDays size={16}/><select value={period} onChange={e => setPeriod(e.target.value)} aria-label="Date range"><option>This month</option><option>Last month</option><option>All time</option></select><ChevronDown size={14}/></div>
        </section>

        <section className="stats-grid">
          <StatCard title="Total balance" value={money(balance)} change="Income minus expenses" icon={Wallet} tone="purple" foot="Available this period"/>
          <StatCard title="Total income" value={money(income)} change="Money coming in" icon={TrendingUp} tone="green" foot="Across all income sources"/>
          <StatCard title="Total expenses" value={money(expenses)} change="Money going out" icon={TrendingDown} tone="orange" foot="Your spending this period"/>
          <StatCard title="Savings rate" value={`${income ? Math.max(0, Math.round((balance / income) * 100)) : 0}%`} change="Of your total income" icon={PiggyBank} tone="blue" foot="Keep building your savings"/>
        </section>

        <section className="content-grid">
          <div className="panel cashflow-panel">
            <div className="panel-heading"><div><h2>Cash flow</h2><p>Track your income and spending over time</p></div><span className="chart-legend"><i className="legend-income"/> Income <i className="legend-expense"/> Expenses</span></div>
            <div className="chart-summary"><strong>{money(income)}</strong><span>income</span><b>{money(expenses)}</b><span>expenses</span></div>
            <div className="area-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 6, left: -17, bottom: 0 }}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b7cf6" stopOpacity={0.22}/><stop offset="100%" stopColor="#8b7cf6" stopOpacity={0.01}/></linearGradient><linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f4a261" stopOpacity={0.16}/><stop offset="100%" stopColor="#f4a261" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#edf0f6"/><XAxis dataKey="day" tick={{ fill: '#98a0b3', fontSize: 11 }} axisLine={false} tickLine={false} interval={0}/><YAxis tick={{ fill: '#98a0b3', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? '₹0' : `₹${v/1000}k`}/><Tooltip formatter={(v) => money(v)} labelFormatter={v => `Day ${v}`} contentStyle={{ borderRadius: 12, border: '1px solid #e9ebf2', fontSize: 12 }}/><Area type="monotone" dataKey="income" name="Income" stroke="#8b7cf6" strokeWidth={2.5} fill="url(#incomeFill)" activeDot={{ r: 5 }}/><Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f4a261" strokeWidth={2.5} fill="url(#expenseFill)" activeDot={{ r: 5 }}/></AreaChart></ResponsiveContainer></div>
          </div>

          <div className="panel budget-panel">
            <div className="panel-heading"><div><h2>Monthly budget</h2><p>Keep spending on track</p></div><button className="subtle-icon" onClick={() => { setBudgetInput(String(budget)); setShowBudget(true); }} aria-label="Edit budget"><Pencil size={16}/></button></div>
            <div className="budget-center"><div className="budget-ring" style={{ '--progress': `${budgetPercent}%` }}><div><span>Spent so far</span><strong>{money(expenses)}</strong><small>of {money(budget)}</small></div></div></div>
            <div className="budget-details"><div><span><i className="dot purple-dot"/>Monthly limit</span><strong>{money(budget)}</strong></div><div><span><i className="dot orange-dot"/>Remaining</span><strong className={budget-expenses < 0 ? 'negative' : ''}>{money(budget-expenses)}</strong></div></div>
            <div className="budget-progress"><div><span>Budget used</span><strong>{Math.round(budget ? expenses / budget * 100 : 0)}%</strong></div><div className="progress-track"><span style={{ width: `${budgetPercent}%`, background: expenses > budget ? '#ef4444' : '#8b7cf6' }}/></div></div>
            <button className="manage-budget-btn" onClick={() => { setBudgetInput(String(budget)); setShowBudget(true); }}>Manage budget <ArrowUpRight size={15}/></button>
          </div>
        </section>

        <section className="lower-grid" id="spending">
          <div className="panel spending-panel">
            <div className="panel-heading"><div><h2>Spending by category</h2><p>See where your money goes</p></div><button className="text-btn" onClick={() => { setFilterType('expense'); document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth' }); }}>View transactions <ArrowUpRight size={14}/></button></div>
            {categoryData.length ? <div className="spending-content"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="91%" paddingAngle={3} stroke="none">{categoryData.map((entry, i) => <Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip formatter={v => money(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e9ebf2', fontSize: 12 }}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{money(expenses)}</strong><span>Total spent</span></div></div><div className="category-list">{categoryData.slice(0,5).map(item => <div className="category-row" key={item.name}><span className="category-label"><i style={{ background: item.color }}/>{item.name}</span><span className="category-amount">{money(item.value)}</span><span className="category-percent">{expenses ? Math.round(item.value / expenses * 100) : 0}%</span></div>)}</div></div> : <EmptyState text="No expenses for this period yet."/>}
          </div>
          <div className="panel insight-panel">
            <div className="insight-badge"><PiggyBank size={18}/><span>SMART INSIGHT</span></div>
            <h2>{expenses > budget ? 'You’re over budget' : 'You’re building good habits'}</h2>
            <p>{expenses > budget ? `You’ve spent ${money(expenses-budget)} more than your monthly budget. Review your categories to find room to save.` : `You have ${money(Math.max(0,budget-expenses))} left in your budget. Keep an eye on everyday spending to stay on track.`}</p>
            <div className="insight-tip"><span className="tip-icon">✦</span><span><strong>Little tip</strong> Review subscriptions and small daily purchases once a week. They can add up faster than you think.</span></div>
            <button className="insight-link" onClick={() => document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth' })}>Review your transactions <ArrowUpRight size={15}/></button>
          </div>
        </section>

        <section className="panel transactions-panel" id="transactions">
          <div className="panel-heading transactions-heading"><div><h2>Recent transactions</h2><p>Your latest money movements</p></div><button className="export-btn" onClick={exportCsv}><Download size={15}/> Export CSV</button></div>
          <div className="table-toolbar"><div className="search-box"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." aria-label="Search transactions"/></div><div className="filter-group"><SlidersHorizontal size={15}/><select value={filterType} onChange={e => setFilterType(e.target.value)} aria-label="Filter by type"><option value="all">All types</option><option value="income">Income</option><option value="expense">Expense</option></select><select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{[...new Set(transactions.map(t => t.category))].sort().map(c => <option key={c}>{c}</option>)}</select></div></div>
          <div className="table-wrap"><table><thead><tr><th>TRANSACTION</th><th>CATEGORY</th><th>DATE</th><th>AMOUNT</th><th></th></tr></thead><tbody>{visibleTransactions.slice(0,8).map(t => <TransactionRow key={t.id} transaction={t} onEdit={() => { setEditing(t); setShowModal(true); }} onDelete={() => deleteTransaction(t.id)}/>)}{visibleTransactions.length === 0 && <tr><td colSpan="5"><EmptyState text="No transactions match your filters."/></td></tr>}</tbody></table></div>
          <div className="table-footer"><span>Showing <strong>{Math.min(visibleTransactions.length,8)}</strong> of <strong>{visibleTransactions.length}</strong> transactions</span><button onClick={resetDemo}><RotateCcw size={13}/> Reset demo data</button></div>
        </section>
        <footer className="footer"><span>© 2026 Pennywise. Made for mindful money management.</span><span>Private by design · Data stored on this device</span></footer>
      </main>

      {showModal && <TransactionModal initial={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={saveTransaction}/>}
      {showBudget && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowBudget(false); }}><div className="modal-card small-modal"><div className="modal-header"><div><h2>Manage monthly budget</h2><p>Choose a spending limit for the month.</p></div><button className="icon-btn" onClick={() => setShowBudget(false)}><X size={18}/></button></div><form onSubmit={e => { e.preventDefault(); const value = Number(budgetInput); if (value > 0 && Number.isFinite(value)) { setBudget(value); setShowBudget(false); notify('Monthly budget updated'); } }}><label>Monthly budget (₹)<input type="number" min="1" step="1" required value={budgetInput} onChange={e => setBudgetInput(e.target.value)} placeholder="25000"/></label><div className="modal-actions"><button type="button" className="cancel-btn" onClick={() => setShowBudget(false)}>Cancel</button><button type="submit" className="save-btn"><Check size={16}/> Save budget</button></div></form></div></div>}
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </div>
  );
}

function ArrowLeftRightIcon() { return <TrendingUp size={18}/>; }
function StatCard({ title, value, change, icon: Icon, tone, foot }) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><div className={`stat-icon ${tone}`}><Icon size={19}/></div></div><div className="stat-value">{value}</div><div className="stat-change">{change}</div><div className="stat-foot"><span className={`mini-dot ${tone}`}/>{foot}</div></div>;
}
function TransactionRow({ transaction: t, onEdit, onDelete }) {
  const Icon = categoryIcons[t.category] || CircleDollarSign;
  return <tr><td><div className="transaction-name"><div className={`transaction-icon ${t.type}`}><Icon size={17}/></div><div><strong>{t.title}</strong>{t.note && <span>{t.note}</span>}</div></div></td><td><span className="category-pill"><i style={{ background: categoryColors[t.category] || '#8b5cf6' }}/>{t.category}</span></td><td className="date-cell">{prettyDate(t.date)}</td><td><span className={`amount ${t.type}`}>{t.type === 'income' ? '+' : '−'}{money(t.amount)}</span></td><td><div className="row-actions"><button title="Edit transaction" aria-label="Edit transaction" onClick={onEdit}><Pencil size={14}/></button><button title="Delete transaction" aria-label="Delete transaction" onClick={onDelete}><Trash2 size={14}/></button></div></td></tr>;
}
function EmptyState({ text }) { return <div className="empty-state"><CircleDollarSign size={25}/><span>{text}</span></div>; }

function TransactionModal({ initial, onClose, onSave }) {
  const [type, setType] = useState(initial?.type || 'expense');
  const [title, setTitle] = useState(initial?.title || '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [category, setCategory] = useState(initial?.category || 'Food & Dining');
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0,10));
  const [note, setNote] = useState(initial?.note || '');
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  useEffect(() => { if (!categories.includes(category)) setCategory(categories[0]); }, [type]);
  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !(Number(amount) > 0)) return;
    onSave({ title: title.trim(), amount: Number(amount), category, date, note: note.trim(), type });
  }
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div className="modal-card"><div className="modal-header"><div><h2>{initial ? 'Edit transaction' : 'Add transaction'}</h2><p>Keep your money movements up to date.</p></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18}/></button></div><form onSubmit={submit}><div className="type-toggle"><button type="button" className={type === 'expense' ? 'selected expense-selected' : ''} onClick={() => setType('expense')}><ArrowDownRight size={16}/> Expense</button><button type="button" className={type === 'income' ? 'selected income-selected' : ''} onClick={() => setType('income')}><ArrowUpRight size={16}/> Income</button></div><label>Transaction name<input autoFocus required maxLength="80" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Grocery shopping"/></label><div className="form-two-col"><label>Amount (₹)<input required type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"/></label><label>Date<input required type="date" value={date} onChange={e => setDate(e.target.value)}/></label></div><label>Category<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Note <span className="optional">(optional)</span><textarea rows="2" maxLength="180" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a short note..."/></label><div className="modal-actions"><button type="button" className="cancel-btn" onClick={onClose}>Cancel</button><button type="submit" className="save-btn"><Check size={16}/>{initial ? 'Save changes' : 'Add transaction'}</button></div></form></div></div>;
}

export default App;