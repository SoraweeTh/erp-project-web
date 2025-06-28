'use client'

import { Config } from "@/app/Config";
import { BillSaleDetailInterface } from "@/app/interface/BillSaleDetailInterface";
import { BillSaleInterface } from "@/app/interface/BillSaleInterface";
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";

export default function BillSales() {
    const [billSales, setBillSales] = useState<BillSaleInterface[]>([]);
    const [billSaleDetails, setBillSaleDetails] = useState<BillSaleDetailInterface[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/report/bill-sales`);
            if (response.status === 200) {
                setBillSales(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message
            })
        }
    }

    const handleGetBillSaleDetail = async (billSaleId: number) => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/report/bill-sales-detail/${billSaleId}`);
            if (response.status === 200) {
                setBillSaleDetails(response.data);
                openModal();
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message
            })
        }
    }

    const handleDelete = async (id: number) => {
        const button = await Swal.fire({
            icon: 'question',
            title: 'Confirm to Delete!',
            text: 'Are you sure you want to delete this item ?',
            showCancelButton: true,
            showConfirmButton: true
        })
        try {
            if (button.isConfirmed) {
                const response = await axios.delete(`${Config.apiUrl}/api/report/bill-sales/${id}`);
                if (response.status === 200) {
                    fetchData();
                }
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message
            })
        }
    }

    const handlePaid = async (id: number) => {
        const button = await Swal.fire({
            icon: 'question',
            title: 'Confirm to Bill',
            text: 'Are you sure you want to update bill for this item ?',
            showCancelButton: true,
            showConfirmButton: true
        })
        try {
            if (button.isConfirmed) {
                const response = await axios.put(`${Config.apiUrl}/api/report/bill-sales/${id}`);
                if (response.status === 200) {
                    fetchData();
                }
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message
            })
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-5">Bill Sales</h1>
            <div className="table-container mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="w-[80px]">Status</th>
                            <th className="w-[60px]">Bill No.</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th className="w-[80px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSales.map((bs) => (
                            <tr key={bs.id}>
                                <td>
                                    {bs.status === 'paid'
                                        ?<div className="bg-green-600 text-white px-2 py-1 rounded-xl text-center">
                                            <i className="fas fa-check mr-2"></i>
                                            Completed
                                        </div>
                                        :<div className="bg-red-600 text-white px-2 py-1 rounded-xl text-center">
                                            <i className="fas fa-times mr-2"></i>
                                            Canceled
                                        </div>
                                    }
                                </td>
                                <td>{bs.id}</td>
                                <td>{(new Date(bs.createdAt)).toLocaleDateString()}</td>
                                <td>{bs.total}</td>
                                <td className="flex gap-1">
                                    <button className="bg-blue-600 px-3 py-2 rounded-md text-white"
                                        onClick={() => handleGetBillSaleDetail(bs.id)}>
                                        <i className="fas fa-file mr-2"></i>
                                        Detail
                                    </button>
                                    <button className="bg-red-600 px-3 py-2 rounded-md text-white"
                                        onClick={() => handleDelete(bs.id)}>
                                        <i className="fas fa-times mr-2"></i>
                                        Cancel
                                    </button>
                                    <button className="bg-green-600 px-3 py-2 rounded-md text-white"
                                        onClick={() => handlePaid(bs.id)}>
                                        <i className="fas fa-check mr-2"></i>
                                        Paid
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <Modal id="bill-detail" title="Bill Detail" onClose={closeModal} size="xl">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Production</th>
                                    <th style={{textAlign: 'right'}}>Amount</th>
                                    <th style={{textAlign: 'right'}}>Price</th>
                                    <th style={{textAlign: 'right'}}>Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billSaleDetails.map((bsd) => (
                                    <tr key={bsd.id}>
                                        <td>{bsd.production.id}</td>
                                        <td>{bsd.production.name}</td>
                                        <td className="text-right">{bsd.quantity}</td>
                                        <td className="text-right">{bsd.price.toLocaleString()}</td>
                                        <td className="text-right">{(bsd.quantity * bsd.price).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}
        </div>
    )
}