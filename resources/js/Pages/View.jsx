import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Import 3rd party dependencies 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function View({ auth, data }) {

  const [photoData, setPhotoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditSuccess, setIsEditSuccess] = useState(false);

    const fetchData = async (photoID) => {
      try {
          const response = await axios.get(`/getPhotoByID/${photoID}`);
          setPhotoData(response.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          setIsLoading(false);
      }
  };
  
  
  useEffect(() => {
    if (isEditSuccess) {
        fetchData(data.id); // Fetch data based on the updated data ID
        setIsEditSuccess(false); // Reset the edit status
        window.location.reload(); // Refresh new content 
    }
}, [isEditSuccess, data.id]);


  

  

    const initialValues = {
        photo_label: '',
        photo_description: ''
    };

    const validationLogic = Yup.object().shape({
        photo_label: Yup.string().required("Photo Label is required"),
        photo_description: Yup.string().required("Photo Description is required"),
    });

    const handleToast = (type, message)=>{
        switch(type){
            case 'success':
                toast.success(message, {position: toast.POSITION.TOP_CENTER});
                break;
            case 'error':
                toast.error(message, {position: toast.POSITION.TOP_CENTER});
                break;
            default: 
            break; 
        }
    };

    const editContent = async (values, { setSubmitting }) => {
      try {
          const response = await axios.put(`/editPhoto/${data.id}`, values, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          if (response.data.success) {
              handleToast('success', response.data.success);
              setIsEditSuccess(true);
          } else {
              handleToast('error', response.data.error);
          }
      } catch (error) {
          handleToast('error', 'Something went wrong while trying to edit the content');
      } finally {
          setSubmitting(false);
      }
  };
  
  

  return (
    <AuthenticatedLayout
    user={auth.user}
    header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Edit <span className="text-indigo-600">{data.photo_label}</span>
        </h2>
    }
>
    {data ? (
        <Card sx={{ maxWidth: 400, maxHeight: '100%', margin: '20px auto', display: 'block' }}>
            <CardMedia
                sx={{ height: 300 }}
                image={`http://127.0.0.1:8000/storage/gallery/${data.photo}`}
                title={data.photo_label}
            />

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {data.photo_label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {data.photo_description}
                </Typography>
            </CardContent>

            <Formik
                initialValues={{
                    photo_label: data.photo_label,
                    photo_description: data.photo_description,
                }}
                validationSchema={validationLogic}
                onSubmit={editContent}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    isValid,
                    dirty,
                    isSubmitting,
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <Field
                            name="photo_label"
                            type="text"
                            label="Photo Label"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            as={TextField}
                            helperText={touched.photo_label && errors.photo_label}
                            error={touched.photo_label && Boolean(errors.photo_label)}
                        />

                        <Field
                            name="photo_description"
                            type="text"
                            label="Photo Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            as={TextField}
                            multiline 
                            minRows={2}
                            maxRows={4}
                            helperText={touched.photo_description && errors.photo_description}
                            error={touched.photo_description && Boolean(errors.photo_description)}
                        />

                        <CardActions>
                            <Button
                                type="submit"
                                variant="contained"
                                style={{
                                    color: 'white',
                                    backgroundColor: isSubmitting || !isValid || !dirty ? 'grey' : '#4f46e5',
                                    padding: 10,
                                    marginTop: 10,
                                }}
                                disabled={isSubmitting || !isValid || !dirty}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={24} style={{ color: '#fff' }} />
                                ) : (
                                    <>Edit</>
                                )}
                            </Button>
                        </CardActions>
                    </Form>
                )}
            </Formik>

            <ToastContainer />
        </Card>
    ) : (
        <CircularProgress />
    )}
</AuthenticatedLayout>
  );
}
