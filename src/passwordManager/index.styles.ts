// Base styles common to both light and dark themes
const baseStyles: { [key: string]: React.CSSProperties } = {
    container: {
      margin: "20px",
      fontFamily: "'Arial', sans-serif",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      position: "relative",
  
    },
    mainBody: {
      border: '0.1px solid black',
        width: '100%',
        minHeight: '100vh',
    },
    title: {
      textAlign: "center",
      marginBottom: '20px',
      marginTop: '35px'
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    savedPasswordBars: {
      display:'flex', 
      flexDirection:'row', 
      marginBottom: 5
    },
    inputGroup: {
      marginBottom: "15px",
      width: "100%",
    },
    input: {
      padding: "10px",
      width: "100%",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "16px",
      outline: "none",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
    },
    toggleButton: {
      marginTop: "10px",
      padding: "5px 10px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
    themeToggleButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      padding: "10px",
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      borderRadius: "4px",
      cursor: "pointer",
    },
    backupPasswordButton: {
      padding: "3px 5px",
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      borderRadius: "4px",
      cursor: "pointer",
      height:'auto',
      marginLeft: '4px'
    },
    errorMessage: {
      color: "red",
      fontSize: "14px",
      marginTop: "10px",
      textAlign: "center",
    },
    listItem: {
      padding: "10px",
      border: "1px solid #ccc",
      marginBottom: "5px",
      borderRadius: "4px",
      listStyleType: "none"
    },
    passwordList: {
      marginTop: "20px",
    },
  
    list: {
      listStyleType: "none",
      marginBottom:3,
    },
  };
  
  // Light and dark theme specific styles
  export const styles = {
    deleteButton: {
      marginTop: 10,
      marginLeft: 10,
      padding: "6px 14px",
      backgroundColor: "#ff6b6b",
      color: "white",
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
    },
    lightContainer: {
      ...baseStyles.container,
      backgroundColor: "#fff",
      color: "#000",
    },
    darkContainer: {
      ...baseStyles.container,
      backgroundColor: "#333",
      color: "#fff",
    },
    lightMainBody: {
      ...baseStyles.mainBody,
      backgroundColor: "#fff",
  
    },
    darkMainBody: {
      ...baseStyles.mainBody,
      backgroundColor: "#121212",
        
    },
    title: baseStyles.title,
    formContainer: baseStyles.formContainer,
    inputGroup: baseStyles.inputGroup,
    inputLight: {
      ...baseStyles.input,
      backgroundColor: '#fff',
    },
    inputDark: {
      ...baseStyles.input,
      backgroundColor: '#D3D3D3',
    },
    themeToggleButton: baseStyles.themeToggleButton,
    button: baseStyles.button,
    toggleButton: baseStyles.toggleButton,
    errorMessage: baseStyles.errorMessage, 
    passwordSection: baseStyles.passwordSection,
    passwordList: baseStyles.passwordList,
    list: baseStyles.list,
    listItem: baseStyles.listItem,
    backupPasswordButton: baseStyles.backupPasswordButton,
    savedPasswordBars: baseStyles.savedPasswordBars,
  };