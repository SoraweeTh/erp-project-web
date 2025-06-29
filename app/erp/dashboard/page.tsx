'use client'

import { Config } from "@/app/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Dashboard() {
    const [sumQuantity, setSumQuantity] = useState<number>(0);
    const [sumIncome, setSumIncome] = useState<number>(0);
    const [totalProduct, setTotalProduct] = useState<number>(0);
    const [sumLost, setSumLost] = useState<number>(0);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/report/dashboard`);
            if (response.status === 200) {
                setSumQuantity(response.data.sumQty);
                setSumIncome(response.data.sumIncome);
                setTotalProduct(response.data.totalProduct);
                setSumLost(response.data.sumLost);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message
            })
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
            <div className="flex gap-2 text-end">
                <div className="flex flex-col gap-2 bg-blue-400 text-gray-50 rounded-md p-2 w-full">
                    <div>TOTAL PRODUCTION (items)</div>
                    <div>{sumQuantity.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 bg-green-700 text-gray-50 rounded-md p-2 w-full">
                    <div>TOTAL SALES (THB)</div>
                    <div>{sumIncome.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 bg-yellow-600 text-gray-50 rounded-md p-2 w-full">
                    <div>PRODUCTS</div>
                    <div>{totalProduct.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 bg-red-600 text-gray-50 rounded-md p-2 w-full">
                    <div>PRODUCT LOST (items)</div>
                    <div>{sumLost.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}