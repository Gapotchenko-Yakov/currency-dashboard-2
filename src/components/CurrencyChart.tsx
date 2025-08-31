import { ChoiceGroup } from "@consta/uikit/ChoiceGroup";
import { cnMixFlex } from '@consta/uikit/MixFlex';
import { Text } from "@consta/uikit/Text";
import React, { useEffect, useMemo, useState } from "react";
import { ReactECharts } from "../Echarts/ReactECharts";
import { currenciesApi } from "../api/currenciesApi";
import type { CurrencyData } from "../types/currency";
import cls from './CurrencyChart.module.css';

const mapCurrencyCodeToLabel: Record<CurrencyCode, CurrencyLabel> = {
    "USD": "Курс доллара",
    "EUR": "Курс евро",
    "CNY": "Курс юаня",
}

const mapCurrencyCodeToSymbol: Record<CurrencyCode, string> = {
    USD: "$",
    EUR: "€",
    CNY: "¥",
};

type CurrencyCode = "USD" | "EUR" | "CNY";
type CurrencyLabel = "Курс доллара" | "Курс евро" | "Курс юаня"

const currencyCodes: CurrencyCode[] = [
    "USD",
    "EUR",
    "CNY",
]

interface CurrencyChartProps {
    initialCurrency: CurrencyCode;
    width?: string | number;
    height?: string | number;
}

export const CurrencyChart: React.FC<CurrencyChartProps> = ({
    initialCurrency,
}) => {
    const [data, setData] = useState<CurrencyData[]>([]);
    const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);

    useEffect(() => {
        currenciesApi.getAll().then((res) => setData(res));
    }, []);

    const {
        filteredData,
        values,
        minValue,
        maxValue,
        padding,
        averageValue,
        option,
    } = useMemo(() => {
        const filtered = data.filter(d => d.indicator === mapCurrencyCodeToLabel[currency]);
        const vals = filtered.map(d => d.value);
        const minV = vals.length ? Math.min(...vals) : 0;
        const maxV = vals.length ? Math.max(...vals) : 0;
        const pad = (maxV - minV) * 0.0;

        const avg = vals.length ? vals.reduce((acc, v) => acc + v, 0) / vals.length : 0;

        const opt = {
            color: ['#F38B00', '#00ff00', '#0000ff'],
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const p = params[0];
                    return `
                        <div style="
                            display: flex;
                            flex-direction: column;
                            border-radius: 4px;
                            gap: 8px;
                            padding: 8px;                            
                            ">
                            <strong style="color: black;">${p.axisValueLabel}</strong>
                            <div style="
                            display: flex;
                            gap: 39px;                            
                            ">
                            <span style="
                            display: flex;
                            gap: 8px;
                            justify-content: start;
                            align-items: baseline;                            
                            ">
                            <span style="
                            display:inline-block;
                            width:12px;
                            height:12px;
                            background-color:${p.color};
                            border-radius: 100%;
                            "></span>       
                            ${mapCurrencyCodeToLabel[p.seriesName as CurrencyCode]}
                            </span>
                            <strong style="color: black;">${Number(p.data).toFixed(2)} ₽</strong>
                            </div>
                        </div>
                        `;
                },
            },
            xAxis: { type: 'category', data: filtered.map(d => d.month) },
            yAxis: { type: 'value', min: minV - pad, max: maxV + pad },
            series: [{ name: currency, type: 'line', data: vals }],
        };

        return {
            filteredData: filtered,
            values: vals,
            minValue: minV,
            maxValue: maxV,
            padding: pad,
            averageValue: avg.toFixed(2),
            option: opt,
        };
    }, [data, currency]);

    return (
        <div
            className={`${cls.container} ${cnMixFlex({
                direction: 'row',
                // wrap: 'wrap',
                justify: 'flex-start',
                align: 'flex-end',
                gap: 'xs',
            })}`
            }
            style={{ borderRadius: '7px' }}
        >
            <Text className={`${cls.header} ${cls.colorPrimary}`} size="xl" weight="bold">
                КУРС ДОЛЛАРА, $/₽
            </Text>
            <div className={`${cls.chartContainer} ${cnMixFlex({
                direction: 'column',
                align: 'center',
                justify: 'center'
            })}`}>
                <ReactECharts option={option} forceResize />
            </div>
            <div className={cls.controls}>
                <ChoiceGroup
                    value={currency}
                    onChange={({ value }) => setCurrency(value)}
                    items={currencyCodes}
                    getItemLabel={(item: CurrencyCode) => mapCurrencyCodeToSymbol[item]}
                    multiple={false}
                    name="ChoiceGroupExample"
                    size="xs"
                />
            </div>
            <div className={`${cls.averageValue} ${cnMixFlex({
                direction: 'column',
                align: 'flex-end',
                justify: 'center'
            })}`}>
                <Text className={cls.colorGray} size="m">
                    Среднее за период
                </Text>
                <div className={`${cnMixFlex({
                    direction: 'row',
                    align: 'baseline',
                    gap: '2xs'
                })}`}>
                    <Text className={cls.colorOrange} size="4xl">
                        {averageValue}
                    </Text>
                    <span className={cls.colorGray}>₽</span>
                </div>
            </div>
        </div >
    );
};
