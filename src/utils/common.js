const adjust = (n) => (n < 10 ? `0${n}` : n);

export const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${adjust(d.getMonth() + 1)}-${adjust(d.getDate())}`;
};

export const setStorage = ({ key, val }) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const getStorage = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const removeStorage = (key) => {
  localStorage.removeItem(key);
};