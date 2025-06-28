'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { Config } from "@/app/Config"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"

export default function EditProfile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem(Config.TokenKey);
            const response = await axios.get(`${Config.apiUrl}/api/users/admin-info`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setUsername(response.data.username);
                setEmail(response.data.email);
                setRole(response.data.role);
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to get user data'
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Password is not matched'
                });
                return;
            }

            const token = localStorage.getItem(Config.TokenKey);
            console.log('token - ' + token);
            const url = `${Config.apiUrl}/api/users/admin-edit-profile`;
            const payload = {
                username: username,
                email: email,
                password: password
            }
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            console.log('header - ' + headers);
            const response = await axios.post(url, payload, {headers});

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Edit profile successful!'
                });
                router.push('/erp/dashboard');
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to edit profile'
            });
        }
    }

    return (
        <div>
            <h1 className="login-title">Edit User Profile</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-input" value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-input"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-input"
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="form-group flex items-center">
                    <button type="submit" className="button">
                        <i className="fas fa-save mr-2"></i>
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}