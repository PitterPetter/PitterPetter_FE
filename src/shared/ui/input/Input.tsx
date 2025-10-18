import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'sx'> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  className = '', 
  variant = 'outlined',
  fullWidth = true,
  ...props 
}) => {
  return (
    <TextField
      variant={variant}
      fullWidth={fullWidth}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#93000A',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#93000A',
            borderWidth: 2,
          },
        },
      }}
      className={className}
      {...props}
    />
  );
};