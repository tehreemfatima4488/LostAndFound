## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**  
- **MongoDB** 
- **npm** 

## Installation

1. **Navigate to the backend directory:**
   ```bash
   cd LostAndFound/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify `.env` file exists with these values:**
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/lost_and_found
   JWT_SECRET=ThisIsSuperSecurePassword
   ```

4. **Create the uploads folder** (if it doesn't exist):
   ```bash
   mkdir uploads
   ```

## Running the Application

### Prerequisites Check
- Ensure MongoDB is running locally on port 27017
- Verify port 5000 is available

### Start the Server

**Development mode with auto-reload:**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

Expected output on console: `Server running on http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Item Routes (`/api/items`)

**Create Item** (Protected - requires JWT token)
```
POST /api/items
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Blue Backpack",
  "description": "Navy blue backpack with laptop compartment",
  "category": "bags",
  "type": "lost",
  "locationText": "Main Library, Building A",
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "date": "2026-04-20T10:30:00Z",
  "imageUrl": "http://localhost:5000/uploads/...",
  "status": "active"
}
```

**Get All Items**
```
GET /api/items
```

**Get Item by ID**
```
GET /api/items/:id
```

**Update Item** (Protected)
```
PUT /api/items/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Delete Item** (Protected)
```
DELETE /api/items/:id
Authorization: Bearer <JWT_TOKEN>
```

### Upload Routes (`/api/upload`)

**Upload Image** (Protected - requires JWT token)
```bash
curl --location --request POST 'http://localhost:5000/api/upload' \
--header 'Authorization: Bearer <JWT_TOKEN>' \
--form 'image=@"C:/path/to/image.png"'
```

**Supported formats:** JPEG, JPG, PNG, WebP  
**Max file size:** 5MB

## Quick Start Example

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

2. **Login and get JWT token:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```
   Copy the token from the response.

3. **Upload an image:**
   ```bash
   curl -X POST http://localhost:5000/api/upload \
     -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
     -F "image=@/path/to/image.png"
   ```
   Copy the imageUrl from the response.

4. **Create an item:**
   ```bash
   curl -X POST http://localhost:5000/api/items \
     -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"title":"Lost Phone","type":"lost","description":"Black iPhone 12","imageUrl":"<imageUrl_from_step_3>"}'
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB Connection Error | Ensure MongoDB is running: `mongod` and verify MONGO_URI in .env |
| Port 5000 Already in Use | Change PORT in .env or kill process using port 5000 |
| JWT Token Errors | Verify Authorization header format: `Authorization: Bearer <token>` |
| File Upload Fails | Use form-data (not JSON), ensure file format is supported, file < 5MB |
| "next is not a function" | Pre-save hook error - use async without next parameter |
| Field Mismatch Errors | Ensure field names match schema (userID vs userId) |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/lost_and_found |
| JWT_SECRET | Secret key for JWT signing | ThisIsSuperSecurePassword |
