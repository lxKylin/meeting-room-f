/*
 * @Fileoverview: 密码加解密
 * @Description: 使用于密码的加解密
 * 在CryptoJS中，如果密钥是16字节长度，它会使用AES-128。如果密钥长度为24字节，则为AES-192，32字节则为AES-256。
 * ECB模式是电子密码本模式，是AES加密的最简单模式，它没有使用任何分组加密模式的机制。
 * 在AES ECB模式下，密钥的长度必须是16字节、24字节或32字节（分别对应AES-128、AES-192和AES-256）。
 * 如果密钥长度不足16字节，AES加密库一般会抛出错误，无法加密或解密
 */
import CryptoJS from 'crypto-js'
// const KEY = 'QUANZHIKEJI@2024'
const KEY = 'KYLIN@1118'

class AESUtil {
  /**
   * 加密
   * @param plaintext
   */
  static encrypt(plaintext: string) {
    // 确保密钥是16字节，不足的以0补充
    const key = CryptoJS.enc.Utf8.parse(KEY.padEnd(16, '0'))
    const word = CryptoJS.enc.Utf8.parse(plaintext)
    const encrypted = CryptoJS.AES.encrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  }

  /**
   * 解密
   * @param encryptedText
   */
  static decrypt(encryptedText: string) {
    const key = CryptoJS.enc.Utf8.parse(KEY.padEnd(16, '0'))
    const decrypt = CryptoJS.AES.decrypt(encryptedText, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  }
}

export { AESUtil }
