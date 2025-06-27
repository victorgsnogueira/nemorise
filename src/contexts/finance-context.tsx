"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import ky from 'ky';
import { Card, Category, Expense, Income, Investment } from '@prisma/client';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

// Interfaces for our state and actions
interface FinanceState {
  cards: Card[];
  categories: Category[];
  expenses: ExpenseWithRelations[];
  incomes: IncomeWithRelations[];
  investments: Investment[];
  allExpenses: ExpenseWithRelations[]; // Store all expenses unfiltered by month
  allIncomes: IncomeWithRelations[];   // Store all incomes unfiltered by month
  allInvestments: Investment[];        // Store all investments unfiltered by month
  selectedMonth: Date;
  isLoaded: boolean;
  error: string | null;
}

export type ExpenseWithRelations = Expense & {
  category: Category;
  card: Card | null;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  installmentGroupId?: string | null;
};

export type IncomeWithRelations = Income & {
  category: Category;
};

export type ExpenseCreationData = Omit<Expense, 'id' | 'userId' | 'installmentNumber' | 'totalInstallments' | 'installmentGroupId'>;

type FinanceAction =
  | { type: 'SET_INITIAL_DATA'; payload: { cards: Card[]; categories: Category[], expenses: ExpenseWithRelations[], incomes: IncomeWithRelations[], investments: Investment[] } }
  | { type: 'SET_MONTH'; payload: Date }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_CARD'; payload: Card }
  | { type: 'UPDATE_CARD'; payload: Card }
  | { type: 'DELETE_CARD'; payload: string } // id of the card
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: ExpenseWithRelations }
  | { type: 'ADD_EXPENSES'; payload: ExpenseWithRelations[] }
  | { type: 'UPDATE_EXPENSE'; payload: ExpenseWithRelations }
  | { type: 'DELETE_EXPENSE'; payload: string } // id of the expense
  | { type: 'ADD_INCOME'; payload: IncomeWithRelations }
  | { type: 'UPDATE_INCOME'; payload: IncomeWithRelations }
  | { type: 'DELETE_INCOME'; payload: string } // id of the income
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: string }; // id of the investment

// The initial state of our context
const initialState: FinanceState = {
  cards: [],
  categories: [],
  expenses: [],
  incomes: [],
  investments: [],
  allExpenses: [],
  allIncomes: [],
  allInvestments: [],
  selectedMonth: new Date(),
  isLoaded: false,
  error: null,
};

// Reducer function to handle state changes
function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'SET_INITIAL_DATA': {
      const { expenses, incomes, investments } = action.payload;
      const selectedMonth = state.selectedMonth;
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);

      const filteredExpenses = expenses.filter(e => isWithinInterval(new Date(e.date), { start: monthStart, end: monthEnd }));
      const filteredIncomes = incomes.filter(i => isWithinInterval(new Date(i.date), { start: monthStart, end: monthEnd }));
      const filteredInvestments = investments.filter(i => isWithinInterval(new Date(i.date), { start: monthStart, end: monthEnd }));

      return {
        ...state,
        ...action.payload,
        allExpenses: expenses,
        allIncomes: incomes,
        allInvestments: investments,
        expenses: filteredExpenses,
        incomes: filteredIncomes,
        investments: filteredInvestments,
        isLoaded: true,
        error: null
      };
    }
    case 'SET_MONTH': {
        const selectedMonth = action.payload;
        const monthStart = startOfMonth(selectedMonth);
        const monthEnd = endOfMonth(selectedMonth);

        const filteredExpenses = state.allExpenses.filter(e => isWithinInterval(new Date(e.date), { start: monthStart, end: monthEnd }));
        const filteredIncomes = state.allIncomes.filter(i => isWithinInterval(new Date(i.date), { start: monthStart, end: monthEnd }));
        const filteredInvestments = state.allInvestments.filter(i => isWithinInterval(new Date(i.date), { start: monthStart, end: monthEnd }));

        return { 
            ...state, 
            selectedMonth,
            expenses: filteredExpenses,
            incomes: filteredIncomes,
            investments: filteredInvestments,
        };
    }
    case 'SET_LOADING':
      return { ...state, isLoaded: !state.isLoaded };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoaded: false };
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id ? action.payload : card
        ),
      };
    case 'DELETE_CARD':
      return { ...state, cards: state.cards.filter((card) => card.id !== action.payload) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter((category) => category.id !== action.payload) };
    case 'ADD_EXPENSE':
      return financeReducer(state, { type: 'ADD_EXPENSES', payload: [action.payload] });
    case 'ADD_EXPENSES': {
      const newAllExpenses = [...state.allExpenses, ...action.payload].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const monthStart = startOfMonth(state.selectedMonth);
      const monthEnd = endOfMonth(state.selectedMonth);
      const filteredExpenses = newAllExpenses.filter(e => isWithinInterval(new Date(e.date), { start: monthStart, end: monthEnd }));

      return {
        ...state,
        allExpenses: newAllExpenses,
        expenses: filteredExpenses,
      };
    }
    case 'UPDATE_EXPENSE': {
      const updatedAllExpenses = state.allExpenses.map((expense) =>
        expense.id === action.payload.id ? action.payload : expense
      );
      const monthStart = startOfMonth(state.selectedMonth);
      const monthEnd = endOfMonth(state.selectedMonth);
      const filteredExpenses = updatedAllExpenses.filter(e => isWithinInterval(new Date(e.date), { start: monthStart, end: monthEnd }));

      return {
        ...state,
        allExpenses: updatedAllExpenses,
        expenses: filteredExpenses,
      };
    }
    case 'DELETE_EXPENSE': {
      const newAllExpenses = state.allExpenses.filter((expense) => expense.id !== action.payload);
      const monthStart = startOfMonth(state.selectedMonth);
      const monthEnd = endOfMonth(state.selectedMonth);
      const filteredExpenses = newAllExpenses.filter(e => isWithinInterval(new Date(e.date), { start: monthStart, end: monthEnd }));
      
      return { 
        ...state, 
        allExpenses: newAllExpenses,
        expenses: filteredExpenses,
      };
    }
    case 'ADD_INCOME':
      return { ...state, incomes: [...state.incomes, action.payload] };
    case 'UPDATE_INCOME':
      return {
        ...state,
        incomes: state.incomes.map((income) =>
          income.id === action.payload.id ? action.payload : income
        ),
      };
    case 'DELETE_INCOME':
      return { ...state, incomes: state.incomes.filter((income) => income.id !== action.payload) };
    case 'ADD_INVESTMENT':
      return { ...state, investments: [...state.investments, action.payload] };
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map((investment) =>
          investment.id === action.payload.id ? action.payload : investment
        ),
      };
    case 'DELETE_INVESTMENT':
      return { ...state, investments: state.investments.filter((investment) => investment.id !== action.payload) };
    default:
      return state;
  }
}

// Creating the context
type FinanceContextType = {
  state: FinanceState;
  dispatch: Dispatch<FinanceAction>;
  addCard: (card: Omit<Card, 'id' | 'userId'>) => Promise<void>;
  updateCard: (card: Card) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'userId'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addExpense: (expense: ExpenseCreationData) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addIncome: (income: Omit<Income, 'id' | 'userId'>) => Promise<void>;
  updateIncome: (income: Income) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateInvestment: (investment: Investment) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  getDashboardStats: () => {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    pendingIncome: number;
    pendingExpenses: number;
  };
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Provider component
export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [cards, categories, expenses, incomes, investments] = await Promise.all([
          ky.get('/api/cards').json<Card[]>(),
          ky.get('/api/categories').json<Category[]>(),
          ky.get('/api/expenses').json<ExpenseWithRelations[]>(),
          ky.get('/api/incomes').json<IncomeWithRelations[]>(),
          ky.get('/api/investments').json<Investment[]>(),
        ]);
        dispatch({ type: 'SET_INITIAL_DATA', payload: { cards, categories, expenses, incomes, investments } });
      } catch (error) {
        console.error("Failed to fetch initial data", error);
        dispatch({ type: 'SET_ERROR', payload: "Failed to load data." });
      }
    }
    fetchInitialData();
  }, []);

  const addCard = async (card: Omit<Card, 'id' | 'userId'>) => {
    const newCard: Card = await ky.post('/api/cards', { json: card }).json();
    dispatch({ type: 'ADD_CARD', payload: newCard });
  };

  const updateCard = async (card: Card) => {
    const updatedCard: Card = await ky.put(`/api/cards/${card.id}`, { json: card }).json();
    dispatch({ type: 'UPDATE_CARD', payload: updatedCard });
  };

  const deleteCard = async (id: string) => {
    await ky.delete(`/api/cards/${id}`);
    dispatch({ type: 'DELETE_CARD', payload: id });
  };

  const addCategory = async (category: Omit<Category, 'id' | 'userId'>) => {
    const newCategory: Category = await ky.post('/api/categories', { json: category }).json();
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const updateCategory = async (category: Category) => {
    const updatedCategory: Category = await ky.put(`/api/categories/${category.id}`, { json: category }).json();
    dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
  };

  const deleteCategory = async (id: string) => {
    await ky.delete(`/api/categories/${id}`);
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const addExpense = async (expenseData: ExpenseCreationData) => {
    try {
      const newExpenses: ExpenseWithRelations[] = await ky.post('/api/expenses', { json: expenseData }).json();
      dispatch({ type: 'ADD_EXPENSES', payload: newExpenses });
    } catch (error) {
      console.error('Failed to add expense', error);
      // TODO: Add error notification to the user
    }
  };

  const updateExpense = async (expense: Expense) => {
    try {
      const updatedExpense: ExpenseWithRelations = await ky.put(`/api/expenses`, { json: expense }).json();
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    } catch (error) {
      console.error('Failed to update expense', error);
      // TODO: Add error notification
    }
  };

  const deleteExpense = async (id: string) => {
    try {
        await ky.delete('/api/expenses', { json: { id } });
        dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
        console.error('Failed to delete expense', error);
        // TODO: Add error notification
    }
  };

  const addIncome = async (incomeData: Omit<Income, 'id' | 'userId'>) => {
    const newIncome: IncomeWithRelations = await ky.post('/api/incomes', { json: incomeData }).json();
    if (!newIncome.category) {
        newIncome.category = state.categories.find(c => c.id === newIncome.categoryId)!;
    }
    dispatch({ type: 'ADD_INCOME', payload: newIncome });
  };

  const updateIncome = async (income: Income) => {
    const updatedIncome: IncomeWithRelations = await ky.put(`/api/incomes/${income.id}`, { json: income }).json();
    if (!updatedIncome.category) {
        updatedIncome.category = state.categories.find(c => c.id === updatedIncome.categoryId)!;
    }
    dispatch({ type: 'UPDATE_INCOME', payload: updatedIncome });
  };

  const deleteIncome = async (id: string) => {
    await ky.delete(`/api/incomes/${id}`);
    dispatch({ type: 'DELETE_INCOME', payload: id });
  };

  const addInvestment = async (investmentData: Omit<Investment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newInvestment: Investment = await ky.post('/api/investments', { json: investmentData }).json();
    dispatch({ type: 'ADD_INVESTMENT', payload: newInvestment });
  };

  const updateInvestment = async (investment: Investment) => {
    const updatedInvestment: Investment = await ky.put('/api/investments', { json: investment }).json();
    dispatch({ type: 'UPDATE_INVESTMENT', payload: updatedInvestment });
  };

  const deleteInvestment = async (id: string) => {
    await ky.delete(`/api/investments/${id}`);
    dispatch({ type: 'DELETE_INVESTMENT', payload: id });
  };

  const getDashboardStats = () => {
    const totalIncome = state.incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    const pendingIncome = state.incomes.filter(inc => !inc.isReceived).length;
    const pendingExpenses = state.expenses.filter(exp => !exp.isPaid).length;

    return { totalIncome, totalExpenses, balance, pendingIncome, pendingExpenses };
  };

  const value = {
    state,
    dispatch,
    addCard,
    updateCard,
    deleteCard,
    addCategory,
    updateCategory,
    deleteCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    getDashboardStats,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

// Custom hook to use the context
export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
} 