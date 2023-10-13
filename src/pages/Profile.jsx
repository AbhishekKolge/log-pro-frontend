import { useEffect, useState } from 'react';
import {
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import ProfileImage from '../components/ProfileImage/ProfileImage';

import { showError, showInfo, showSuccess } from '../snackbar/snackbarAction';

import {
  useShowMeQuery,
  useUploadProfileImageMutation,
  useUpdateProfileMutation,
  useRemoveProfileImageMutation,
  useDeleteAccountMutation,
} from '../features/user/userApiSlice';
import { useGetLoggerKeyQuery } from '../features/log/logApiSlice';
import {
  updateUserInfoHandler,
  logoutHandler,
} from '../features/auth/authAction';

const profileValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(20, 'Too long')
    .min(3, 'Too short')
    .required('Required'),
  dob: Yup.date().nullable(true).optional(),
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [generateKey, setGenerateKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const { data: loggerKeyData, isLoading: loggerKeyIsLoading } =
    useGetLoggerKeyQuery(
      {},
      {
        skip: !generateKey,
      }
    );

  const {
    data: userData,
    isSuccess: userIsSuccess,
    error: userError,
  } = useShowMeQuery(
    {},
    {
      refetchOnFocus: true,
    }
  );

  const [updateProfile, { isLoading: updateProfileIsLoading }] =
    useUpdateProfileMutation();

  const [uploadProfileImage, { isLoading: uploadProfileImageIsLoading }] =
    useUploadProfileImageMutation();

  const [removeProfileImage, { isLoading: removeProfileImageIsLoading }] =
    useRemoveProfileImageMutation();

  const [deleteAccount, { isLoading: deleteAccountIsLoading }] =
    useDeleteAccountMutation();

  const profileFormik = useFormik({
    initialValues: {
      name: userData?.user?.name || '',
      dob: userData?.user?.dob || null,
    },
    enableReinitialize: true,
    validationSchema: profileValidationSchema,
    onSubmit: (values) => {
      updateProfile(values)
        .unwrap()
        .then(() => {
          showSuccess({ message: 'Profile updated successfully' });
        })
        .catch((error) => {
          if (error.data?.msg) {
            showError({ message: error.data.msg });
          } else {
            showError({ message: 'Something went wrong!, please try again' });
          }
        });
    },
  });

  const dobHandler = (value) => {
    value
      ? profileFormik.setFieldValue('dob', dayjs(value).format())
      : profileFormik.setFieldValue('dob', null);
  };

  const generateKeyHandler = () => {
    setGenerateKey(true);
  };

  const keyVisibilityHandler = () => {
    setShowKey((prevState) => !prevState);
  };

  const copyHandler = () => {
    showInfo({ message: 'Key copied' });
  };

  const profileImageUploadHandler = (value) => {
    const file = value;
    const formData = new FormData();
    formData.append('image', file);
    uploadProfileImage(formData)
      .unwrap()
      .then(() => {
        showSuccess({ message: 'Profile image uploaded' });
      })
      .catch((error) => {
        if (error.data?.msg) {
          showError({ message: error.data.msg });
        } else {
          showError({ message: 'Something went wrong!, please try again' });
        }
      });
  };

  const removeProfileImageHandler = () => {
    removeProfileImage(userData.user.profileImageId)
      .unwrap()
      .then(() => {
        showInfo({ message: 'Profile image removed' });
      })
      .catch((error) => {
        if (error.data?.msg) {
          showError({ message: error.data.msg });
        } else {
          showError({ message: 'Something went wrong!, please try again' });
        }
      });
  };

  const deleteAccountHandler = () => {
    deleteAccount()
      .unwrap()
      .then(() => {
        dispatch(logoutHandler({ isSession: true }));
        showInfo({ message: 'Account deleted successfully' });
      })
      .catch((error) => {
        if (error.data?.msg) {
          showError({ message: error.data.msg });
        } else {
          showError({ message: 'Something went wrong!, please try again' });
        }
      });
  };

  useEffect(() => {
    if (userIsSuccess) {
      dispatch(updateUserInfoHandler(userData.user));
    }
  }, [userIsSuccess, userData, dispatch]);

  useEffect(() => {
    if (userError) {
      if (userError?.data?.msg) {
        showError({ message: userError.data.msg });
      } else {
        showError({ message: 'Something went wrong!, please try again' });
      }
    }
  }, [userError]);

  return (
    <Stack spacing={3}>
      <Typography variant='h4'>Profile</Typography>
      <form noValidate onSubmit={profileFormik.handleSubmit}>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <ProfileImage
                isLoading={
                  uploadProfileImageIsLoading || removeProfileImageIsLoading
                }
                onUpload={profileImageUploadHandler}
                onCancel={removeProfileImageHandler}
              />
              <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label='Name'
                    name='name'
                    value={profileFormik.values.name}
                    onBlur={profileFormik.handleBlur}
                    onChange={profileFormik.handleChange}
                    helperText={
                      !!profileFormik.touched.name &&
                      !!profileFormik.errors.name &&
                      profileFormik.errors.name
                    }
                    error={
                      !!profileFormik.touched.name &&
                      !!profileFormik.errors.name
                    }
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label='Email Address'
                    name='email'
                    value={userData?.user?.email || ''}
                    disabled
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      value={
                        profileFormik.values.dob
                          ? dayjs(profileFormik.values.dob)
                          : null
                      }
                      textField={(params) => (
                        <TextField {...params} size='small' />
                      )}
                      name='endDate'
                      onChange={dobHandler}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={12} md={4}>
                  <FormControl sx={{ width: '100%' }} variant='outlined'>
                    <InputLabel htmlFor='outlined-adornment-password'>
                      API Key
                    </InputLabel>
                    <OutlinedInput
                      id='outlined-adornment-password'
                      type={showKey ? 'text' : 'password'}
                      disabled
                      value={userData?.user?.key || loggerKeyData?.key || ''}
                      startAdornment={
                        !!(userData?.user?.key || loggerKeyData?.key) && (
                          <InputAdornment position='start'>
                            <CopyToClipboard
                              text={
                                userData?.user?.key || loggerKeyData?.key || ''
                              }
                            >
                              <IconButton
                                type='button'
                                onClick={copyHandler}
                                edge='start'
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            </CopyToClipboard>
                          </InputAdornment>
                        )
                      }
                      endAdornment={
                        <InputAdornment position='end'>
                          {userData?.user?.key || loggerKeyData?.key ? (
                            <IconButton
                              onClick={keyVisibilityHandler}
                              type='button'
                              edge='end'
                            >
                              {showKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          ) : (
                            <Button
                              onClick={generateKeyHandler}
                              type='button'
                              variant='text'
                              size='small'
                            >
                              {loggerKeyIsLoading ? (
                                <CircularProgress color='primary' size={20} />
                              ) : (
                                'Generate'
                              )}
                            </Button>
                          )}
                        </InputAdornment>
                      }
                      label='Password'
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={4}>
                  <Button
                    size='large'
                    variant='contained'
                    fullWidth
                    disabled={
                      updateProfileIsLoading ||
                      _.isEqual(
                        profileFormik.values,
                        profileFormik.initialValues
                      ) ||
                      deleteAccountIsLoading
                    }
                    type='submit'
                    sx={{
                      height: '100%',
                    }}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid xs={12} md={4}>
                  <Button
                    size='large'
                    variant='contained'
                    color='error'
                    fullWidth
                    disabled={deleteAccountIsLoading}
                    type='button'
                    onClick={deleteAccountHandler}
                    sx={{
                      height: '100%',
                    }}
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </form>
    </Stack>
  );
};

export default ProfilePage;
