import CryptoJS from 'crypto-js/crypto-js';
//npm install crypto-js  --save--dev
//默认自定义的约定密钥(与后端密钥保持一致) 
const KEY = CryptoJS.enc.Utf8.parse("f2bpm$b;v20^uW1:");//长度16位
const IV = CryptoJS.enc.Utf8.parse("f2bpm$b;v20^uW1:");//长度16位

/**
 * AES对称加密（CBC模式，需要偏移量）
 * @param {} str 内容
 * @param {*} keyStr 可为空
 * @param {*} ivStr  可为空
 */
export function encrypt(str, keyStr, ivStr) {
  let key = KEY;
  let iv = IV;
  if (keyStr && ivStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }
  let srcs = CryptoJS.enc.Utf8.parse(str);
  //加密
  var encrypt = CryptoJS.AES.encrypt(srcs,key,{
    iv:iv,
    mode:CryptoJS.mode.CBC,//加密模式
    padding:CryptoJS.pad.Pkcs7//填充方式
  });
  return  CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
}
/**
 * AES对称解密
 * @param {*} str 
 * @param {*} keyStr 
 * @param {*} ivStr 
 * @returns 
 */
export function decrypt(str, keyStr, ivStr) {
  let key = KEY;
  let iv = IV;
  if (keyStr && ivStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }
  let base64 =CryptoJS.enc.Base64.parse(str);
  let src =CryptoJS.enc.Base64.stringify(base64);

  //解密
  var decrypt = CryptoJS.AES.decrypt(src,key,{
    iv:iv,
    mode:CryptoJS.mode.CBC,//加密模式
    padding:CryptoJS.pad.Pkcs7//填充方式
  });
  return  CryptoJS.enc.Utf8.stringify(decrypt).toString();
}