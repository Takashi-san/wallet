import Axios from "axios";

const setConfig = (config = {}) => {
  const newConfig = {
    ...Axios.defaults,
    ...config
  };
  
  Object.entries(newConfig).map(([key, value]) => {
    Axios.defaults[key] = value;
  });
}

export default { setConfig, getConfig };