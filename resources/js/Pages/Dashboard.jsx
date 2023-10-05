import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'phone_number', label: 'Phone Number', minWidth: 150 },
    { id: 'message', label: 'Message', minWidth: 200 },
    { id: 'created_at', label: 'Created At', minWidth: 170 },
    { id: 'updated_at', label: 'Updated At', minWidth: 170 },
];

export default function Dashboard({ auth }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/getContactSubmissions');
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const data = await response.json();
                setRows(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'An error occurred while fetching data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Table Section */}
                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <CircularProgress color="secondary" />
                            </div>
                        ) : error ? (
                            <div className="text-red-600 p-4">{error}</div>
                        ) : (
                            <Paper sx={{ width: '100%' }}>
                                {/* Rest of your table code */}
                            </Paper>
                        )}
                        {/* End Section */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
