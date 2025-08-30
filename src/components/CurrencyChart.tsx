import React, { useEffect, useMemo, useState } from 'react';
import { ReactECharts } from '../Echarts/ReactECharts';
import { currenciesApi } from '../api/currenciesApi';
import type { CurrencyData } from '../data/types';
import cls from './CurrencyChart.module.css';

interface CurrencyChartProps {
    initialCurrency: 'Курс доллара' | 'Курс евро' | 'Курс юаня';
    width?: string | number;
    height?: string | number;
}

export const CurrencyChart: React.FC<CurrencyChartProps> = ({
    initialCurrency,
}) => {
    const [data, setData] = useState<CurrencyData[]>([]);
    const [currency, setCurrency] = useState(initialCurrency);

    useEffect(() => {
        currenciesApi.getAll().then((res) => setData(res));
    }, []);

    const filteredData = data.filter((d) => d.indicator === currency);

    const averageValue = useMemo(() => {
        return filteredData.length > 0
            ? filteredData.reduce((acc, cur) => acc + cur.value, 0) / filteredData.length
            : 0;
    }, [filteredData])


    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const p = params[0];
                return `${p.axisValueLabel}<br />${p.seriesName}: ${p.data}`;
            },
        },
        xAxis: {
            type: 'category',
            data: filteredData.map((d) => d.month),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: currency,
                data: filteredData.map((d) => d.value),
                type: 'line',
                smooth: true,
            },
            // {
            //     name: 'Среднее',
            //     type: 'line',
            //     data: averageValue,
            //     lineStyle: { type: 'dashed', color: '#999' },
            // },
        ],
    };

    return (
        <div className={cls.container}>
            <div className={cls.chartContainer}>
                <ReactECharts option={option} forceResize />
            </div>
            <div className={cls.controls}>
                <div style={{ marginBottom: 10 }}>
                    <button onClick={() => setCurrency('Курс доллара')}>USD</button>
                    <button onClick={() => setCurrency('Курс евро')}>EUR</button>
                    <button onClick={() => setCurrency('Курс юаня')}>CNY</button>
                </div>
                <h3>
                    {averageValue}
                </h3>
            </div>
        </div>
    );
};
