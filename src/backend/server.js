const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta principal - servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API de prueba
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor backend funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API para información del sistema
app.get('/api/system-info', (req, res) => {
    res.json({
        platform: process.platform,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// Ruta para descargar versión desktop
app.get('/download-desktop', (req, res) => {
    res.json({
        windows: 'https://github.com/tu-usuario/interfaz-multiplataforma/releases/download/v1.0.0/app-win.exe',
        mac: 'https://github.com/tu-usuario/interfaz-multiplataforma/releases/download/v1.0.0/app-mac.dmg',
        linux: 'https://github.com/tu-usuario/interfaz-multiplataforma/releases/download/v1.0.0/app-linux.AppImage'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor backend funcionando en http://localhost:${PORT}`);
    console.log(`✅ Frontend disponible en http://localhost:${PORT}/`);
    console.log(`✅ API de prueba en http://localhost:${PORT}/api/test`);
});