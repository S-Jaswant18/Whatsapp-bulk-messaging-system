# WhatsApp Bulk Messaging System

A full-stack application for managing bulk WhatsApp messaging campaigns with user authentication, contact management, and campaign tracking.

## Features

- **User Authentication**: Register, login, and secure JWT-based authentication
- **Contact Management**: Add, edit, delete, and organize contacts with tags
- **Campaign Management**: Create and manage bulk messaging campaigns
- **Dashboard**: View statistics and recent campaign activity
- **Responsive UI**: Modern UI built with React and Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Tailwind CSS for styling
- Vite for build tooling

## Project Structure

```
whatsapp-bulk-system/
│
├── backend/
│   ├── server.js
│   ├── config/
│   │     └── db.js
│   ├── models/
│   │     ├── User.js
│   │     ├── Contact.js
│   │     ├── Campaign.js
│   │     └── MessageLog.js
│   ├── controllers/
│   │     ├── authController.js
│   │     ├── contactController.js
│   │     └── campaignController.js
│   ├── routes/
│   │     ├── authRoutes.js
│   │     ├── contactRoutes.js
│   │     └── campaignRoutes.js
│   ├── middleware/
│   │     └── authMiddleware.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │     ├── Login.jsx
    │   │     ├── Register.jsx
    │   │     ├── Dashboard.jsx
    │   │     ├── Contacts.jsx
    │   │     └── Campaigns.jsx
    │   ├── components/
    │   │     ├── Navbar.jsx
    │   │     └── Sidebar.jsx
    │   ├── services/
    │   │     └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsapp-bulk-system
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Contacts
- `GET /api/contacts` - Get all contacts (protected)
- `GET /api/contacts/:id` - Get single contact (protected)
- `POST /api/contacts` - Create new contact (protected)
- `PUT /api/contacts/:id` - Update contact (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)
- `POST /api/contacts/bulk` - Bulk import contacts (protected)

### Campaigns
- `GET /api/campaigns` - Get all campaigns (protected)
- `GET /api/campaigns/:id` - Get single campaign (protected)
- `POST /api/campaigns` - Create new campaign (protected)
- `PUT /api/campaigns/:id` - Update campaign (protected)
- `DELETE /api/campaigns/:id` - Delete campaign (protected)
- `POST /api/campaigns/:id/start` - Start campaign (protected)
- `GET /api/campaigns/:id/stats` - Get campaign statistics (protected)

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Contacts**: Navigate to the Contacts page to add your contacts
3. **Create Campaign**: Go to Campaigns page, create a new campaign, select contacts, and compose your message
4. **Start Campaign**: Start the campaign to begin sending messages
5. **Monitor Progress**: View campaign statistics and message delivery status on the Dashboard

## Notes

- **WhatsApp Integration**: This application structure includes placeholders for WhatsApp integration. You'll need to integrate with WhatsApp Business API or use a library like `whatsapp-web.js` for actual message sending functionality.
- **Security**: Make sure to change the JWT_SECRET in production and use secure HTTPS connections.
- **MongoDB**: Ensure MongoDB is running before starting the backend server.

## Future Enhancements

- WhatsApp Business API integration
- Message scheduling
- Media attachment support (images, videos, documents)
- Message templates
- Analytics and reporting
- CSV import for bulk contacts
- Message personalization with variables
- Rate limiting for message sending

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
