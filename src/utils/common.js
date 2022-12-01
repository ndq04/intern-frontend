const adjust = (n) => (n < 10 ? `0${n}` : n);
export const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${adjust(d.getMonth() + 1)}-${adjust(d.getDate())}`;
};

export const setStorage = ({ key, val }) => {
  localStorage.setItem(JSON.stringify(key), val);
};

export const getStorage = (key) => {
  const json = JSON.parse(localStorage.getItem(key));
  return json ? json : [];
};

export const removeStorage = (key) => {
  localStorage.removeItem(key);
};