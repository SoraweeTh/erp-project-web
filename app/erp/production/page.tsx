'use client'

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import axios from "axios"
import { Config } from "@/app/Config"
import { ProductionInterface } from "@/app/interface/ProductionInterface"
import Modal from "../components/Modal"

export default function Production() {
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduction, setEditingProduction] = useState<ProductionInterface | null>(null);
    const [name, setName] = useState('');
    const [detail, setDetail] = useState('');

    useEffect(() => {
        fetchProductionData();
    }, []);

    const fetchProductionData = async () => {
        try {
            const token = localStorage.getItem(Config.TokenKey);
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            
            const response = await axios.get(`${Config.apiUrl}/api/productions`, {headers});
            if (response.status === 200) {
                setProductions(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const handleAdd = () => {
        setEditingProduction(null);
        setName('');
        setDetail('');
        setShowModal(true);
    }

    const handleEdit = (production: ProductionInterface) => {
        setEditingProduction(production);
        setName(production.name);
        setDetail(production.detail);
        setShowModal(true);
    }

    const handleDelete = async (production: ProductionInterface) => {
        try {
            const result = await Swal.fire({
                icon: 'question',
                title: 'CONFIRM DELETE !',
                text: `Are you sure you want to delete ${production.name} ?`,
                showCancelButton: true,
                showConfirmButton: true
            })
            if (result.isConfirmed) {
                const token = localStorage.getItem(Config.TokenKey);
                const headers = {
                    'Authorization': `Bearer ${token}`
                }
                await axios.delete(`${Config.apiUrl}/api/productions/${production.id}`, {headers});

                fetchProductionData();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Delete production successfully',
                    timer: 1000
                });
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to delete production ' + err.message
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem(Config.TokenKey);
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const payload = {
                name: name,
                detail: detail
            }

            if (editingProduction) {
                await axios.put(`${Config.apiUrl}/api/productions/${editingProduction.id}`, payload, {headers});
            } else {
                await axios.post(`${Config.apiUrl}/api/productions`, payload, {headers});
            }

            setShowModal(false);
            fetchProductionData();

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Saved production successfully',
                timer: 1000
            });
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            });
        }
    }

    return (
        <div className="container p-4">
            <h1 className="text-2xl font-bold mb-5">Production Information</h1>
            <div className="flex mb-6 gap-2">
                <button className="button-add" onClick={handleAdd}>
                    <i className="fas fa-plus mr-2"></i>
                    Add
                </button>
                <button className="button">
                    <i className="fas fa-box mr-2"></i>
                    Material
                </button>
            </div>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="w-[200px]">Name</th>
                            <th>Detail</th>
                            <th className="w-[120px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productions.map((production) => (
                            <tr key={production.id}>
                                <td>{production.name}</td>
                                <td>{production.detail}</td>
                                <td className="flex gap-2">
                                    <button className="button">
                                        <i className="fas fa-file-alt mr-2"></i>
                                        Recipes
                                    </button>
                                    <button className="button">
                                        <i className="fas fa-check mr-2"></i>
                                        Save
                                    </button>
                                    <button className="button">
                                        <i className="fas fa-file-alt mr-2"></i>
                                        Save loss
                                    </button>
                                    <button className="table-action-btn table-edit-btn"
                                        onClick={() => handleEdit(production)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="table-action-btn table-delete-btn"
                                        onClick={() => handleDelete(production)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <Modal id="production-modal" title="Production Information" onClose={() => setShowModal(false)} size="md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2">Name</label>
                            <input type="text" className="form-input" value={name} 
                                onChange={e => setName(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Detail</label>
                            <input type="text" className="form-input" value={detail} 
                                onChange={e => setDetail(e.target.value)}/>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowModal(false)}
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </button>
                            <button type="submit" className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                Submit
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}