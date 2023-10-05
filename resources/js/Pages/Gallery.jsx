import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


// Import third party dependencies
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const columns = [
    { id: 'id', label: 'Photo ID', minWidth: 50 },
    { id: 'photo_label', label: 'Label', minWidth: 170 },
    { id: 'photo', label: 'Photo', minWidth: 200 },
    { id: 'photo_description', label: 'Description', minWidth: 200 },
];

export default function Gallery({ auth }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false); // For Dialog 

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get('/getPhotosFromGallery');
                if (!response.data) {
                    throw new Error(`Failed to get photos: ${response.statusText}`);
                }
                setRows(response.data);
                setLoading(false);
            } catch (error) {
                console.error(`Error Fetching data: ${error}`);
                setError(error.message || 'An error occurred');
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [photos]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const deletePhoto = async (photoID) => {
        try {
            // Make a DELETE request using Axios
            const response = await axios.delete(`/deletePhoto/${photoID}`);

            if (response.status === 200) {
                // Photo deleted successfully
                setSuccess(toast.success(response.data.success));

                // Remove the deleted photo from the 'photos' state
                setPhotos((prevPhotos) =>
                    prevPhotos.filter((photo) => photo.id !== photoID)
                );
            } else {
                // Handle the error case
                const errorMessage = response.data.error || 'An error occurred while deleting that picture from the gallery.';
                setError(errorMessage);
            }
        } catch (error) {
            console.log('Error deleting picture:', error);
            setError('An error occurred while deleting that picture from the gallery.');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gallery</h2>}
        >
            <meta name="csrf-token" content="{{ csrf_token() }}" />
            <Head title="Gallery" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Button variant="contained" style={{margin: 10}} onClick={handleClickOpen}>
                 Upload Photo 
                </Button>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Table Section */}
                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <CircularProgress color="secondary" />
                            </div>
                        ) : error ? (
                            <div className="text-red-600 p-4">{error}</div>
                        ) : rows.length === 0 ? (
                            <div className="text-red-500 text-xl text-center p-3 m-3">No photos yet, upload one now</div>
                        ) : (
                            <Paper sx={{ width: '100%' }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => (
                                                    <TableCell key={column.id}>{column.label}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                return (
                                                    <TableRow key={row.id}>
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.photo_label}</TableCell>
                                                        <TableCell>{row.photo}</TableCell>
                                                        <TableCell>{row.photo_description}</TableCell>
                                                        <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={() => deletePhoto(row.id)}>Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        )}
                        {/* End Section */}
                        <ToastContainer />
                    </div>
                </div>
            </div>

            {/* Start Popup */}
            <div>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Photo To The Gallery</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Simply upload the picture to the gallery and provide a label and description
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="photo_label"
            label="Photo Label"
            type="text"
            fullWidth
            variant="filled"
          />

        <TextField
            autoFocus
            margin="dense"
            name="photo"
            label="Photo"
            type="file"
            fullWidth
            variant="filled"
          />

            <TextField
            autoFocus
            margin="dense"
            name="photo_description"
            label="Photo Description"
            type="text"
            fullWidth
            variant="filled"
          />

            
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Upload</Button>
        </DialogActions>
      </Dialog>
    </div>
            {/* End Popup  */}
        </AuthenticatedLayout>
    )
}
