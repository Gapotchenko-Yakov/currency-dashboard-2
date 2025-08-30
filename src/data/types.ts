export type CurrencyIndicator = 'Курс доллара' | 'Курс евро' | 'Курс юаня';

type Year = `${number}${number}${number}${number}`; // 4 цифры
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`; // 01-12
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `3${0 | 1}`; // 01-31

type DateLiteral = `${Year}-${Month}-${Day}`;
type MonthName = 'янв' | 'фев' | 'мар' | 'апр' | 'май' | 'июн' | 'июл' | 'авг' | 'сент' | 'окт' | 'ноя' | 'дек';

// const d1: DateLiteral = '2016-02-01'; // ok
// const d2: DateLiteral = '2016-13-01'; // error

export interface CurrencyData {
    date: `${Year}-${Month}-${Day}`; // строго YYYY-MM-DD
    month: `${MonthName} ${Year}`;   // "фев 2016" и т.д.
    indicator: CurrencyIndicator;
    value: number;
}
