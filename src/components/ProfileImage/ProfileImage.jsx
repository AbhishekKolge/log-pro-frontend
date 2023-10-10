import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { Avatar, CircularProgress, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

import { DROPZONE_IMAGE_FORMAT, MAX_FILE_SIZE } from '../../utils/defaults';
import { validateDropzoneSingleFile } from '../../utils/helper';

const ProfileImage = (props) => {
  const { isLoading, onUpload, onCancel } = props;
  const auth = useSelector((state) => state.auth);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      ...DROPZONE_IMAGE_FORMAT,
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      validateDropzoneSingleFile(rejectedFiles, MAX_FILE_SIZE);
      if (acceptedFiles[0]) {
        onUpload(acceptedFiles[0]);
      }
    },
    disabled: isLoading,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignSelf: 'flex-start',
        position: 'relative',
      }}
    >
      {!isLoading && auth.profileImage && (
        <IconButton
          onClick={onCancel}
          sx={{ position: 'absolute', top: -10, right: 0, zIndex: 100 }}
          size='small'
        >
          <CancelIcon color='secondary' size={59} />
        </IconButton>
      )}
      <div
        {...getRootProps({})}
        style={{
          cursor: 'pointer',
        }}
      >
        {isLoading ? (
          <Avatar sx={{ width: 100, height: 100, fontSize: '30px' }}>
            <CircularProgress color='primary' size={30} />
          </Avatar>
        ) : (
          <Avatar
            alt={auth.name}
            src={auth.profileImage}
            sx={{ width: 100, height: 100, fontSize: '30px' }}
          />
        )}

        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default ProfileImage;
