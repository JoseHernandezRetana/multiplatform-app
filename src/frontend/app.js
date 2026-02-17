// Detección de plataforma y entorno
document.addEventListener('DOMContentLoaded', function() {
    // Detectar plataforma actual
    const platformInfo = detectPlatform();
    document.getElementById('current-platform').textContent = 
        `Plataforma actual: ${platformInfo.name}`;
    
    // Configurar información específica por plataforma
    updatePlatformInfo(platformInfo);
    
    // Configurar fecha de despliegue
    document.getElementById('deployment-date').textContent = 
        new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    
    // Configurar enlace GitHub
    document.getElementById('github-link').href = 
        'https://www.github.com/JoseHernandezRetana/multiplatform-app';
    
    // Configurar eventos de botones
    setupEventListeners();
});

function detectPlatform() {
    const userAgent = navigator.userAgent;
    let platform = {
        name: 'Web',
        type: 'browser',
        isElectron: false,
        isMobile: /Mobi|Android|iPhone/i.test(userAgent)
    };
    
    // Detectar Electron
    if (typeof window !== 'undefined' && window.process && window.process.type) {
        platform.name = 'Electron (Escritorio)';
        platform.type = 'desktop';
        platform.isElectron = true;
    }
    // Detectar móvil
    else if (platform.isMobile) {
        platform.name = 'Móvil';
        platform.type = 'mobile';
    }
    
    return platform;
}

function updatePlatformInfo(platform) {
    // Información de web
    document.getElementById('web-url').textContent = window.location.href;
    document.getElementById('web-resolution').textContent = 
        `${window.innerWidth} x ${window.innerHeight}px`;
    
    // Información de escritorio (si es Electron)
    if (platform.isElectron) {
        document.getElementById('desktop-status').textContent = 'Activa';
        document.getElementById('desktop-status').className = 'status active';
        
        // En Electron, podemos acceder a información del sistema
        if (window.require) {
            try {
                const os = window.require('os');
                document.getElementById('desktop-os').textContent = 
                    `${os.platform()} ${os.release()}`;
                document.getElementById('desktop-version').textContent = 
                    `Electron v${process.versions.electron}`;
            } catch (e) {
                document.getElementById('desktop-os').textContent = 'Windows/Mac/Linux';
            }
        }
    }
    
    // Información de móvil
    if (platform.isMobile) {
        document.getElementById('mobile-device').textContent = 
            /iPhone/i.test(navigator.userAgent) ? 'iPhone' :
            /Android/i.test(navigator.userAgent) ? 'Android' : 'Dispositivo móvil';
        
        document.getElementById('mobile-size').textContent = 
            `${window.innerWidth} x ${window.innerHeight}px`;
    }
}

function setupEventListeners() {
    // Test de API
    document.getElementById('test-api').addEventListener('click', async function() {
        const resultElement = document.getElementById('api-result');
        resultElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Probando conexión...';
        
        try {
            const response = await fetch('/api/test');
            const data = await response.json();
            
            if (data.success) {
                resultElement.innerHTML = 
                    `<span style="color: #4CAF50;">
                        <i class="fas fa-check-circle"></i> Conexión exitosa
                    </span><br>
                    <small>Backend: ${data.message} | Tiempo: ${data.timestamp}</small>`;
            } else {
                throw new Error('Error en la respuesta');
            }
        } catch (error) {
            resultElement.innerHTML = 
                `<span style="color: #f44336;">
                    <i class="fas fa-times-circle"></i> Error de conexión
                </span><br>
                <small>${error.message}</small>`;
        }
    });
    
    // Test de almacenamiento local
    document.getElementById('test-storage').addEventListener('click', function() {
        const input = document.getElementById('storage-input');
        const resultElement = document.getElementById('storage-result');
        
        if (input.value.trim()) {
            localStorage.setItem('demoData', input.value);
            const savedValue = localStorage.getItem('demoData');
            
            resultElement.innerHTML = 
                `<span style="color: #4CAF50;">
                    <i class="fas fa-check-circle"></i> Datos guardados
                </span><br>
                <small>Valor: "${savedValue}" almacenado en localStorage</small>`;
        } else {
            resultElement.innerHTML = 
                `<span style="color: #ff9800;">
                    <i class="fas fa-exclamation-triangle"></i> Introduce un valor primero
                </span>`;
        }
    });
    
    // Test responsive
    document.getElementById('test-responsive').addEventListener('click', function() {
        const resultElement = document.getElementById('responsive-result');
        const width = window.innerWidth;
        
        let category;
        if (width < 480) category = 'Móvil pequeño';
        else if (width < 768) category = 'Tablet/Móvil grande';
        else if (width < 1024) category = 'Tablet grande/Pequeño escritorio';
        else category = 'Escritorio';
        
        resultElement.innerHTML = 
            `<span style="color: #2196F3;">
                <i class="fas fa-check-circle"></i> Responsive funcionando
            </span><br>
            <small>Ancho: ${width}px | Categoría: ${category}</small>`;
    });
}

// Actualizar tamaño de pantalla en tiempo real
window.addEventListener('resize', function() {
    document.getElementById('web-resolution').textContent = 
        `${window.innerWidth} x ${window.innerHeight}px`;
    
    if (detectPlatform().isMobile) {
        document.getElementById('mobile-size').textContent = 
            `${window.innerWidth} x ${window.innerHeight}px`;
    }
});