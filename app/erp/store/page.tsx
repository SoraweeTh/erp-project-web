'use client'

import { Config } from "@/app/Config";
import { StoreInterface } from "@/app/interface/StoreInterface"
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";

export default function Store() {
    const [stores, setStores] = useState<StoreInterface[]>([]);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [remark, setRemark] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        fetchStores();
    }, [])

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/store`);
            if (response.status == 200) {
                setStores(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const url = `${Config.apiUrl}/api/store`;
            const payload = {
                name: name,
                address: address,
                remark: remark
            }
            let status;
            if (id > 0) {
                const response = await axios.put(`${url}/${id}`, payload);
                status = response.status;
                setId(0);
            } else {
                const response = await axios.post(`${url}`, payload);
                status = response.status;
            }

            if (status === 200) {
                closeModal();
                fetchStores();
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
            const button = await Swal.fire({
                icon: 'warning',
                title: 'Confirm to Delete!',
                text: 'Are you sure you want to delete this item ?',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (button.isConfirmed) {
                const response = await axios.delete(`${Config.apiUrl}/api/store/${id}`);
                if (response.status === 200) {
                    fetchStores();
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

    const handleEdit = (id: number) => {
        const store = stores.find(s => s.id === id);
        if (store) {
            console.log('id -> ', id);
            setId(store.id);
            setName(store.name);
            setAddress(store.address);
            setRemark(store.remark);
            setShowModal(true);
        }
        
    }

    const handleAdd = () => {
        setId(0);
        setName('');
        setAddress('');
        setRemark('');
        openModal();
    }

    const openModal = () => {
        console.log('id -> ', id)
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setName('');
        setAddress('');
        setRemark('');
    }
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-5">Store Management</h1>
            <div className="flex flex-col gap-2 mt-3">
                <div>
                    <button className="button-add" onClick={handleAdd}>
                        <i className="fas fa-plus mr-2"></i>
                        Add
                    </button>
                </div>

                <div className="table-container mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Store Name</th>
                                <th>Address</th>
                                <th>Remark</th>
                                <th className="w-[120px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <tr key={store.id}>
                                    <td>{store.name}</td>
                                    <td>{store.address}</td>
                                    <td>{store.remark}</td>
                                    <td className="flex gap-2 justify-center">
                                        <button className="table-action-btn table-edit-btn"
                                            onClick={() => handleEdit(store.id)}>
                                            <i className="fas fa-pencil"></i>
                                        </button>
                                        <button className="table-action-btn table-delete-btn"
                                            onClick={() => handleDelete(store.id)}>
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
                <Modal id="store" title="Add New Store" onClose={closeModal}>
                    <form onSubmit={(e) => handleSave(e)}>
                        <div className="flex flex-col gap-2">
                            <div>
                                <label className="">Store Name</label>
                                <input type="text" className="input-field" value={name} 
                                    onChange={(e) => setName(e.target.value)}/>
                            </div>

                            <div>
                                <label className="">Address</label>
                                <input type="text" className="input-field" value={address} 
                                    onChange={(e) => setAddress(e.target.value)}/>
                            </div>

                            <div>
                                <label className="">Remark</label>
                                <input type="text" className="input-field" value={remark} 
                                    onChange={(e) => setRemark(e.target.value)}/>
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={closeModal} 
                                    className="modal-btn modal-btn-cancel">
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </button>
                                <button type="submit" className="modal-btn modal-btn-submit">
                                    <i className="fas fa-check mr-2"></i>
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}