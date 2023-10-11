import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Add this import

export default function Footer() {
  const [value, setValue] = useState('recents');
  const [error, setError] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState(null);
 
  const handleLinkClick = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
    setSelectedLink(link);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('/getSocialMediaLinks');
        console.log('Social Media Data:', response.data);
        setSocialMedia(response.data[0]); // Assuming there's only one object in the array
      } catch (error) {
        console.error('Error fetching social media links:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  
  


  return (
    <>
      {loading ? (
        <p className='text-white'>Loading...</p>
      ) : (
        <>
          <p className='text-white m-5 font-medium text-center text-xl'>Follow Us On Social Media</p>
          <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            backgroundColor: '#5c210a',
            position: 'relative',
            bottom: 0,
            width: '100%',
            zIndex: 1000,
            "& .Mui-selected": {
              borderBottomColor: 'white',
              borderBottomWidth: 4,
              color: 'white', 
            },
          }}
        >
            {socialMedia.facebook_url && (
              <BottomNavigationAction
                label="Facebook"
                icon={<FacebookIcon />}
                onClick={() => handleLinkClick(socialMedia.facebook_url)}
                sx={{ color: 'white' }}
              />
            )}
            {socialMedia.instagram_url && (
              <BottomNavigationAction
                label="Instagram"
                icon={<InstagramIcon />}
                onClick={() => handleLinkClick(socialMedia.instagram_url)}
                sx={{ color: 'white' }}
              />
            )}
            {socialMedia.twitter_url && (
              <BottomNavigationAction
                label="Twitter"
                icon={<TwitterIcon />}
                onClick={() => handleLinkClick(socialMedia.twitter_url)}
                sx={{ color: 'white' }}
              />
            )}
            {socialMedia.tiktok_url && (
              <BottomNavigationAction
                label="TikTok"
                icon={<AudiotrackIcon />}
                onClick={() => handleLinkClick(socialMedia.tiktok_url)}
                sx={{ color: 'white' }}
              />
            )}
          </BottomNavigation>
        </>
      )}
    </>
  );
  
  
  
};
