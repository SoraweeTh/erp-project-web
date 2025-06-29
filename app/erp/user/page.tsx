'use client'

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Config } from "@/app/Config"
import Modal from "../components/Modal"
import axios from "axios"
import { UserInterface } from "@/app/interface/UserInterface"

interface User {
    id: number,
    email: string,
    username: string
}

export default function User() {
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userId, setUserId] = useState<number>();
    const [editingUser, setEditingUser] = useState<UserInterface | null>(null);
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/users`);
            if (response.status == 200) {
                setUsers(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingUser 
            ? `${Config.apiUrl}/api/users/admin-update/${editingUser.id}` 
            : `${Config.apiUrl}/api/users/admin-create`;
            const payload = {
                id: editingUser?.id || null,
                email: email,
                username: username,
                password: password || '',
                role: role
            }
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(Config.TokenKey)
            }

            const response = await axios.post(url, payload, {headers});
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `User ${editingUser ? 'updated' : 'created'} successfully`,
                    timer: 1000
                })
                setShowModal(false);
                setEditingUser(null);
                setEmail('');
                setUsername('');
                setPassword('');
                fetchUsers();
            }
        } catch (err: unknown) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (err as Error).message 
            })
        }
    }

    const handleDelete = async (user: UserInterface) => {
        try {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'CONFIRM DELETE !',
                text: `Are you sure you want to delete ${user.username} ?`,
                showCancelButton: true,
                showConfirmButton: true
            })

            if (result.isConfirmed) {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem(Config.TokenKey)
                }
                const response = await axios.delete(`${Config.apiUrl}/api/users/admin-delete/${user.id}`, {headers});
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User deleted successfully',
                        timer: 1000
                    })
                    fetchUsers();
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

    const handleEdit = (user: UserInterface) => {
        console.log('user id: ' + user.id);
        setEditingUser(user);
        setEmail(user.email);
        setUsername(user.username);
        setPassword('');
        setShowModal(true);
    }
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-5">User Management</h1>
            <div className="flex justify-between items-center mb-6">
                <button className="button-add" 
                    onClick={() => {
                        setEditingUser(null)
                        setEmail('')
                        setUsername('')
                        setPassword('')
                        setShowModal(true)
                    }}>
                    <i className="fas fa-plus mr-2"></i>
                    Add
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th className="w-[120px]">Username</th>
                            <th>Role</th>
                            <th className="text-right" style={{width: '100px'}}>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                <td className="text-right">
                                    <button className="table-action-btn table-edit-btn mr-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="table-action-btn table-delete-btn mr-2"
                                        onClick={() => handleDelete(user)}
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
                <Modal id="user-modal" title="user info" onClose={() => setShowModal(false)} size="md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2">Email</label>
                            <input type="email" className="form-input" value={email}
                                onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Username</label>
                            <input type="text" className="form-input" value={username}
                                onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Password</label>
                            <input type="password" className="form-input"
                                onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Role</label>
                            <select className="form-input" value={role}
                                onChange={e => setRole(e.target.value)}>
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
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
    );
}