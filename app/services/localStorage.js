const AsyncStorage = require('react-native').AsyncStorage;
const CryptoJS = require("crypto-js");

module.exports = {

  multiGet: (arrayOfKeys, callback) => {
    AsyncStorage.multiGet(arrayOfKeys, (err, tokens) => {
      if (err) {
        throw new Error(`Error occurred grabbbing ${arrayOfKeys} from local storage`, err);
      }
      if (callback) {
        callback(err, tokens);
      }
    });
  },

  // data is an array of arrays (of strings)
  // e.g ['searchOnlineStores', 'true']
  multiSet: (data, callback) => {
    AsyncStorage.multiSet(data, (setError) => {
      if (setError) {
        throw new Error(`Error occurred setting ${data} in local storage`, err);
      } else {
        if (callback) {
          callback();
        }
      }
    });
  },

  // {key: , data: , algorithm: , password}
  encryptAndSet: (args, callback) => {

    let password = args.password;
    let data = JSON.stringify(args.data);

    var ciphertext = CryptoJS.AES.encrypt(data, password);

    console.log('encrypted text', ciphertext.toString())

    AsyncStorage.setItem(args.key, ciphertext.toString(), (setError) => {
      if (setError) {
        throw new Error(`Error occurred encrypting and setting data in local storage`, err);
      } else {
        if (callback) {
          callback();
        }
      }
    });
  },

  getAndDecrypt: (args, callback) => {
    AsyncStorage.getItem(args.key, (err, result) => {
      if (err) {
        throw new Error(`Error occurred getting encrypted data in local storage`, err);
      } else {
        // let algorithm = args.algorithm || 'aes-256-ctr';
        let password = args.password;
        //
        // let decipher = crypto.createDecipher(algorithm, password);
        // let dec = decipher.update(result, 'hex', 'utf8');
        // dec += JSON.parse(decipher.final('utf8'));
        let bytes;
        let decryptedData;
        let error = null;
        try {
          bytes = CryptoJS.AES.decrypt(result, password);
          decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (err) {
          error = err;
        }
        if (callback) {
          callback(err, decryptedData);
        }
      }
    });
  }

}
