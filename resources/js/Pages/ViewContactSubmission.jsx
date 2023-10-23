import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

const validationSchema = Yup.object().shape({
    message: Yup.string().required('Message is required'),
});

export default function ViewContactSubmission({ auth, data }) {
    const [contactData, setContactData] = useState([]);
    const [isEditSuccess, setIsEditSuccess] = useState(false); // Add this line
    const [toastMessage, setToastMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (isEditSuccess) {
            getContactSubmission(data.contactID);
            setIsEditSuccess(false);
          
        }
    }, [isEditSuccess, data.id]);

    const getContactSubmission = async (contactID) => {
        try {
            const response = await axios.get(`/getContactSubmission/${contactID}`);
            setContactData(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const initialValues = {
        message: '',
    };

    const respondToCustomer = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post(`/replyToCustomer/${data.id}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                toast.success(response.data.success);
                setIsEditSuccess(true);
                Object.keys(values).forEach((key) => {
                 values[key] = ''; // Clear form out 
                }); 

            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Respond to <span className="text-indigo-600">{data.name}</span>
                </h2>
            }
        >

{error ? (
    <Box sx={{ width: '100%' }}>
        <Collapse in={open}>
            <Alert
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
            >
                {error} {/* Access the error message */}
            </Alert>
        </Collapse>
    </Box>
) : null}

            
            {data ? (
               <Container maxWidth="sm" style={{ backgroundColor: 'inherit', padding: 1, margin: 'auto', textAlign: 'center' }}>
                <h1 className="text-slate-900 font-bold text-2xl m-5">Message from <span className="text-indigo-500">{data.name}:</span></h1>
                <p className="break-all text-xl m-3">{data.message}</p>
                     {/* <Card sx={{ minWidth: 275, margin: 10, padding: 4 }}>
                        <h1 className="text-indigo-500 font-bold">Message from {data.name}</h1>
                    <CardContent>
                    {data.message}
                    </CardContent>
                    
                    </Card> */}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={respondToCustomer}
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
                                    name="message"
                                    type="text"
                                    label="Write your response..."
                                    variant="filled"
                                    fullWidth
                                    margin="normal"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    as={TextField}
                                    multiline
                                    minRows={2}
                                    maxRows={4}
                                    helperText={touched.message && errors.message}
                                    error={touched.message && Boolean(errors.message)}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{
                                        color: 'white',
                                        backgroundColor:
                                            isSubmitting || !isValid || !dirty ? 'grey' : '#4f46e5',
                                        padding: 10,
                                        marginTop: 10,
                                    }}
                                    disabled={isSubmitting || !isValid || !dirty}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} style={{ color: '#fff' }} />
                                    ) : (
                                        <>Send Message</>
                                    )}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <ToastContainer />
                </Container>
            ) : (
                <CircularProgress />
            )}
        </AuthenticatedLayout>
    );
}
