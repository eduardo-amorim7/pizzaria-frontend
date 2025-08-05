const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;


    // ✅ Trate imediatamente o endpoint customizado e evite múltiplas respostas
    if (req.method === 'GET' && pathname === '/context/v1/maptiles.json') {
        const maptilesData = {
            "default": {
                "label": "label.maps.layer.default",
                "title": "Mapa",
                "icon": "pli-satellite-2",
                "url": "https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=explore.day&apiKey=fmhUDLz4O3ImcTFMd2zzYOeM8R2Vq270nfILPyRPnwk"
            },
            "normal.night.mobile": {
                "label": "label.maps.layer.normal.night.mobile",
                "title": "Noturno",
                "icon": "pli-satellite-2",
                "url": "https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=explore.night&ppi=400&apiKey=fmhUDLz4O3ImcTFMd2zzYOeM8R2Vq270nfILPyRPnwk"
            },
            "satellite": {
                "label": "label.maps.layer.satellite",
                "title": "Satelite",
                "icon": "pli-satellite-2",
                "url": "https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=satellite.day&apiKey=fmhUDLz4O3ImcTFMd2zzYOeM8R2Vq270nfILPyRPnwk"
            },
            "terrain": {
                "label": "label.maps.layer.terrain",
                "title": "Terreno",
                "icon": "pli-map-2",
                "url": "https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=topo.day&apiKey=fmhUDLz4O3ImcTFMd2zzYOeM8R2Vq270nfILPyRPnwk"
            }
        };

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(maptilesData));
        return;
    }

    
    // Add CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }
    
    // Check if it's a template request (pattern: /static/forms/{filename})
    const templateMatch = pathname.match(/^\/static\/forms\/([^\/]+)$/);
    if (templateMatch) {
        const templateName = templateMatch[1];
        const templatePath = path.join(__dirname, 'pages', 'static', 'forms', `${templateName}.html`);
        
        // Check if template file exists
        fs.access(templatePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Template not found
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end('<h1>404 Template Not Found</h1>');
                return;
            }
            
            // Read and serve template
            fs.readFile(templatePath, 'utf8', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<h1>500 Internal Server Error</h1>');
                    return;
                }
                
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.statusCode = 200;
                res.end(data);
            });
        });
        return;
    }
    
    // Default to index.html for root
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Build file path for regular files
    const filePath = path.join(__dirname, pathname);
    
    // Get file extension
    const ext = path.parse(filePath).ext;
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/html');
                res.end('<h1>500 Internal Server Error</h1>');
                return;
            }
            
            // Set content type
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.setHeader('Content-Type', contentType);
            
            // Serve file
            res.statusCode = 200;
            res.end(data);
        });
    });

    
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Para parar o servidor, pressione Ctrl+C');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nParando servidor...');
    server.close(() => {
        console.log('Servidor parado.');
        process.exit(0);
    });
});

