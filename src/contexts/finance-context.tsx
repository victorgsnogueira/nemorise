"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import ky from 'ky';
import { Card, Category, Expense, Income } from '@prisma/client';

// Interfaces for our state and actions
interface FinanceState {
  cards: Card[];
  categories: Category[];
  expenses: ExpenseWithRelations[];
  incomes: IncomeWithRelations[];
  isLoaded: boolean;
  error: string | null;
}

export type ExpenseWithRelations = Expense & {
  category: Category;
  card: Card | null;
};

export type IncomeWithRelations = Income & {
  category: Category;
};

type FinanceAction =
  | { type: 'SET_INITIAL_DATA'; payload: { cards: Card[]; categories: Category[], expenses: ExpenseWithRelations[], incomes: IncomeWithRelations[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_CARD'; payload: Card }
  | { type: 'UPDATE_CARD'; payload: Card }
  | { type: 'DELETE_CARD'; payload: string } // id of the card
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: ExpenseWithRelations }
  | { type: 'UPDATE_EXPENSE'; payload: ExpenseWithRelations }
  | { type: 'DELETE_EXPENSE'; payload: string } // id of the expense
  | { type: 'ADD_INCOME'; payload: IncomeWithRelations }
  | { type: 'UPDATE_INCOME'; payload: IncomeWithRelations }
  | { type: 'DELETE_INCOME'; payload: string }; // id of the income

// The initial state of our context
const initialState: FinanceState = {
  cards: [],
  categories: [],
  expenses: [],
  incomes: [],
  isLoaded: false,
  error: null,
};

// Reducer function to handle state changes
function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return { ...state, ...action.payload, isLoaded: true, error: null };
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
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((expense) => expense.id !== action.payload) };
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
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addIncome: (income: Omit<Income, 'id' | 'userId'>) => Promise<void>;
  updateIncome: (income: Income) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  getDashboardStats: () => {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Provider component
export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [cards, categories, expenses, incomes] = await Promise.all([
          ky.get('/api/cards').json<Card[]>(),
          ky.get('/api/categories').json<Category[]>(),
          ky.get('/api/expenses').json<ExpenseWithRelations[]>(),
          ky.get('/api/incomes').json<IncomeWithRelations[]>(),
        ]);
        dispatch({ type: 'SET_INITIAL_DATA', payload: { cards, categories, expenses, incomes } });
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

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'userId'>) => {
    const newExpense: ExpenseWithRelations = await ky.post('/api/expenses', { json: expenseData }).json();
    if (!newExpense.category) {
        newExpense.category = state.categories.find(c => c.id === newExpense.categoryId)!;
    }
    if (newExpense.cardId && !newExpense.card) {
        newExpense.card = state.cards.find(c => c.id === newExpense.cardId) || null;
    }
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
  };

  const updateExpense = async (expense: Expense) => {
    const updatedExpense: ExpenseWithRelations = await ky.put(`/api/expenses/${expense.id}`, { json: expense }).json();
    if (!updatedExpense.category) {
        updatedExpense.category = state.categories.find(c => c.id === updatedExpense.categoryId)!;
    }
    if (updatedExpense.cardId && !updatedExpense.card) {
        updatedExpense.card = state.cards.find(c => c.id === updatedExpense.cardId) || null;
    }
    dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
  };

  const deleteExpense = async (id: string) => {
    await ky.delete(`/api/expenses/${id}`);
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
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

  const getDashboardStats = () => {
    const totalIncome = state.incomes.reduce(
      (acc, income) => acc + income.amount,
      0,
    );
    const totalExpenses = state.expenses.reduce(
      (acc, expense) => acc + expense.amount,
      0,
    );
    const balance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      balance,
    };
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