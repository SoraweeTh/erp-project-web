'use client'

import { useState, useEffect } from "react"
import Modal from "../components/Modal"
import Swal from "sweetalert2"
import axios from "axios"
import { Config } from "@/app/Config"
import { MaterialInterface } from "@/app/interface/MaterialInterface"
import Link from "next/navigation"

export default function Material() {
    const [materials, setMaterials] = useState<MaterialInterface[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [unitName, setUnitName] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        fetchMaterialData();
    }, [])

    const fetchMaterialData = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/materials`);
            if (response.status === 200) {
                setMaterials(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to get material data : ' + err.message
            });
        }
    }

    const handleAdd = () => {
        setId(0);
        setName('');
        setUnitName('');
        setQuantity(0);
        setShowModal(true);
    }

    const handleSave = async () => {
        try {
            const payload = {
                name: name,
                unitName: unitName,
                quantity: quantity
            }
            let status = 0;
            
            if (id > 0) {
                const response = await axios.put(`${Config.apiUrl}/api/materials/${id}`, payload);
                status = response.status;
                setId(0);
            } else {
                const response = await axios.post(`${Config.apiUrl}/api/materials`, payload);
                status = response.status;
            }

            if (status == 200) {
                fetchMaterialData();
                setShowModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Saved material successfully',
                    timer: 1000
                });
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to save material : ' + err.message
            });
        }
    }

    const handleEdit = (id: number) => {
        const material = materials.find(m => m.id === id);
        if (material) {
            setId(material.id);
            setName(material.name);
            setUnitName(material.unitName);
            setQuantity(material.quantity);
            setShowModal(true);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const result = await Swal.fire({
                icon: 'question',
                title: 'CONFIRM DELETE !',
                text: 'Are you sure you want to delete ?',
                showCancelButton: true,
                showConfirmButton: true
            })
            if (result.isConfirmed) {
                const response = await axios.delete(`${Config.apiUrl}/api/materials/${id}`);
                if (response.status === 200) {
                    fetchMaterialData();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Delete material successfully',
                        timer: 1000
                    });
                }
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to delete production ' + err.message
            });
        }
    }
    
    return (
        <div className="container p-4">
            <h1 className="text-2xl font-bold mb-5">Material</h1>
            <button className="button-add" onClick={handleAdd}>
                <i className="fas fa-plus mr-2"></i>
                Add
            </button>
            <div className="table-container mt-5">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="w-[120px]">Unit</th>
                            <th className="w-[120px]">Quantity</th>
                            <th className="w-[120px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((material) => (
                            <tr key={material.id}>
                                <td>{material.name}</td>
                                <td>{material.unitName}</td>
                                <td>{material.quantity}</td>
                                <td className="flex gap-2">
                                    <button onClick={() => handleEdit(material.id)}
                                        className="table-edit-btn table-action-btn">
                                        <i className="fas fa-pencil"></i>
                                    </button>
                                    <button onClick={() => handleDelete(material.id)}
                                        className="table-delete-btn table-action-btn">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <Modal title="Material" onClose={() => setShowModal(false)}>
                    <div className="flex flex-col gap-2">
                        <div className="mb-4">
                            <label>Material name</label>
                            <input type="text" value={name} 
                            onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <label>Unit</label>
                            <input type="text" value={unitName} 
                            onChange={(e) => setUnitName(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <label>Quantity</label>
                            <input type="number" value={quantity} 
                            onChange={(e) => setQuantity(Number(e.target.value || 0))}/>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowModal(false)}
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </button>
                            <button type="submit" onClick={handleSave}
                                className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                Submit
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}