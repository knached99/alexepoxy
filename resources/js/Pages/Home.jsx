import { useState, useEffect } from 'react';
import {Link, Head} from "@inertiajs/react";

// Import Icons
import HardwareOutlinedIcon from '@mui/icons-material/HardwareOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

// Import Material UI Components 
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


// Import Components 
import DrawerAppBar from '../Components/DrawerAppBar';
import Footer from "../Components/Footer";

// Import 3rd party dependencies 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import CSS 
import '../../css/lightBox.css';



export default function Home({auth}){
  const [images, setImages] = useState([]); // Updated images state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
     
  const [lightboxImage, setLightboxImage] = useState("");
  const [photoLabel, setPhotoLabel] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");


  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone_number: Yup.string().matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, 'Invalid phone number format').required('Phone number is required'),
    message: Yup.string().required('Message is required'),
  });

  const formatPhoneNumber = (input) => {
    const cleanedInput = input.replace(/-/g, '');
    if (cleanedInput.length <= 3) return cleanedInput;
    if (cleanedInput.length <= 6) return `${cleanedInput.slice(0, 3)}-${cleanedInput.slice(3)}`;
    return `${cleanedInput.slice(0, 3)}-${cleanedInput.slice(3, 6)}-${cleanedInput.slice(6, 10)}`;
  };


  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('/getPhotosFromGallery');
        if (!response.data) {
          throw new Error(`Error getting photos from gallery`);
        }
        
        // Update the 'images' state with the fetched photo data
        const fetchedImages = response.data.map((photo) => ({
          src: `storage/gallery/${photo.photo}`, // Assuming your API returns photo URLs
          label: photo.photo_label,
          description: photo.photo_description
        }));
        setImages(fetchedImages);

        setLoading(false);
      } catch (error) {
        setError(toast.error(error.message));
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []); // Note: The dependency array is empty to fetch photos only once.

  const initialFormValues = {
    name: '',
    email: '',
    phone_number: '',
    message: '',
  };

  // const resetFormValues = () => {
  //   // Set form values to their initial state
  //   setValues(initialFormValues);
  // };
     
  const handleToast = (type, message) => {
    switch (type) {
      case 'success':
        toast.success(message, { position: toast.POSITION.TOP_CENTER });
        break;
      case 'error':
        toast.error(message, { position: toast.POSITION.TOP_CENTER });
        break;
      default:
        break;
    }
  };

   const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('/submitContactForm', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        handleToast('success', response.data.success);
         // Reset the form values
        
      } else {
        handleToast('error', response.data.error);
      }
    } catch (error) {
      handleToast('error', 'Something went wrong while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };



    const openLightbox = (src, label, description) => {
      setLightboxImage(src);
      setPhotoLabel(label); // Set photo label
      setPhotoDescription(description); // Set photo description
    };
  
    const closeLightbox = () => {
      setLightboxImage("");
      setPhotoLabel(""); // Clear photo label
      setPhotoDescription(""); // Clear photo description
    };
    
      return (
        <>
        <Head title="Home"/>
        <body>
    <header>
    <DrawerAppBar auth={auth}/>
    </header>

    <section className="relative bg-cover bg-center h-screen opacity-90" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1641893979088-87d4d9604c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80')"}}>
    <div className="absolute inset-0 flex items-center justify-center text-white text-center">
        <div className="max-w-2xl p-8 bg-opacity-80 backdrop-blur-md shadow-lg">
            <h1 className="text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl ">Epic Epoxy Creations</h1>
            <p className="mt-4 mb-6 font-light text-gray-100 lg:mb-8 md:text-lg lg:text-xl ">Seal the Deal with Epoxy Appeal!</p>
            {/* Add your call-to-action buttons here if needed */}
        </div>
    </div>
</section>

 

    <section id="about-us" className="bg-gray-50">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div className="max-w-screen-md mb-8 lg:mb-16">
                <h2 className="mb-4 text-4xl font-extrabold text-amber-900 ">About Our Company</h2>
                <p className="text-gray-500 sm:text-xl ">Welcome to Alex's Epoxy, where creativity meets craftsmanship! At Alex's Epoxy, we are passionate about transforming ordinary spaces into extraordinary works of art. With a blend of artistic flair and technical expertise, we specialize in crafting stunning epoxy resin creations that elevate the aesthetics of your home or business..</p>
            </div>
            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                <div>
                    <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-amber-900 lg:h-12 lg:w-12 ">
                        <HardwareOutlinedIcon className="w-5 h-5" style={{ color: 'white' }}/>
                        {/* <svg className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> */}
                    </div>
                    <h3 className="mb-2 text-xl font-bold ">Our Craftsmanship</h3>
                    <p className="text-gray-500 ">Our team of skilled artisans is dedicated to pushing the boundaries of epoxy resin artistry. From custom countertops and tabletops to mesmerizing epoxy floors, we take pride in every project we undertake. Our meticulous attention to detail ensures that each piece we create is a unique masterpiece, reflecting your individual style and vision.</p>
                </div>
                <div>
                    <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-amber-900 lg:h-12 lg:w-12 ">
                        <ScienceOutlinedIcon className="w-5 h-5" style={{ color: 'white' }}/>
                    </div>
                    <h3 className="mb-2 text-xl font-bold ">Innovation and Quality</h3>
                    <p className="text-gray-500 ">At the core of our philosophy is a commitment to innovation and quality. We stay abreast of the latest trends and techniques in epoxy resin applications to bring you cutting-edge designs. Using premium materials and state-of-the-art technology, we deliver not just products but enduring works of art that stand the test of time.</p>
                </div>
                <div>
                    <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-amber-900 lg:h-12 lg:w-12 ">
                    <HandshakeOutlinedIcon className="w-5 h-5" style={{ color: 'white' }}/>
                    </div>
                    <h3 className="mb-2 text-xl font-bold ">Client-Centric Approach</h3>
                    <p className="text-gray-500 ">We believe in building lasting relationships with our clients. Your satisfaction is our priority, and we work closely with you throughout the creative process. Whether you have a specific design in mind or need guidance in exploring possibilities, our team is here to turn your ideas into reality.</p>
                </div>
                <div>
                    <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-amber-900 lg:h-12 lg:w-12 ">
                    <RecyclingOutlinedIcon className="w-5 h-5" style={{ color: 'white' }}/>
                    </div>
                    <h3 className="mb-2 text-xl font-bold ">Sustainability</h3>
                    <p className="text-gray-500 ">Alex's Epoxy is also dedicated to sustainability. We prioritize eco-friendly practices and materials to minimize our environmental impact. Our commitment to sustainability extends to every aspect of our business, from sourcing materials to waste reduction.</p>
                </div>
                <div>
                    <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-amber-900 lg:h-12 lg:w-12 ">
                    <PaletteOutlinedIcon className="w-5 h-5" style={{ color: 'white' }}/>
                    </div>
                    <h3 className="mb-2 text-xl font-bold ">Discover the Artistry</h3>
                    <p className="text-gray-500 ">At Alex's Epoxy, we invite you to immerse yourself in the world of epoxy craftsmanship. Explore the boundless possibilities of resin art and witness the magic unfold in your living spaces. Our team is here to guide you through the artistic process, turning your visions into tangible, awe-inspiring creations.</p>
                </div>
                <div>
                    <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-amber-900 lg:h-12 lg:w-12 ">
                    <PeopleOutlinedIcon className="w-5 h-5" style={{ color: 'white' }}/>
                    </div>
                    <h3 className="mb-2 text-xl font-bold ">Community Engagement</h3>
                    <p className="text-gray-500 ">At Alex's Epoxy, we believe in giving back to the communities that inspire us. We actively engage with local initiatives, supporting art programs, and collaborating with community organizations. Our commitment to community extends beyond our workshop, fostering creativity and a sense of connection. By choosing Alex's Epoxy, you're not just investing in exceptional craftsmanship; you're supporting a business that values and contributes to the vibrancy of our local communities.</p>
                </div>
            </div>
        </div>
      </section>



    {/* GALLERY SECTION */}

    <section id="epoxy-gallery">
      <h1 className="text-4xl text-center m-4 font-black text-amber-900">Photo Gallery</h1>

      <div className="gallery">
      {images.length > 0 ? (
  images.map((image, index) => (
    <button
      type="button"
      className="gallery__item"
      key={index}
      onClick={() => openLightbox(image.src, image.label, image.description)}

    >
    <img className="gallery__image" src={image.src} alt={image.label} />
    </button>
  ))
) : (
  <h6 className="text-center text-xl text-slate-800">Nothing in the photo gallery</h6>
)}

</div>

{lightboxImage && (
  <div className="lightbox">
    <button
      type="button"
      className="lightbox__close-button"
      onClick={closeLightbox}
    >
      &times;
    </button>
    <div className="lightbox__container">
      <img
        className="lightbox__image"
        src={lightboxImage}
        alt={photoLabel}
      />
      <div className="lightbox__label-description text-white p-4 sm:p-8">
        <h3 className="lightbox__label text-white text-xl sm:text-2xl">{photoLabel}</h3>
        <p className="lightbox__description text-white text-sm sm:text-base">{photoDescription}</p>
      </div>
    </div>
    <button
      type="button"
      className="lightbox__bg"
      onClick={closeLightbox}
    />
  </div>
)}


    </section>
  
   

      <section className="bg-white" id="contact-us">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
                <h2 className="mb-4 text-4xl font-extrabold leading-tight text-amber-900">Ready to dive into the world of stunning epoxy creations?</h2>
                <p className="mb-6 font-light text-black  md:text-lg"> Whether you have a specific project in mind or just want to explore the possibilities, we're here to turn your ideas into resin reality. Reach out to us using the contact form below, and let's start crafting something extraordinary together. Your vision, our epoxy expertise—it's a perfect mix!</p>
          
  <Formik
  initialValues={initialFormValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
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
    <Form onSubmit={handleSubmit} autoComplete="off">
      
      <Field
        name="name"
        type="text"
        label="Name"
        variant="standard"
        fullWidth
        margin="normal"
        as={TextField}
        helperText={touched.name && errors.name}
        error={touched.name && Boolean(errors.name)}
        autoComplete="off"
      />

      <Field
        name="email"
        type="text"
        label="Email"
        variant="standard"
        fullWidth
        margin="normal"
        as={TextField}
        helperText={touched.email && errors.email}
        error={touched.email && Boolean(errors.email)}
        autoComplete="off"
      />

<Field
  name="phone_number"
  type="text"
  label="Phone Number"
  variant="standard"
  fullWidth
  margin="normal"
  as={TextField}
  helperText={touched.phone_number && errors.phone_number}
  error={touched.phone_number && Boolean(errors.phone_number)}
  onChange={(e) => {
    // Format phone number on input change
    const formattedValue = formatPhoneNumber(e.target.value);
    // Call handleChange with the formatted value
    handleChange({
      target: {
        name: 'phone_number',
        value: formattedValue,
      },
    });
  }}
  onBlur={handleBlur}
  autoComplete="off"
/>



      <Field
        name="message"
        type="text"
        label="Briefly describe the services you need"
        variant="standard"
        fullWidth
        margin="normal"
        multiline
        as={TextField}
        helperText={touched.message && errors.message}
        error={touched.message && Boolean(errors.message)}
        autoComplete="off"
      />

    <Button
        type="submit"
        variant="contained"
        style={{
          color: 'white',
          backgroundColor: isSubmitting || !isValid || !dirty ? 'grey' : '#5c210a',
          padding: 10,
          marginTop: 10,
      }}
        disabled={isSubmitting || !isValid || !dirty}
      >
        {isSubmitting ? (
          <CircularProgress size={24} style={{ color: '#fff' }} />
        ) : (
          <>
            Submit Request <SendOutlinedIcon className="ml-3" />
          </>
        )}
      </Button>
    </Form>
  )}
</Formik>

      <ToastContainer/>

            </div>
        </div>
    </section>

    <footer className="p-4 bg-amber-900 sm:p-6" style={{backgroundColor: '#5c210a'}}>
        <div className="mx-auto max-w-screen-xl">
            <div className="md:flex md:justify-between">
                <div className="mb-6 md:mb-0">
                    <Link to="#" className="flex items-center">
                    <span className="self-center text-2xl text-white font-black whitespace-nowrap ">Alex Epoxy</span>
                    </Link>
            
                </div>
            
            </div>
            <Footer/>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-sm text-gray-100 sm:text-center ">©  © {new Date().getFullYear()} <Link to="#" className="hover:underline">Alex Epoxy</Link>. All Rights Reserved.
                </span>
                <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
               
                </div>
            </div>
        </div>
    </footer>
  
    
    <script src="https://unpkg.com/flowbite@1.4.7/dist/flowbite.js"></script>
</body>
        </>
    );
}