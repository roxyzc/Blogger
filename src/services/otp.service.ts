export const generateOTP = (num?: Number) => {
  let len = num ?? 8;
  let str = "";
  let i = 0;

  for (i = 0; i < len; i++) {
    switch (Math.floor(Math.random() * 3 + 1)) {
      case 1: // digit
        str += Math.floor(Math.random() * 9).toString();
        break;

      case 2: // small letter
        str += String.fromCharCode(Math.floor(Math.random() * 26) + 97); //'a'.charCodeAt(0));
        break;

      case 3: // big letter
        str += String.fromCharCode(Math.floor(Math.random() * 26) + 65); //'A'.charCodeAt(0));
        break;

      default:
        break;
    }
  }
  return str;
};
