'use client'

import { Config } from "@/app/Config";
import Modal from "@/app/erp/components/Modal";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { ProductionLostInterface } from "@/app/interface/ProductionLostInterface";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProductionLost() {
    const [production, setProduction] = useState<ProductionInterface | null>(null);
    const [productionLosts, setProductionLosts] = useState<ProductionLostInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [remark, setRemark] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [createdAt, setCreatedAt] = useState(new Date());
    const [productionLostId, setProductionLostId] = useState(0);

    const { id } = useParams();

    useEffect(() => {
        fetchProduction();
        fetchProductionLost();
    }, [])

    const fetchProduction = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/productions/${id}`);
            if (response.status == 200) {
                setProduction(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            })
        }
    }

    const fetchProductionLost = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/production-lost/${id}`);
            if (response.status == 200) {
                setProductionLosts(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            })
        }
    }

    const handleSave = async () => {
        try {
            const url = `${Config.apiUrl}/api/production-lost`;
            const payload = {
                createdAt: createdAt.toISOString(),
                quantity: quantity,
                remark: remark,
                production: {
                    id: id
                }
            }
            let status;

            if (productionLostId > 0) {
                const response = await axios.put(`${url}/${productionLostId}`, payload);
                status = response.status;
                setProductionLostId(0);
            } else {
                const response = await axios.post(url, payload);
                status = response.status;
            }

            if (status == 200) {
                closeModal();
                fetchProductionLost();
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
        try {
            const confirm = await Swal.fire({
                icon: 'question',
                title: 'Confirm to Delete!',
                text: 'Are you sure you want to delete this item ?',
                showCancelButton: true,
                showConfirmButton: true
            });
            if (confirm.isConfirmed) {
                const response = await axios.delete(`${Config.apiUrl}/api/production-lost/${id}`);
                if (response.status == 200) {
                    fetchProductionLost();
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

    const handleEdit = (productionLost: ProductionLostInterface) => {
        setShowModal(true);
        setCreatedAt(new Date(productionLost.createdAt));
        setQuantity(productionLost.quantity);
        setRemark(productionLost.remark);
        setProductionLostId(productionLost.id);
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
            <h1 className="text-2xl font-bold mb-5">Production lost/defected : {production?.name}</h1>
            <div className="flex flex-col gap-3">
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
                                <th style={{textAlign: 'right'}} className="w-[100px]">Quantity</th>
                                <th>Remark</th>
                                <th className="w-[120px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productionLosts.map((productionLost) => (
                                <tr key={productionLost.id}>
                                    <td>{new Date(productionLost.createdAt).toLocaleDateString()}</td>
                                    <td>{productionLost.quantity}</td>
                                    <td>{productionLost.remark}</td>
                                    <td className="flex gap-2 justify-center">
                                        <button onClick={() => handleEdit(productionLost)}
                                            className="table-action-btn table-edit-btn">
                                            <i className="fas fa-pencil"></i>
                                        </button>
                                        <button onClick={() => handleDelete(productionLost.id)}
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
                <Modal id="production-lost-modal" title='Production Lost/Defected' onClose={closeModal}>
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