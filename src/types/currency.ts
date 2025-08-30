import { Day, Month, MonthName, Year } from "./date";

export type CurrencyIndicator = 'Курс доллара' | 'Курс евро' | 'Курс юаня';

// const d1: DateLiteral = '2016-02-01'; // ok
// const d2: DateLiteral = '2016-13-01'; // error

export interface CurrencyData {
    date: `${Year}-${Month}-${Day}`; // строго YYYY-MM-DD
    month: `${MonthName} ${Year}`;   // "фев 2016" и т.д.
    indicator: CurrencyIndicator;
    value: number;
}
