'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { Config } from "../Config"
import Link from "next/link"

export default function Sidebar() {
    const [username, setUsername] = useState('');
    const [currentPath, setCurrentPath] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchData();
        setCurrentPath(localStorage.getItem('currentPath') || '');
        setDefaultSidebar();
    }, []);

    const setDefaultSidebar = () => {
        const sidebar = localStorage.getItem('sidebar');
        const sidebarElement = document.querySelector('.sidebar') as HTMLElement;
        if (sidebar == 'true') {
            sidebarElement.classList.add('hidden');
        } else {
            sidebarElement.classList.remove('hidden');
        }
    }

    const fetchData = async () => {
        try {
            const token = localStorage.getItem(Config.TokenKey);
            const response = await axios.get(`${Config.apiUrl}/api/users/admin-info`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.status === 200) {
                setUsername(response.data.username);
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to get user info : ' + err
            })
        }
    }

    const handleLogout = async () => {
        try {
            const button = await Swal.fire({
                icon: 'question',
                title: 'Confirm to logout',
                text: 'Are you sure want to logout ?',
                showCancelButton: true,
                showConfirmButton: true
            });

            if (button.isConfirmed) {
                localStorage.removeItem(Config.TokenKey);
                router.push('/');
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to logout : ' + err
            })
        }
    }

    const navigateAndSetCurrentPath = (path: string) => {
        router.push(path);
        setCurrentPath(path);
        localStorage.setItem('currentPath', path);
    }

    const isActive = (path: string) => {
        return currentPath == path ? 'sidebar-nav-link-active' : 'sidebar-nav-link';
    }

    const toggleSidebar = () => {
        const sidebar = document.querySelector('.sidebar') as HTMLElement;
        if (sidebar) {
            if (sidebar.classList.contains('hidden')) {
                sidebar.classList.remove('hidden');
                localStorage.setItem('sidebar', 'false');
            } else {
                sidebar.classList.add('hidden');
                localStorage.setItem('sidebar', 'true');
            }
        }
    }   

    return (
        <div className="flex items-start">
            <div className="sidebar">
                <div className="sidebar-container">
                    <div className="sidebar-title">
                        <h1>
                            <i className="fas fa-leaf mr-3"></i>
                            Spring ERP
                        </h1>
                        <div className="text-lg font-normal mt-3 mb-4">
                            <i className="fas fa-user mr-3"></i>
                            {username}
                        </div>
                        <div className="flex gap-2 m-3 justify-center">
                            <Link href="/erp/user/edit" className="btn-edit">
                                <i className="fas fa-edit mr-2"></i>
                                Edit
                            </Link>
                            <button className="btn-logout" onClick={handleLogout}>
                                <i className="fas fa-sign-out mr-2"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                    <nav>
                        <ul className="sidebar-nav-list">
                            <li className="sidebar-nav-item">
                                <a onClick={() => navigateAndSetCurrentPath('/erp/dashboard')}
                                    className={isActive('/erp/dashboard')}>
                                    <i className="fas fa-home mr-2"></i>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li className="sidebar-nav-item">
                                <a onClick={() => navigateAndSetCurrentPath('/erp/store')}
                                    className={isActive('/erp/store')}>
                                    <i className="fas fa-box-open mr-2"></i>
                                    <span>Store</span>
                                </a>
                            </li>
                            <li className="sidebar-nav-item">
                                <a onClick={() => navigateAndSetCurrentPath('/erp/production')}
                                    className={isActive('/erp/production')}>
                                    <i className="fas fa-cogs mr-2"></i>
                                    <span>Production</span>
                                </a>
                            </li>
                            <li className="sidebar-nav-item">
                                <a onClick={() => navigateAndSetCurrentPath('/erp/sale')}
                                    className={isActive('/erp/sale')}>
                                    <i className="fas fa-money-bill mr-2"></i>
                                    <span>Sales</span>
                                </a>
                            </li>
                            <li className="sidebar-nav-item">
                                <a onClick={() => navigateAndSetCurrentPath('/erp/report')}
                                    className={isActive('/erp/report')}>
                                    <i className="fas fa-chart-line mr-2"></i>
                                    <span>Report</span>
                                </a>
                            </li>
                            <li className="sidebar-nav-item">
                                <a onClick={() => navigateAndSetCurrentPath('/erp/user')}
                                    className={isActive('/erp/user')}>
                                    <i className="fas fa-user-alt mr-2"></i>
                                    <span>User</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <button className="text-white ms-3 cursor-pointer" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
            </button>
        </div>
    );
}