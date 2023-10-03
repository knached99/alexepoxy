import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';

export default function Footer() {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation sx={{ width: 500, backgroundColor: '#5c210a', margin: 5 }} value={value} onChange={handleChange}>
      
      <BottomNavigationAction
        label="Home"
        value="#"
        icon={<HomeOutlinedIcon />}
        style={{color: '#fff'}}
      />
      <BottomNavigationAction
        label="About Us"
        value="#about-us"
        icon={<FormatPaintOutlinedIcon />}
        style={{color: '#fff'}}
      />
      <BottomNavigationAction
        label="Epoxy Gallery"
        value="#epoxy-gallery"
        icon={<CollectionsOutlinedIcon />}
        style={{color: '#fff'}}
      />

     <BottomNavigationAction
        label="Contact Us"
        value="#contact-us"
        icon={<MailOutlinedIcon />}
        style={{color: '#fff'}}
      />

    </BottomNavigation>
  );
}