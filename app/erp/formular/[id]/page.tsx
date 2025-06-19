'use client'

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Config } from "@/app/Config";
import Modal from "../../components/Modal";
import { FormularInterface } from "@/app/interface/FormularInterface";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { MaterialInterface } from "@/app/interface/MaterialInterface";
import { useParams } from "next/navigation";

export default function Formular() {
    const [formulars, setFormulars] = useState<FormularInterface[]>([]);
    const [production, setProduction] = useState<ProductionInterface | null>(null);
    const [materials, setMaterials] = useState<MaterialInterface[]>([]);
    const [materialId, setMaterialId] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState<number>(0);
    const [unit, setUnit] = useState<string>('');
    const { id } = useParams();

    useEffect(() => {
        fetchProductionData();
        fetchMaterialsData();
        fetchFormulars();
    }, [])

    const fetchProductionData = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/productions/${id}`);
            if (response.status === 200) {
                setProduction(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            });
        }
    }

    const fetchMaterialsData = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/materials`);
            if (response.status === 200) {
                setMaterials(response.data);
                setMaterialId(response.data[0].id);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            });
        }
    }

    const fetchFormulars = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/formulars/${id}`);
            if (response.status == 200) {
                setFormulars(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            });
        }
    }

    const handleSave = async () => {
        try {
            const payload = {
                production: {
                    id: production?.id
                },
                material: {
                    id: materialId
                },
                quantity: quantity,
                unit: unit
            }
            const response = await axios.post(`${Config.apiUrl}/api/formulars`, payload);
            
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Formular Saved',
                    timer: 2000
                });
                closeModal();
                fetchFormulars();
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            });
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
                const response = await axios.delete(`${Config.apiUrl}/api/formulars/${id}`);
                if (response.status == 200) {
                    fetchFormulars();
                }
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            });
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setQuantity(0);
        setUnit('');
    }

    return (
        <div className="container p-4">
            <h1 className="text-2xl font-bold mb-5">Recipes for {production?.name}</h1>
            <div className="flex flex-col gap-2 mt-3">
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
                                <th>Ingredient</th>
                                <th className="w-[100px]" style={{textAlign: 'right'}}>Quantity</th>
                                <th className="w-[100px]">Unit</th>
                                <th className="w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {formulars.map((formular) => (
                                <tr key={formular.id}>
                                    <td>{formular.material.name}</td>
                                    <td className="text-right">{formular.quantity}</td>
                                    <td>{formular.unit}</td>
                                    <td className="text-center">
                                        <button className="table-action-btn table-delete-btn"
                                            onClick={() => handleDelete(formular.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <Modal title="Add Ingredients" onClose={closeModal}>
                        <div className="modal-content">
                            <div className="mb-4">
                                <label htmlFor="material" className="block mb-2">Material</label>
                                <select id="material" value={materialId} 
                                    onChange={(e) => setMaterialId(Number(e.target.value))}>
                                    {materials.map((material) => (
                                        <option key={material.id} value={material.id}>
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="quantity" className="block mb-2">Quantity</label>
                                <input type="number" id="quantity" value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value))}/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="unit" className="block mb-2">Unit</label>
                                <input type="text" id="unit" value={unit} 
                                    onChange={(e) => setUnit(e.target.value)}/>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className="modal-btn modal-btn-submit" onClick={handleSave}>
                                    <i className="fas fa-check mr-2"></i>
                                    Save
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}