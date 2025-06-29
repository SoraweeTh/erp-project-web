'use client'

import { Config } from "@/app/Config";
import { ProductionInterface } from "@/app/interface/ProductionInterface"
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { SaleTempInterface } from "@/app/interface/SaleTempInterface";

export default function Sale() {
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [productSelected, setProductSelected] = useState<ProductionInterface | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [saleTemps, setSaleTemps] = useState<SaleTempInterface[]>([]);
    const [showModalEndSale, setShowModalEndSale] = useState<boolean>(false);
    const [receiveAmount, setReceiveAmount] = useState<number>(0);
    const [returnAmount, setReturnAmount] = useState<number>(0);

    useEffect(() => {
        fetchProductions();
        fetchDataSaleTemp();
    }, [])

    useEffect(() => {
        let total = 0;
        let totalQuantity = 0
        for (const saleTemp of saleTemps) {
            total = total + (saleTemp.price * saleTemp.quantity)
            totalQuantity = totalQuantity + saleTemp.quantity;
        }
        setTotal(total);
        setQuantity(totalQuantity);            
    }, [saleTemps])

    const fetchProductions = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/productions`);
            if (response.status === 200) {
                setProductions(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message
            })
        }
    }

    const fetchDataSaleTemp = async () => {
        try {
            const headers = getHeaders();
            const response = await axios.get(`${Config.apiUrl}/api/saleTemp`, {headers});
            if (response.status === 200) {
                setSaleTemps(response.data);
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

    const getHeaders = () => {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem(Config.TokenKey)
        }
        return headers;
    }

    const handleSelectedProduction = async (productions: ProductionInterface) => {
        try {
            const payload = {
                production: {
                    id: productions.id
                }
            }
            const headers = getHeaders();
            const response = await axios.post(`${Config.apiUrl}/api/saleTemp`, payload, {headers});
            if (response.status === 200) {
                fetchDataSaleTemp();
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message
            })
        }
    }

    const handleDeleteSaleTemp = async (id: number) => {
        try {
            const button = await Swal.fire({
                icon: 'question',
                title: 'Confirm to Delete!',
                showCancelButton: true,
                showConfirmButton: true
            })
            if (button.isConfirmed) {
                const headers = getHeaders();
                const response = await axios.delete(`${Config.apiUrl}/api/saleTemp/${id}`, {headers});
                if (response.status === 200) {
                    fetchDataSaleTemp();
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

    const handleEditSaleTemp = async (saleTemp: SaleTempInterface) => {
        setProductSelected(saleTemp.production);
        setQuantity(saleTemp.quantity);
        setPrice(saleTemp.price);
    }

    const handleDecQuantity = async (id: number) => {
        try {
            const saleTemp = saleTemps.find((saleTemp) => saleTemp.id === id);
            if (saleTemp && saleTemp.quantity > 1) {
                const payload = {
                    quantity: saleTemp.quantity - 1
                }
                const response = await axios.put(`${Config.apiUrl}/api/saleTemp/${id}`, payload);
                if (response.status === 200) {
                    fetchDataSaleTemp();
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

    const handleIncQuantity = async (id: number) => {
        try {
            const saleTemp = saleTemps.find((saleTemp) => saleTemp.id === id);
            if (saleTemp) {
                const payload = {
                    quantity: saleTemp.quantity + 1
                }
                const response = await axios.put(`${Config.apiUrl}/api/saleTemp/${id}`, payload);
                if (response.status === 200) {
                    fetchDataSaleTemp();
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

    const openModalEndSale = () => {
        setShowModalEndSale(true);
    }

    const closeModalEndSale = () => {
        setShowModalEndSale(false);
        setReceiveAmount(0);
        setDiscount(0);
        setReturnAmount(0);
    }

    const handleChangeAmountReceived = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        const inputValue = Number(value);
        if (!isNaN(inputValue)) {
            setReceiveAmount(inputValue);
            setReturnAmount(inputValue - (total + discount));
        }
    }

    const handleChangeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        const discountValue = Number(value);
        if (!isNaN(discountValue)) {
            setDiscount(discountValue);
            setReturnAmount(receiveAmount - (total + discountValue));
        }
    }

    const handleExactBill = () => {
        setReturnAmount(0);
        setDiscount(0);
        setReceiveAmount(total);
    }

    const handleEndSale = async () => {
        const button = await Swal.fire({
            icon: 'question',
            title: 'Confirm to Check Out',
            showCancelButton: true,
            showConfirmButton: true
        })
        try {
            if (button.isConfirmed) {
                const headers = getHeaders();
                const payload = {
                    receiveAmount: receiveAmount,
                    discount: discount,
                    total: total
                }
                const response = await axios.post(`${Config.apiUrl}/api/saleTemp/endSale`, payload, {headers});
                if (response.status === 200) {
                    closeModalEndSale();
                    fetchDataSaleTemp();
                }
            } else {
                openModalEndSale();
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
        <div className="container p-4">
            <h1 className="text-2xl font-bold mb-5">Sales</h1>
            <div className="flex justify-end gap-2">
                <button className="button" onClick={openModalEndSale}>
                    <i className="fas fa-wallet"></i>
                </button>
                <span className="text-2xl font-bold bg-gray-900 px-4 py-2 rounded-md 
                    text-green-300 border border-green-600">{total.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input type="text" placeholder="Enter product code" className="form-input" />
                    <button className="button" onClick={openModal}>
                        <i className="fas fa-search mr-3"></i>
                        Search
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th className="w-[120px]">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saleTemps.map((saleTemp) => (
                                <tr key={saleTemp.id}>
                                    <td>{saleTemp.production.id}</td>
                                    <td>{saleTemp.production.name}</td>
                                    <td>{saleTemp.price.toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="table-action-btn table-edit-btn"
                                                onClick={() => handleDecQuantity(saleTemp.id)}>
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span className="font-bold">{saleTemp.quantity}</span>
                                            <button className="table-action-btn table-edit-btn"
                                                onClick={() => handleIncQuantity(saleTemp.id)}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td>{(saleTemp.price * saleTemp.quantity).toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="table-action-btn table-delete-btn" 
                                                onClick={() => handleDeleteSaleTemp(saleTemp.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="flex justify-start gap-2">
                    Total
                    <span className="font-bold">{saleTemps.length}</span>
                    products
                    <span className="font-bold">{quantity}</span>
                    items
                </div>

            </div>

            {showModal && (
                <Modal id="sales" title="Production" onClose={closeModal} size="xl">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Selected</th>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productions.map((production) => (
                                    <tr key={production.id}>
                                        <td>
                                            <button className="button" 
                                                onClick={() => handleSelectedProduction(production)}>
                                                <i className="fas fa-check"></i>
                                            </button>
                                        </td>
                                        <td>{production.id}</td>
                                        <td>{production.name}</td>
                                        <td>{production.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

            {showModalEndSale && (
                <Modal id="end-sale" title="Closing The Deal" onClose={closeModalEndSale} size="md">
                    <div className="flex flex-col gap-2">
                        <div className="mb-3">
                            <div className="text-2xl font-bold text-right mb-2">Total</div>
                            <input type="text" value={total.toLocaleString()} disabled 
                                className="input-endsale"/>
                        </div>
                        <div className="mb-3">
                            <div className="text-xl font-bold text-right mb-2 text-gray-400">Amount Received</div>
                            <input type="text" value={receiveAmount} className="input-endsale" 
                                onChange={(e) => handleChangeAmountReceived(e)}/>
                        </div>
                        <div className="mb-3">
                            <div className="text-xl font-bold text-right mb-2 text-gray-400">Discount</div>
                            <input type="text" value={discount} className="input-endsale" 
                                onChange={(e) => handleChangeDiscount(e)}/>
                        </div>
                        <div className="mb-3">
                            <div className="text-xl font-bold text-right mb-2 text-gray-400">Amount of Change</div>
                            <input type="text" value={returnAmount} className="input-endsale" 
                                onChange={(e) => setReturnAmount(Number(e.target.value))}/>
                        </div>

                        <div className="flex justify-end mt-5 gap-2">
                            <button className="button" onClick={handleExactBill}>
                                <i className="fas fa-check mr-2"></i>
                                No Change
                            </button>
                            <button className="button" onClick={handleEndSale}>
                                <i className="fas fa-check mr-2"></i>
                                Close Sales
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}