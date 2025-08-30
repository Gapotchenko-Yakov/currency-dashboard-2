// src/api/currenciesApi.ts
import { ApiClient } from './apiClient';
import type { CurrencyData } from '../types/currency';

export class CurrenciesApi extends ApiClient {

    getAll(): Promise<CurrencyData[]> {
        return this.get<CurrencyData[]>('/currencies');
    }

    getByIndicator(indicator: string): Promise<CurrencyData[]> {
        return this.get<CurrencyData[]>(`/currencies?indicator=${encodeURIComponent(indicator)}`);
    }

    getById(id: string): Promise<CurrencyData> {
        return this.get<CurrencyData>(`/currencies/${id}`);
    }

    create(data: Omit<CurrencyData, 'id'>): Promise<CurrencyData> {
        return this.post<CurrencyData>('/currencies', data);
    }

    update(id: string, data: Partial<CurrencyData>): Promise<CurrencyData> {
        return this.put<CurrencyData>(`/currencies/${id}`, data);
    }

    deleteById(id: string): Promise<void> {
        return this.delete<void>(`/currencies/${id}`);
    }
}

export const currenciesApi = new CurrenciesApi(process.env.REACT_APP_API_URL);
