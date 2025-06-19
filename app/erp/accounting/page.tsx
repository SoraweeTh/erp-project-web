'use client'

import { Config } from "@/app/Config";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";

export default function Accounting() {
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        fetchProductions();
    }, [])

    const fetchProductions = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/productions`);
            if (response.status === 200) {
                setProductions(response.data);
            }
        } catch (err: unknown) {
            const error = err as ErrorInterface
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            })
        }
    }

    const openModal = (id: number) => {
        const production = productions.find(item => item.id === id);
        if (production) {
            setId(id);
            setName(production.name);
            setPrice(production.price);
            setShowModal(true);
        }
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleUpdatePrice = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = {
                production: {
                    id: id
                },
                price: price
            }
            const response = await axios.put(`${Config.apiUrl}/api/productions/updatePrice/${id}`, payload);
            if (response.status === 200) {
                fetchProductions();
                closeModal();
            }
        } catch (err: unknown) {
            const error = err as ErrorInterface
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            })
        }
    }

    const handleChangePrice = (value: string) => {
        if (value !== null) {
            setPrice(parseFloat(value));
        }
    }

    return (
        <div className="container p-4">
            <h1 className="text-2xl font-bold mb-5">Accounting</h1>
            <div>
                <h2 className="font-bold">Products Selling Price</h2>
                <div className="table-container mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th style={{textAlign: 'right'}}>Price</th>
                                <th className="w-[180px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productions.map((production) => (
                                <tr key={production.id}>
                                    <td>{production.name}</td>
                                    <td className="text-right">{production.price ?? 0}</td>
                                    <td className="flex justify-center gap-2">
                                        <button className="table-action-btn table-edit-btn"
                                            onClick={(e) => openModal(production.id)}>
                                            <i className="fas fa-pencil"></i>
                                        </button>
                                        <button className="table-action-btn table-delete-btn">
                                            <i className="fas fa-pencil"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <Modal id="price-define" title="Selling price" onClose={closeModal}>
                    <form className="flex flex-col gap-3" onSubmit={handleUpdatePrice}>
                        <div>
                            <label>Name</label>
                            <input value={name} readOnly disabled />
                        </div>
                        <div>
                            <label>Price</label>
                            <input value={price ?? 0} onChange={(e) => handleChangePrice(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={closeModal}
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </button>
                            <button type="submit"
                                className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}