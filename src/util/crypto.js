import CryptoJS from 'crypto-js/crypto-js'

const KEY = CryptoJS.enc.Utf8.parse('smkUdoLEdSsldaAa'); // 'retedfgd' 与后台一致
const IV = CryptoJS.enc.Utf8.parse('vx9sNtLGhR5McqUC'); // 'asdqwe' 与后台一致

// AES加密 ：字符串 key iv  返回base64
export function Encrypt(str, keyStr, ivStr) {
  let key = KEY;
  let iv = IV;

  if (keyStr && ivStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }
  let srcs = CryptoJS.enc.Utf8.parse(str);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    // mode: CryptoJS.mode.ECB, 
    mode: CryptoJS.mode.CBC, // mode 与后台一致
    padding: CryptoJS.pad.Pkcs7,
  });
 
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

// AES 解密 ：字符串 key iv  返回base64
export function Decrypt(str, keyStr, ivStr) {
  let key = KEY;
  let iv = IV;

  if (keyStr && ivStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }

  let base64 = CryptoJS.enc.Base64.parse(str);
  let src = CryptoJS.enc.Base64.stringify(base64);

  var decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,
    // mode: CryptoJS.mode.ECB, 
    mode: CryptoJS.mode.CBC, // 保持一致
    padding: CryptoJS.pad.Pkcs7
  });

  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}