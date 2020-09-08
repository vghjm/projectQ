import React from 'react';
export const theme = {
  default: '#d9d9d9',
  light: ['#e8efd9','#d7e4bd', '#b9c89c'],
  logo: null,
};

export const ThemeContext = React.createContext(theme);
