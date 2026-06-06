import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Vite plugin to handle local data saving during development
const localDataSaver = () => {
  return {
    name: 'local-data-saver',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/save-data') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const assetsDir = path.resolve(__dirname, 'src/assets');
              if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
              }

              // 1. Process Rooms
              const roomsImports = [];
              const roomsList = [];
              
              if (Array.isArray(data.rooms)) {
                data.rooms.forEach((room, idx) => {
                  let imageRef = room.image;
                  const varName = `roomImg_${idx + 1}`;
                  
                  if (room.image && room.image.startsWith('data:image/')) {
                    const match = room.image.match(/^data:image\/(\w+);base64,(.+)$/);
                    if (match) {
                      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
                      const imgData = match[2];
                      const filename = `room_design_${idx + 1}.${ext}`;
                      const filePath = path.join(assetsDir, filename);
                      fs.writeFileSync(filePath, Buffer.from(imgData, 'base64'));
                      
                      roomsImports.push(`import ${varName} from "../assets/${filename}";`);
                      imageRef = varName;
                    }
                  } else if (room.image && (room.image.includes('/assets/') || room.image.includes('room_design_'))) {
                    // Extract filename
                    const filename = path.basename(room.image.split('?')[0]);
                    roomsImports.push(`import ${varName} from "../assets/${filename}";`);
                    imageRef = varName;
                  }
                  
                  roomsList.push({
                    ...room,
                    image: imageRef
                  });
                });

                // Write defaultRooms.js
                const defaultRoomsCode = `// Default Rooms Data
${roomsImports.join('\n')}

export const defaultRooms = [
${roomsList.map(r => `  {
    id: ${JSON.stringify(r.id)},
    name: ${JSON.stringify(r.name)},
    image: ${r.image && r.image.startsWith('roomImg_') ? r.image : JSON.stringify(r.image)},
    styleTitle: ${JSON.stringify(r.styleTitle)},
    description: ${JSON.stringify(r.description)},
    details: ${JSON.stringify(r.details, null, 4).replace(/\n/g, '\n    ')}
  }`).join(',\n')}
];
`;
                fs.writeFileSync(path.resolve(__dirname, 'src/data/defaultRooms.js'), defaultRoomsCode, 'utf8');
              }

              // 2. Process Collages
              if (data.roomCollages) {
                const collagesImports = [];
                const collagesMap = {};
                let imgCounter = 1;

                Object.entries(data.roomCollages).forEach(([roomId, collage]) => {
                  const newCollage = { ...collage };
                  ['img1', 'img2', 'img3', 'img4', 'img5'].forEach((key) => {
                    const imgVal = collage[key];
                    const varName = `collageImg_${imgCounter}`;
                    
                    if (imgVal && imgVal.startsWith('data:image/')) {
                      const match = imgVal.match(/^data:image\/(\w+);base64,(.+)$/);
                      if (match) {
                        const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
                        const imgData = match[2];
                        const safeRoomId = roomId.replace(/[^a-zA-Z0-9_-]/g, '_');
                        const filename = `collage_design_${safeRoomId}_${key}.${ext}`;
                        const filePath = path.join(assetsDir, filename);
                        fs.writeFileSync(filePath, Buffer.from(imgData, 'base64'));
                        
                        collagesImports.push(`import ${varName} from "../assets/${filename}";`);
                        newCollage[key] = varName;
                        imgCounter++;
                      }
                    } else if (imgVal && (imgVal.includes('/assets/') || imgVal.includes('collage_design_'))) {
                      const filename = path.basename(imgVal.split('?')[0]);
                      collagesImports.push(`import ${varName} from "../assets/${filename}";`);
                      newCollage[key] = varName;
                      imgCounter++;
                    }
                  });
                  collagesMap[roomId] = newCollage;
                });

                let collagesObjStr = '{\n';
                Object.entries(collagesMap).forEach(([roomId, collage]) => {
                  collagesObjStr += `  ${JSON.stringify(roomId)}: {\n`;
                  Object.entries(collage).forEach(([k, v]) => {
                    let valStr = JSON.stringify(v);
                    if (typeof v === 'string' && v.startsWith('collageImg_')) {
                      valStr = v;
                    }
                    collagesObjStr += `    ${k}: ${valStr},\n`;
                  });
                  collagesObjStr += '  },\n';
                });
                collagesObjStr += '}';

                const defaultCollagesCode = `// Default Room Collages Data
${collagesImports.join('\n')}

export const defaultCollages = ${collagesObjStr};
`;
                fs.writeFileSync(path.resolve(__dirname, 'src/data/defaultCollages.js'), defaultCollagesCode, 'utf8');
              }

              // 3. Process defaultProducts
              if (Array.isArray(data.products)) {
                const defaultProductsCode = `// Default Products Data
export const defaultProducts = ${JSON.stringify(data.products, null, 2)};
`;
                fs.writeFileSync(path.resolve(__dirname, 'src/data/defaultProducts.js'), defaultProductsCode, 'utf8');
              }

              // 4. Process catalog
              if (Array.isArray(data.catalog)) {
                const defaultCatalogCode = `// Default Catalog Data
export const defaultCatalog = ${JSON.stringify(data.catalog, null, 2)};
`;
                fs.writeFileSync(path.resolve(__dirname, 'src/data/defaultCatalog.js'), defaultCatalogCode, 'utf8');
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
            } catch (err) {
              console.error(err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localDataSaver()],
})
