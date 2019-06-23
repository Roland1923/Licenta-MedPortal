using System;
using System.IO;
using System.Security.Cryptography;

namespace WebApp.Common
{
    public class MedicalHistoryHashAES
    {
        public static (string, byte[]) GetAESHash(string input)
        {
            try
            {
                // Create Aes that generates a new key and initialization vector (IV).    
                // Same key must be used in encryption and decryption    
                using (AesManaged aes = new AesManaged())
                {
                    // Encrypt string    
                    byte[] encrypted = Encrypt(input, aes.Key, aes.IV);
                    // Print encrypted string    
                    Console.WriteLine("Encrypted data: {System.Text.Encoding.UTF8.GetString(encrypted)}");
                    return (System.Text.Encoding.UTF8.GetString(encrypted), aes.Key) ;
                    // Decrypt the bytes to a string.    
                    //string decrypted = Decrypt(encrypted, aes.Key, aes.IV);
                    // Print decrypted string. It should be same as raw data    
                    //Console.WriteLine($ "Decrypted data: {decrypted}");
                }
            }
            catch (Exception exp)
            {
                return (exp.Message, null);
            }
        }

        static byte[] Encrypt(string plainText, byte[] Key, byte[] IV)
        {
            byte[] encrypted;
            // Create a new AesManaged.    
            using (AesManaged aes = new AesManaged())
            {
                // Create encryptor    
                ICryptoTransform encryptor = aes.CreateEncryptor(Key, IV);
                // Create MemoryStream    
                using (MemoryStream ms = new MemoryStream())
                {
                    // Create crypto stream using the CryptoStream class. This class is the key to encryption    
                    // and encrypts and decrypts data from any given stream. In this case, we will pass a memory stream    
                    // to encrypt    
                    using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    {
                        // Create StreamWriter and write data to a stream    
                        using (StreamWriter sw = new StreamWriter(cs))
                            sw.Write(plainText);
                        encrypted = ms.ToArray();
                    }
                }
            }
            // Return encrypted data    
            return encrypted;
        }
    }
}
