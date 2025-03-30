const oracledb = require("oracledb");
const fs = require("fs");

async function connectDB() {
  try {
    const walletPath = "C:/Users/tello/Desktop/Wallet_ServareApp";

    // Verificar si la carpeta de la Wallet existe
    if (!fs.existsSync(walletPath)) {
      console.error(`❌ El directorio de la Wallet no existe: ${walletPath}`);
      return;
    }

    // Verificar si los archivos esenciales están presentes
    if (!fs.existsSync(`${walletPath}/cwallet.sso`)) {
      console.error("❌ No se encuentra el archivo cwallet.sso");
      return;
    }
    if (!fs.existsSync(`${walletPath}/tnsnames.ora`)) {
      console.error("❌ No se encuentra el archivo tnsnames.ora");
      return;
    }
    if (!fs.existsSync(`${walletPath}/sqlnet.ora`)) {
      console.error("❌ No se encuentra el archivo sqlnet.ora");
      return;
    }

    // Inicializar Oracle Client con la ruta correcta
    oracledb.initOracleClient({ configDir: walletPath });

    console.log("✅ Oracle Client inicializado correctamente");

    // Configuración de conexión usando la Wallet
    const connection = await oracledb.getConnection({
      user: "ADMIN",  // Verifica que el nombre de usuario sea correcto
      password: "Servare.2025",  // Verifica que la contraseña sea correcta
      connectString: "servareapp_high",  // Usa el alias correcto de tu tnsnames.ora
    });

    console.log("✅ Conexión exitosa a la base de datos");

    // Ejecutar una consulta de prueba
    const result = await connection.execute("SELECT * FROM MATERIALIDADES");

    console.log("📊 Resultado de la consulta:", result.rows);

    // Cerrar conexión
    await connection.close();
  } catch (err) {
    console.error("❌ Error de conexión:", err);
  }
}

// Ejecutar la función para probar la conexión
connectDB();
