const { getDb } = require('./db');
const db = getDb();
db.prepare("UPDATE products SET image_url = REPLACE(image_url, '.jpg', '.png')").run();
console.log('Updated all image URLs from .jpg to .png');
