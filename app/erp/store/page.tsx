'use client'

import { Config } from "@/app/Config";
import { StoreInterface } from "@/app/interface/StoreInterface"
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { StoreImportInterface } from "@/app/interface/StoreImportInterface";

export default function Store() {
    const [stores, setStores] = useState<StoreInterface[]>([]);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [remark, setRemark] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [productionId, setProductionId] = useState<number>(0);

    // modal import to store
    const [showModalImport, setShowModalImport] = useState<boolean>(false);
    const [totalProductionLog, setTotalProductionLog] = useState<number>(0);
    const [totalProductionLost, setTotalProductionLost] = useState<number>(0);
    const [totalProductionFree, setTotalProductionFree] = useState<number>(0);
    const [remarkImport, setRemarkImport] = useState<string>('');
    const [quantityImport, setQuantityImport] = useState<number>(0);

    // modal history
    const [showModalHistory, setShowModalHistory] = useState<boolean>(false);
    const [storeImports, setStoreImports] = useState<StoreImportInterface[]>([]);

    useEffect(() => {
        fetchStores();
        fetchProductions();
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

    const fetchProductions = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/productions`);
            if (response.status === 200) {
                setProductions(response.data);
                changeProduction(response.data[0].id);
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
                icon: 'question',
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

    const handleEdit = (store: StoreInterface) => {
        setId(store.id);
        setName(store.name);
        setAddress(store.address);
        setRemark(store.remark);
        setShowModal(true);
        // const store = stores.find(s => s.id === id);
        // if (store) {
        //     setId(store.id);
        //     setName(store.name);
        //     setAddress(store.address);
        //     setRemark(store.remark);
        //     setShowModal(true);
        // }
    }

    const handleAdd = () => {
        setId(0);
        setName('');
        setAddress('');
        setRemark('');
        openModal();
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setName('');
        setAddress('');
        setRemark('');
    }

    const changeProduction = async (id: number) => {
        setProductionId(id);
        try {
            const response = await axios.get(`${Config.apiUrl}/api/store/data-for-import/${id}`);
            if (response.status === 200) {
                const data = response.data;
                const pLog = data.totalProductionLog ?? 0;
                const pLost = data.totalProductionLost ?? 0
                const pFree = pLog - pLost;
                setTotalProductionLog(pLog);
                setTotalProductionLost(pLost);
                setTotalProductionFree(pFree);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            const payload = {
                production: {
                    id: productionId
                },
                store: {
                    id: id
                },
                quantity: quantityImport,
                remark: remarkImport,
                importDate: new Date().toISOString()
            }
            const response = await axios.post(`${Config.apiUrl}/api/store/import`, payload);
            if (response.status === 200) {
                closeModalImport();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Import to store successfully!',
                    timer: 2000
                })
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const openModalImport = (id: number) => {
        setId(id);
        setShowModalImport(true);
    }

    const closeModalImport = () => {
        setShowModalImport(false);
    }

    const fetchStoreImports = async (id: number) => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/store/import/${id}`);
            if (response.status === 200) {
                setStoreImports(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const handleDeleteImport = async (id: number) => {
        const button = await Swal.fire({
            icon: 'question',
            title: 'Confirm to Delete!',
            text: 'Are you sure you want to delete this item ?',
            showCancelButton: true,
            showConfirmButton: true
        })
        try {
            if (button.isConfirmed) {
                await axios.delete(`${Config.apiUrl}/api/store/import/${id}`);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const openModalHistory = (id: number) => {
        setShowModalHistory(true);
        setId(id);
        fetchStoreImports(id);
    }

    const closeModalHistory = () => {
        setShowModalHistory(false);
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
                                            onClick={() => openModalImport(store.id)}>
                                            <i className="fas fa-plus mr-2"></i>
                                            Import stock
                                        </button>
                                        <button className="table-action-btn table-edit-btn"
                                            onClick={() => openModalHistory(store.id)}>
                                            <i className="fas fa-history mr-2"></i>
                                            History
                                        </button>
                                        <button className="table-action-btn table-edit-btn"
                                            onClick={() => handleEdit(store)}>
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

            {showModalImport && (
                <Modal id="import-stock" title="Import to Stock" onClose={closeModalImport}>
                    <form onSubmit={(e) => handleImport(e)}>
                        <div className="mb-3">
                            <label>Imported Production</label>
                            <select className="input-field" value={productionId}
                                onChange={(e) => changeProduction(Number(e.target.value))}>
                                {productions.map((production) => (
                                    <option key={production.id} value={production.id}>
                                        {production.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label>Quantity</label>
                            <input type="number" className="input-field" readOnly disabled 
                                value={totalProductionLog}/>
                        </div>

                        <div className="mb-3">
                            <label>Lost/Defected</label>
                            <input type="number" className="input-field" readOnly disabled 
                                value={totalProductionLost}/>
                        </div>

                        <div className="mb-3">
                            <label>Remaining</label>
                            <input type="number" className="input-field" readOnly disabled 
                                value={totalProductionFree}/>
                        </div>

                        <div className="mb-3">
                            <label>Imported In-stock</label>
                            <input type="number" className="input-field" value={quantityImport} 
                                onChange={(e) => setQuantityImport(Number(e.target.value))}/>
                        </div>

                        <div className="mb-3">
                            <label>Remark</label>
                            <input type="text" className="input-field" value={remarkImport} 
                                onChange={(e) => setRemarkImport(e.target.value)}/>
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                            <button type="button" onClick={closeModalImport} 
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </button>
                            <button type="submit" className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {showModalHistory && (
                <Modal id="history" title="Importing Stock History" onClose={closeModalHistory} size="2xl">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Production</th>
                                    <th>Amount</th>
                                    <th>Remark</th>
                                    <th>Date</th>
                                    <th className="w-[60px]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {storeImports.map((storeImport) => (
                                    <tr key={storeImport.id}>
                                        <td>{storeImport.production?.name}</td>
                                        <td>{storeImport.quantity}</td>
                                        <td>{storeImport.remark}</td>
                                        <td>{new Date(storeImport.importDate).toLocaleDateString()}</td>
                                        <td>
                                            <button className="table-action-btn table-delete-btn"
                                                onClick={() => handleDeleteImport(storeImport.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
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