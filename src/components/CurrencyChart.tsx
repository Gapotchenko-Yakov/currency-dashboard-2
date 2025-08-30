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

    const filteredData = data.filter((d) => d.indicator === mapCurrencyCodeToLabel[currency]);

    const averageValue = useMemo(() => {
        return filteredData.length > 0
            ? filteredData.reduce((acc, cur) => acc + cur.value, 0) / filteredData.length
            : 0;
    }, [filteredData]);

    const option = {
        tooltip: {
            trigger: "axis",
            formatter: (params: any) => {
                const p = params[0];
                return `${p.axisValueLabel}<br />${p.seriesName}: ${p.data}`;
            },
        },
        xAxis: { type: "category", data: filteredData.map((d) => d.month) },
        yAxis: { type: "value" },
        series: [
            {
                name: currency,
                data: filteredData.map((d) => d.value),
                type: "line",
                // smooth: true,
            },
        ],
    };

    return (
        <div
            className={`${cls.container} ${cnMixFlex({
                direction: 'row',
                wrap: 'wrap',
                justify: 'flex-start',
                align: 'flex-end',
                gap: 'xs',
            })}`}
        >
            <div className={`
            ${cls.chartContainer}
            ${cnMixFlex({
                align: 'center',
                justify: 'center'
            })}
            `}>
                <ReactECharts option={option} forceResize />
            </div>
            <div className={cnMixFlex({
                direction: 'column',
                align: 'center',
                justify: 'center'
            })}>
                <ChoiceGroup
                    value={currency}
                    onChange={({ value }) => setCurrency(value)}
                    items={currencyCodes}
                    getItemLabel={(item: CurrencyCode) => mapCurrencyCodeToSymbol[item]}
                    multiple={false}
                    name="ChoiceGroupExample"
                />
                <Text size="m" weight="bold">
                    Среднее значение: {averageValue.toFixed(2)}
                </Text>
            </div>
        </div>
    );
};
