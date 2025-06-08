'use client'

import { Config } from "@/app/Config";
import Modal from "@/app/erp/components/Modal";
import { ProductionInterface } from "@/app/interface/ProductionInterface"
import { ProductionLogInterface } from "@/app/interface/ProductionLogInterface";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

export default function ProductionLog() {
    const [production, setProduction] = useState<ProductionInterface | null>(null);
    const [productionLogs, setProductionLogs] = useState<ProductionLogInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [remark, setRemark] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [createdAt, setCreatedAt] = useState(new Date());
    const [productionLogId, setProductionLogId] = useState(0);

    const { id } = useParams();

    useEffect(() => {
        fetchProductionLogs();
        fetchProduction();
    }, [])

    const fetchProductionLogs = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/production-logs/${id}`);
            if (response.status == 200) {
                setProductionLogs(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const fetchProduction = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/productions/${id}`);
            if (response.status == 200) {
                setProduction(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const handleSave = async () => {
        try {
            const url = `${Config.apiUrl}/api/production-logs`;
            const payload = {
                createdAt: createdAt.toISOString(),
                quantity: quantity,
                remark: remark,
                production: {
                    id: id
                }
            }
            let status;
            if (productionLogId > 0) {
                const response = await axios.put(`${url}/${productionLogId}`, payload);
                status = response.status;
                setProductionLogId(0);
            } else {
                const response = await axios.post(url, payload);
                status = response.status;
            }

            if (status == 200) {
                closeModal();
                fetchProductionLogs();
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const confirm = await Swal.fire({
                icon: 'question',
                title: 'Confirm to Delete!',
                text: 'Are you sure you want to delete this item ?',
                showCancelButton: true,
                showConfirmButton: true
            })
            if (confirm.isConfirmed) {
                const response = await axios.delete(`${Config.apiUrl}/api/production-logs/${id}`);
                if (response.status == 200) {
                    fetchProductionLogs();
                }
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const handleEdit = (productionLog: ProductionLogInterface) => {
        setShowModal(true);
        setCreatedAt(new Date(productionLog.createdAt));
        setQuantity(productionLog.quantity);
        setRemark(productionLog.remark);
        setProductionLogId(productionLog.id);
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setCreatedAt(new Date());
        setQuantity(0);
        setRemark('');
    }

    return (
        <div className="container p-4">
            <h1 className="text-2xl font-bold mb-5">Production log : {production?.name}</h1>
            <div className="flex flex-col mt-3 gap-3">
                <div>
                    <button className="button-add" onClick={openModal}>
                        <i className="fas fa-plus mr-2"></i>
                        Add
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th style={{textAlign: 'right'}}>Quantity</th>
                                <th>Remark</th>
                                <th className="w-[120px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productionLogs.map((productionLog) => (
                                <tr key={productionLog.id}>
                                    <td>{new Date(productionLog.createdAt).toLocaleDateString()}</td>
                                    <td className="text-right">{productionLog.quantity}</td>
                                    <td>{productionLog.remark}</td>
                                    <td className="flex gap-2 justify-center">
                                        <button onClick={() => handleEdit(productionLog)}
                                            className="table-action-btn table-edit-btn">
                                            <i className="fas fa-pencil"></i>
                                        </button>
                                        <button onClick={() => handleDelete(productionLog.id)}
                                            className="table-action-btn table-delete-btn">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <Modal id="production-log-modal" title='Production Log' onClose={closeModal}>
                    <div className="modal-content">
                        <div className="mb-4">
                            <label className="block mb-2">Date</label>
                            <input type="date" value={createdAt.toISOString().split('T')[0]}
                                onChange={(e) => setCreatedAt(new Date(e.target.value))} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Quantity</label>
                            <input type="text" value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))}/>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Remark</label>
                            <input type="text" value={remark} 
                                onChange={(e) => setRemark(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={closeModal} className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </button>
                            <button type="submit" onClick={handleSave} className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                Save
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}