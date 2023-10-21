import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

const drawerWidth = 240;

const DrawerAppBar = ({ window, auth }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleDrawerToggle();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
       Fairfield County Epoxy
      </Typography>
      <Divider />
      <List>
      <a href="/" onClick={scrollToTop} className="block m-5 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">
            Home
            </a>
            <a href="#about-us" onClick={scrollToTop} className="block m-5 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">
            About Us
            </a>
            <a href="#epoxy-gallery" onClick={scrollToTop} className="block m-5 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">
            Photo Gallery
           </a>
            <a href="#contact-us" onClick={scrollToTop} className="block m-5 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">
            Contact Us
            </a>

        {auth && auth.user ? (
          <a
            href={route('dashboard')}
            onClick={scrollToTop}
            className="block m-5 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
          >
            Dashboard
          </a>
        ) : (
          <a
            href={route('login')}
            onClick={scrollToTop}
            className="block m-5 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
          >
            Log in
          </a>
        )}



      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: '#000000' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon color="black" />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
          Fairfield County Epoxy
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <a href="/" onClick={scrollToTop} className="p-5 py-2 pr-4 pl-3">
              <HomeOutlinedIcon sx={{ color: '#fff' }} />
            </a>
            <a href="#about-us" onClick={scrollToTop} className="p-5 py-2 pr-4 pl-3">
              <FormatPaintOutlinedIcon className="w-9 h-9" sx={{ color: '#fff' }} />
            </a>
            <a href="#epoxy-gallery" onClick={scrollToTop} className="p-5 py-2 pr-4 pl-3">
              <CollectionsOutlinedIcon className="w-9 h-9" sx={{ color: '#fff' }} />
            </a>
            <a href="#contact-us" onClick={scrollToTop} className="p-5 py-2 pr-4 pl-3">
              <MailOutlinedIcon className="w-9 h-9" sx={{ color: '#fff' }} />
            </a>
            {auth && auth.user ? (
              <a
                href={route('dashboard')}
                onClick={scrollToTop}
                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
              >
                <DashboardOutlinedIcon className="w-9 h-9" sx={{ color: '#fff' }} />
              </a>
            ) : (
              <a
                href={route('login')}
                onClick={scrollToTop}
                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
              >
                <LoginOutlinedIcon className="w-9 h-9" sx={{ color: '#fff' }} />
              </a>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
