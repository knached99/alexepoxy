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

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const columns = [
  { id: 'id', label: 'Photo ID', minWidth: 50 },
  { id: 'photo_label', label: 'Label', minWidth: 170 },
  { id: 'photo', label: 'Photo', minWidth: 200 },
  { id: 'photo_description', label: 'Description', minWidth: 200 },
];


// const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

// function isValidFileType(fileName, fileType) {
//   return fileName && fileType && fileType.split('/')[0] && validFileExtensions[fileType.split('/')[0]].indexOf(fileName.split('.').pop()) > -1;
// }

// function getAllowedExt(type) {
//   return validFileExtensions[type].map((e) => `.${e}`).toString();
// }

const initialValues = {
  photo: '', // or undefined
  photo_label: '',
  photo_description: '',
};


const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

const validationSchema = Yup.object().shape({
  photo: Yup
      .mixed()
      .required("Required")
      .test("is-valid-type", "Not a valid image type",
        value => isValidFileType(value && value.name.toLowerCase(), "image"))
      .test("is-valid-size", "Max allowed size is 100KB",
        value => value && value.size <= MAX_FILE_SIZE),
        photo_label: Yup.string().required('Photo label is required'),
        photo_description: Yup.string().required('Photo description is required')
});

// const validationSchema = Yup.object().shape({
//   photo: Yup.mixed()
//     .required('Photo is required')
//     .test('fileType', 'Invalid file type, only images are allowed', (value) => {
//       if (!value) return false;
//       const acceptedTypes = [ 'jpg', 'jpeg', 'png'];
//       return acceptedTypes.includes(value.type);
//     })
//     .test('fileSize', 'File size is too large. Max size is 2MB', (value) => {
//       if (!value) return false;
//       const maxSize = 2 * 1024 * 1024; // 2MB
//       return value.size <= maxSize;
//     }),
//     photo_label: Yup.string().required('Photo label is required'),
//     photo_description: Yup.string().required('Photo description is required') 
// });






  

  

export default function Gallery({ auth }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastError, setToastError] = useState(null);
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
        setError(toast.error(error.message));
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
        setError(toast.error(errorMessage));
      }
    } catch (error) {
      console.log('Error deleting picture:', error);
      setError(toast.error('An error occurred while deleting that picture from the gallery.'));
    }
  };

  const uploadPhoto = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('photo', values.photo);
      formData.append('photo_label', values.photo_label);
      formData.append('photo_description', values.photo_description);

      const response = await axios.post('/uploadPhotoToGallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(toast.success(response.data.success, { position: toast.POSITION.TOP_CENTER_CENTER }));
      } else {
        setToastError(response.data.error || 'An error occurred while uploading that photo to the gallery.');
      }
    } catch (error) {
      setToastError(error.message || 'An error occurred while uploading that photo to the gallery');
    } finally {
      setSubmitting(false);
      handleClose(); // Close the dialog after submission
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
          <Button variant="contained" style={{ margin: 10 }} onClick={handleClickOpen}>
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
            <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={uploadPhoto}
            >
              {({
                errors,
                touched,
                handleSubmit,
                isValid,
                dirty,
                isSubmitting,
              })=>(
                <Form onSubmit={handleSubmit}>
                  <Field 
                  name="photo"
                  type="file"
                  label="Select Image"
                  variant="outlined"
                  fullWidth 
                  margin="normal"
                  as={TextField}
                  helperText={touched.photo && errors.photo} 
                  error={touched.photo && Boolean(errors.photo)} 
                  />

                  <Field 
                  name="photo_label"
                  type="text"
                  label="Enter label for Photo" 
                  variant="outlined"
                  fullWidth 
                  as={TextField}
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
                  multiline 
                  rows={2}
                  maxRows={4}
                  helperText={touched.photo_description && errors.photo_description} 
                  error={touched.photo_description && Boolean(errors.photo_description)}
                  />
                     <Button
                    type="submit"
                    variant="contained"
                    style={{
                      color: 'white',
                      backgroundColor: isSubmitting || !isValid || !dirty ? 'grey' : 'blue',
                      padding: 10,
                      marginTop: 10,
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
