'use client'

import { Config } from "@/app/Config";
import { ReportIncomePerMonthInterface } from "@/app/interface/ReportIncomePerMonthInterface";
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

export default function Report() {
    const [report, setReport] = useState<ReportIncomePerMonthInterface[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [arrYear, setArrYear] = useState<number[]>([]);

    useEffect(() => {
        fetchData();
        fetchArrYear();
    }, [])

    useEffect(() => {
        fetchData();
    }, [year])
    
    const fetchData = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/report/sum-income-per-month/${year}`);
            if (response.status === 200) {
                setReport(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message
            })
        }
    }

    const fetchArrYear = () => {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 5;
        const arrYear = [];
        for (let i = currentYear; i >= lastYear; i--) {
            arrYear.push(i);
        }
        setArrYear(arrYear);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-5">Monthly Report</h1>
            <div className="flex gap-2 mt-5">
                <label className="flex items-center">Year</label>
                <select onChange={(e) => setYear(Number(e.target.value))}>
                    {arrYear.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            <div className="table-container mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th style={{textAlign: 'right'}}>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((i) => (
                            <tr key={i.month}>
                                <td>{i.month}</td>
                                <td className="text-right">
                                    {i.income.toLocaleString("th-TH", {minimumFractionDigits: 2})}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}