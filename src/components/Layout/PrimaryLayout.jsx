import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Toolbar,
  List,
  styled,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  MenuItem,
  Menu,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { logoutHandler } from '../../features/auth/authAction';

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(0)} + 1px)`,
  [theme.breakpoints.up('md')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '64px',
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#F6F9FC',
  padding: '2rem',
  [theme.breakpoints.down('md')]: {
    padding: '1rem',
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  height: '64px',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  '& .MuiToolbar-root': {
    height: '64px',
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': { ...openedMixin(theme), marginTop: '64px' },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': { ...closedMixin(theme), marginTop: '64px' },
  }),
}));

const PrimaryLayout = () => {
  const [open, setOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleDrawer = () => {
    setOpen((prevState) => !prevState);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (action) => {
    setAnchorElUser(null);
    action && action();
  };

  const logout = () => {
    dispatch(logoutHandler());
  };

  const profileNavigate = () => {
    navigate('/profile');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawer}
              edge='start'
              sx={{
                marginRight: { xs: 0, sm: 2, md: 5 },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant='h4'
              noWrap
              component='div'
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              LogPro
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={auth.name} src={auth.profileImage} />
            </IconButton>

            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu.bind(null, null)}
            >
              <MenuItem
                onClick={handleCloseUserMenu.bind(null, profileNavigate)}
              >
                <Typography textAlign='center'>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu.bind(null, logout)}>
                <Typography textAlign='center'>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              component={Link}
              to='/dashboard'
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary='Dashboard'
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              component={Link}
              to='/logs'
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary='Logs' sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              component={Link}
              to='/profile'
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary='Profile' sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main>
        <Outlet />
      </Main>
    </Box>
  );
};

export default PrimaryLayout;
