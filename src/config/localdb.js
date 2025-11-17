const fs = require('fs');
const path = require('path');

// Data directory for JSON files
const dataDir = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper functions
const readData = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.warn(`⚠️  Could not read ${filename}:`, error.message);
    return [];
  }
};

const writeData = (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`❌ Could not write ${filename}:`, error.message);
  }
};

// Initialize default data if files don't exist
const initializeDefaults = () => {
  const eventsFile = path.join(dataDir, 'events.json');
  const usersFile = path.join(dataDir, 'users.json');
  const ordersFile = path.join(dataDir, 'orders.json');

  // Default events
  if (!fs.existsSync(eventsFile)) {
    const defaultEvents = [
      {
        id: 'EVT001',
        name: 'TechConf 2025',
        date: '2025-03-15',
        location: 'New Delhi',
        category: 'Technology',
        description: 'Annual technology conference featuring industry leaders and innovation showcase.',
        price: 2500,
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        total_tickets: 500,
        sold_tickets: 125
      },
      {
        id: 'EVT002',
        name: 'Mumbai Music Festival',
        date: '2025-04-20',
        location: 'Mumbai',
        category: 'Music',
        description: 'Three-day music festival with performances from national and international artists.',
        price: 1500,
        image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
        total_tickets: 1000,
        sold_tickets: 450
      }
    ];
    writeData('events.json', defaultEvents);
    console.log('✅ Created default events.json');
  }

  // Default users
  if (!fs.existsSync(usersFile)) {
    const defaultUsers = [
      {
        id: 'USR001',
        email: 'client@glau.com',
        password: 'client123',
        name: 'Rajesh Kumar',
        role: 'client'
      },
      {
        id: 'ADM001',
        email: 'admin@glau.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      }
    ];
    writeData('users.json', defaultUsers);
    console.log('✅ Created default users.json');
  }

  // Default orders
  if (!fs.existsSync(ordersFile)) {
    writeData('orders.json', []);
    console.log('✅ Created default orders.json');
  }
};

// Initialize on module load
initializeDefaults();

module.exports = {
  readData,
  writeData,
  dataDir
};
