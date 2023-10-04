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
import {Link} from "@inertiajs/react";
import Tooltip from '@mui/material/Tooltip';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FormatPaintOutlinedIcon from '@mui/icons-material/FormatPaintOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
const drawerWidth = 240;

function DrawerAppBar(props) {
  const { window, auth } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }} >
      <Typography variant="h6" sx={{ my: 2 }}>
        Alex's Epoxy
      </Typography>
      <Divider />
      <List>
        
        <Link to="#" className="block p-5 py-2 pr-4 pl-3">
        Home 
        </Link>

        <Link to="#about-us" className="block p-5 py-2 pr-4 pl-3">
          About Us
        </Link>

        <Link to="#epoxy-gallery" className="block p-5 py-2 pr-4 pl-3">
          Epoxy Gallery 
        </Link>

        <Link to="#contact-us" className="block p-5 py-2 pr-4 pl-3">
          Contact Us 
        </Link>
        {auth && auth.user ? (
  <Link
    href={route('dashboard')}
    className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
  >
    Dashboard
  </Link>
) : (
  <>
    <Link
      href={route('login')}
      className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
    >
      Log in
    </Link>
  </>
)}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{backgroundColor: '#5c210a'}}>
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
             Alex's Epoxy
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
           
            <Tooltip title="Home">
            <Link to="#" className="p-5 py-2 pr-4 pl-3">
            <HomeOutlinedIcon sx={{ color: '#fff' }} />
            </Link>
            </Tooltip>

            <Tooltip title="About Us">
            <Link to="#about-us" className="p-5 py-2 pr-4 pl-3">
              <FormatPaintOutlinedIcon className="w-9 h-9" sx={{color: '#fff'}}/>
            </Link>
            </Tooltip>

            <Tooltip title="Epoxy Gallery">
              <Link to="#epoxy-gallery" className="p-5 py-2 pr-4 pl-3">
              <CollectionsOutlinedIcon className="w-9 h-9" sx={{color: '#fff'}}/>
              </Link>
            </Tooltip>
            
            <Tooltip title="Contact Us">
              <Link to="#contact-us" className="p-5 py-2 pr-4 pl-3">
                <MailOutlinedIcon className="w-9 h-9" sx={{color: '#fff'}}/>
              </Link>
            </Tooltip>

            {auth && auth.user ? (
            <Tooltip title="Go to your dashboard">
            <Link
              href={route('dashboard')}
              className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
            >
              <DashboardOutlinedIcon className="w-9 h-9" sx={{color: '#fff'}}/>
            </Link>
            </Tooltip>
          ) : (
            <>
            <Tooltip title="Login to your account">
              <Link
                href={route('login')}
                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
              >
                <LoginOutlinedIcon className="w-9 h-9" sx={{color: '#fff'}} />
              </Link>
              </Tooltip>
            </>
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
            keepMounted: true, // Better open performance on mobile.
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
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
