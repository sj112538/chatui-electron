import Http from "../http"
import JSEncrypt from 'jsencrypt';
const publicKey =
  "-----BEGIN PUBLIC KEY-----\n" +
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOk8dtBj0mUoNZJJiUfL8wdKk5T66b9hIN5WDTDCwQ6OrJ+viSIcgEg3CjxVFYsYNeDYjwRQpmjrIQroy8nsLOMCAwEAAQ==' +
  "\n-----END PUBLIC KEY-----"
const apiKey = "8df841d0f68b4291a2996bdd1f675408"
export const chatglmApi = new class chatgptApi extends Http {
  async getToken() {
    const publicKeyInstance = new JSEncrypt();
    publicKeyInstance.setPublicKey(publicKey);
    const encrypted = publicKeyInstance.encrypt(Date.now().toString());
    const token: string = await this.post('post', {
      body: {
        apiKey: apiKey,
        encrypted: encrypted
      }, allUrl: GLOB.VITE_CHATGLM + '/passApiToken/createApiToken'
    })
  }
}