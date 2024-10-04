import React, { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import { styles } from "./index.styles";

const SecurePasswordManager: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [confirmKey, setConfirmKey] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [passwords, setPasswords] = useState<{ id: string; password: string; description: string; uniqueId: string }[]>([]);
  const [keyError, setKeyError] = useState<string>("");
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    if (encryptionKey) {
      const savedPasswords = localStorage.getItem(`passwords_${hashKey(encryptionKey)}`);
      if (savedPasswords) {
        setPasswords(JSON.parse(savedPasswords));
      } else {
        setPasswords([]);
      }
    }
  }, [isUnlocked, encryptionKey]);

  useEffect(() => {
    if (isUnlocked && encryptionKey) {
      localStorage.setItem(`passwords_${hashKey(encryptionKey)}`, JSON.stringify(passwords));
    }
  }, [passwords, encryptionKey, isUnlocked]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const hashKey = (key: string) => CryptoJS.SHA256(key).toString();

  const unlockPasswordManager = () => {
    if (encryptionKey && confirmKey) {
      if (validateKey(encryptionKey, confirmKey)) {
        setIsUnlocked(true);
        setKeyError("");
      } else {
        setKeyError("Encryption key must be at least 8 characters long, contain uppercase, lowercase, number, and special character.");
      }
    } else {
      setKeyError("Please enter and confirm the encryption key.");
    }
  };

  const validateKey = (key: string, confirmKey: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(key);
    const hasLowerCase = /[a-z]/.test(key);
    const hasNumbers = /\d/.test(key);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(key);
    return key.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars && key === confirmKey;
  };

  const savePassword = () => {
    if (id && password && description && encryptionKey) {
      const encryptedId = CryptoJS.AES.encrypt(id, encryptionKey).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();
      const encryptedDescription = CryptoJS.AES.encrypt(description, encryptionKey).toString();

      const newPasswords = [...passwords, { id: encryptedId, password: encryptedPassword, description: encryptedDescription,  uniqueId: uuidv4(), }];
      setPasswords(newPasswords);
      setId("");
      setPassword("");
      setDescription("");
    } else {
      alert("Please enter ID, password, and description.");
    }
  };

  const backupPasswords = () => {
    const jsonPasswords = JSON.stringify(passwords);
    const blob = new Blob([jsonPasswords], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "passwords_backup.json";
    link.click();
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const RestoreComponent = () => {
  
    const handleFileSelect = () => {
      // Programmatically click the hidden input element when the button is clicked
      fileInputRef.current?.click();
    };
  
    const restorePasswords = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const restoredPasswords = JSON.parse(e.target?.result as string);
          const updatedPasswords = [...passwords]; // Your current state
  
          restoredPasswords.forEach((restoredPassword: { id: string; password: string; description: string; uniqueId: string }) => {
            // Avoid duplicates by checking uniqueId
            if (!updatedPasswords.some(p => p.uniqueId === restoredPassword.uniqueId)) {
              updatedPasswords.push(restoredPassword);
            }
          });
  
          setPasswords(updatedPasswords);
        };
        reader.readAsText(file);
      }
    };

  // }

  const deletePassword = (index: number) => {
    const updatedPasswords = passwords.filter((_, i) => i !== index);
    setPasswords(updatedPasswords);
  };

  const togglePassword = (index: number, encryptedId: string, encryptedPassword: string, encryptedDescription: string) => {
    const idElement = document.getElementById(`id-${index}`);
    const passElement = document.getElementById(`pass-${index}`);
    const descriptionElement = document.getElementById(`desc-${index}`);

    if (idElement?.textContent === "********" && passElement?.textContent === "********" && descriptionElement?.textContent === "********") {
      try {
        const decryptedId = CryptoJS.AES.decrypt(encryptedId, encryptionKey).toString(CryptoJS.enc.Utf8);
        const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey).toString(CryptoJS.enc.Utf8);
        const decryptedDescription = CryptoJS.AES.decrypt(encryptedDescription, encryptionKey).toString(CryptoJS.enc.Utf8);

        if (!decryptedId || !decryptedPassword || !decryptedDescription) throw new Error("Invalid Key");

        idElement.textContent = decryptedId;
        passElement.textContent = decryptedPassword;
        descriptionElement.textContent = decryptedDescription;
      } catch (error) {
        alert("Incorrect encryption key. Unable to decrypt.");
      }
    } else {
      idElement!.textContent = "********";
      passElement!.textContent = "********";
      descriptionElement!.textContent = "********";
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div style={theme === "light" ? styles.lightMainBody : styles.darkMainBody} id="mainBody">
      <div style={theme === "light" ? styles.lightContainer : styles.darkContainer} id="container">
        <h2 style={styles.title}>Secure Password Manager</h2>

       
        <button onClick={toggleTheme} style={styles.themeToggleButton}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        {!isUnlocked && (
          <div style={styles.formContainer}>
            <div style={styles.inputGroup}>
              <label htmlFor="encryptionKey" style={{ marginBottom: 4 }}>Enter Encryption Key:</label>
              <input
                type="password"
                id="encryptionKey"
                placeholder="Enter master password"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                style={theme === "light" ? styles.inputLight : styles.inputDark}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="confirmKey" style={{ marginBottom: 4 }}>Confirm Encryption Key:</label>
              <input
                type="password"
                id="confirmKey"
                placeholder="Confirm master password"
                value={confirmKey}
                onChange={(e) => setConfirmKey(e.target.value)}
                style={theme === "light" ? styles.inputLight : styles.inputDark}
              />
            </div>
            <button onClick={unlockPasswordManager} style={styles.button}>Unlock</button>
            {keyError && <div style={styles.errorMessage}>{keyError}</div>}
          </div>
        )}

        {isUnlocked && (
          <div style={styles.passwordSection}>
            <div style={styles.inputGroup}>
              <label htmlFor="id">ID:</label>
              <input
                type="text"
                id="id"
                placeholder="Enter website or ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={theme === "light" ? styles.inputLight : styles.inputDark}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={theme === "light" ? styles.inputLight : styles.inputDark}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="description">Description:</label>
              <input
                type="input"
                id="description"
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={theme === "light" ? styles.inputLight : styles.inputDark}
              />
            </div>
            <button onClick={savePassword} style={styles.button}>Save Credentials</button>

            <div style={styles.passwordList}>
              <div style={styles.savedPasswordBars}> 
              <h3>Saved Passwords</h3>
              <input
              type="file"
              ref={fileInputRef}
              onChange={restorePasswords}
              style={{ display: 'none' }} // Hide the input
              />
              <button onClick={backupPasswords} style={styles.backupPasswordButton} >Backup</button>
              <button onClick={handleFileSelect} style={styles.backupPasswordButton} >Restore</button>
              </div>
             
              <ul style={styles.list}>
                {passwords.map((entry, index) => (
                  <li key={index} style={styles.listItem}>
                    ID: <span id={`id-${index}`}>********</span><br />
                    Password: <span id={`pass-${index}`}>********</span><br />
                    Description: <span id={`desc-${index}`}>********</span><br />
                    <button onClick={() => togglePassword(index, entry.id, entry.password, entry.description)} style={styles.toggleButton}>
                      Show/Hide Credentials
                    </button>
                    <button onClick={() => deletePassword(index)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};




export default SecurePasswordManager;
