export const API_KEY = "AIzaSyAntRYrwES43rXopDby8Y4QZh_1L0-jdcA";

export const value_converter = (value) => {
  if (value >= 1000000000) {
    return Math.floor(value / 1000000000).toFixed(1) + "B";
  } else if (value >= 1000000) {
    return Math.floor(value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return Math.floor(value / 1000).toFixed(1) + "K";
  } else {
    return value;
  }
};
