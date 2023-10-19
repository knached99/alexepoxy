import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
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

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { object, string, mixed } from 'yup';

const columns = [
  { id: 'id', label: 'Photo ID', minWidth: 50 },
  { id: 'photo_label', label: 'Label', minWidth: 170 },
  { id: 'photo', label: 'Photo', minWidth: 200 },
  { id: 'photo_description', label: 'Description', minWidth: 200 },
  {id: 'created_at', label: 'Uploaded At', minWidth: 170},
  {id: 'edit', label: 'Edit', minWidth: 60},
  {id: 'delete', label: 'Delete', minWidth: 60}
];



const validationSchema = object().shape({
  photo: mixed()
    .required('Photo is required')
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true; // Allow empty file
      return value.size <= 2 * 1024 * 1024; // 2MB
    })
    .test('fileType', 'Invalid file format', (value) => {
      if (!value) return true; // Allow empty file
      return ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(value.type);
    }),
  photo_label: string().required('Photo Label is required'),
  photo_description: string().required('Photo Description is required'),
});

const initialValues = {
  photo: undefined,
  photo_label: '',
  photo_description: '',
};



export default function Gallery({ auth }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false); // For Dialog 
  const [previewImage, setPreviewImage] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewImage(null);
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
        setError(toast.error(error.message));
        setLoading(false);
      }
    };
  
    fetchPhotos();
  }, [photos]); // Refresh 
  

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
        setError(toast.error(errorMessage));
      }
    } catch (error) {
    
      setError(toast.error('An error occurred while deleting that picture from the gallery.'));
    }
  };

  const handlePhotoChange = (e, form) => {
    const file = e.target.files[0];
    form.setFieldValue('photo', file); // Update the 'photo' field in form values
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };
  
  

  const uploadPhoto = async (values) => {
    try {
      if (!values.photo) {
        setModalError('Photo is required');
        return;
      }
  
      const formData = new FormData();
      formData.append('photo', values.photo);
      formData.append('photo_label', values.photo_label);
      formData.append('photo_description', values.photo_description);
  
      const response = await axios.post('/uploadPhotoToGallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        // Success: Clear the form or show a success message.
        setOpen(false);
        setSuccess(toast.success(response.data.success));
        setPreviewImage(null); // Clear the image preview
        
        // Update the 'photos' state to trigger a re-render
        setPhotos([...photos, response.data.photo]); // Assuming response.data.photo contains the new photo data
      } else {
        // Handle other server errors as needed.
        setModalError(`Server Error: ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Validation errors: Display the errors on the form.
        const validationErrors = error.response.data.error;
        setModalError(validationErrors); // Set Formik errors
      } else {
        setModalError('An error occurred while uploading the photo.');
      }
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
          <Button variant="contained" style={{ margin: 10, backgroundColor: '#3f51b5', textTransform: 'lowercase' }} onClick={handleClickOpen}>
            Upload Photo
          </Button>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            {/* Table Section */}
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <CircularProgress color="secondary" />
              </div>
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
                            <TableCell>
                          <img
                            src={`storage/gallery/${row.photo}`}
                            alt="Photo"
                            style={{ width: '100px', height: '100px' }}
                          />
                        </TableCell>


                            <TableCell>{row.photo_description}</TableCell>
                            <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                            <TableCell>
                            <a href={`/photo/${row.id}/view`}>View</a>

                            </TableCell>

                            <TableCell>
                              <Button variant="contained" style={{backgroundColor: '#f50057', textTransform: 'lowercase'}} onClick={() => deletePhoto(row.id)}>Delete</Button>
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
          <DialogContentText >
          Simply upload the picture to the gallery and provide a label and description.
         Your photos will appear under the <span className="font-medium" style={{color: '#5c210a'}}>photo gallery</span> section on the home page. 
        </DialogContentText>
        <div>
        {modalError && typeof modalError === 'object' && (
          <ul>
            {Object.values(modalError).map((error, index) => (
              <li key={index} className="text-red-400 font-semibold">
                {error}
              </li>
            ))}
          </ul>
)}
        </div>



            {previewImage && (
                  <div>
                    <label>Image Preview:</label>
                    <img style={{width: '50%', height: '50%', margin: 10}} src={previewImage} alt="Preview" />
                  </div>
            )}

            <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={uploadPhoto}
            >
              {({
                errors,
                touched,
                handleSubmit,
                handleBlur,
                handleChange,
                setFieldValue,
                isValid,
                dirty,
                isSubmitting,
              })=>(
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                
                <Field
                type="file"
                id="photo"
                name="photo"
                accept=".png, .jpg, .jpeg, .webp"
                component={TextField}
                style={{margin: 10}}
                fullWidth
                onChange={(e) => handlePhotoChange(e, { setFieldValue })}
              />

                  <Field 
                  name="photo_label"
                  type="text"
                  label="Enter label for Photo" 
                  variant="outlined"
                  fullWidth 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  as={TextField}
                  style={{margin: 10}}
                  helperText={touched.photo_label && errors.photo_label} 
                  error={touched.photo_label && Boolean(errors.photo_label)}
                  />

                  <Field 
                  name="photo_description"
                  type="text"
                  label="Enter description for Photo" 
                  variant="outlined"
                  fullWidth 
                  as={TextField}
                  style={{margin: 10}}
                  multiline 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  minRows={2}
                  maxRows={4}
                  helperText={touched.photo_description && errors.photo_description} 
                  error={touched.photo_description && Boolean(errors.photo_description)}
                  />
                     <Button
                    type="submit"
                    variant="contained"
                    style={{
                      color: 'white',
                      textTransform: 'lowercase',
                      backgroundColor: isSubmitting || !isValid || !dirty ? 'grey' : '#3f51b5' ,
                      padding: 10,
                      margin: 10,
                      width: '100%'
                    }}
                    disabled={isSubmitting || !isValid || !dirty}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} style={{ color: '#fff' }} />
                    ) : (
                      <>
                        Upload
                      </>
                    )}
                  </Button>
                  
                </Form>
              )}
            </Formik>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{ color: 'grey' }}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* End Popup  */}
    </AuthenticatedLayout>
  )
}
