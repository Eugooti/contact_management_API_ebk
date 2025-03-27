# Contact Management System API

The **Contact Management System API** is a RESTful API built with **Node.js, Express, MySQL, and Sequelize ORM**. It enables users to efficiently create, read, update, and delete (CRUD) contact information while ensuring data integrity and security.

## Features
- User authentication (JWT-based)
- CRUD operations for contacts
- Search and filter contacts
- Secure data handling with Sequelize ORM

---

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JSON Web Tokens (JWT)

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Installation

1. Clone the repository:
   ```sh
   git remote add origin https://github.com/Eugooti/contact_management_API_ebk.git
   cd contact-management-api
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a **.env** file and configure database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=contact_management
   JWT_SECRET=your_secret_key
   PORT=8080
   ```



4. Start the server:
   ```sh
   npm start
   ```
   The API will be available at `http://localhost:8080`.

---

## API Endpoints

### Authentication
| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| POST   | `/api/auth/login`    | Authenticate user |
| GET    | `/api/auth/logout`   | Authenticate user |

### Contacts
| Method | Endpoint               | Description           |
|--------|------------------------|----------------------|
| GET    | `/api/contacts/read`   | Get all contacts |
| POST   | `/api/contacts/create` | Create a contact |
| PUT    | `/api/contacts/:id`    | Update a contact |
| DELETE | `/api/contacts/:id`    | Delete a contact |

---

## Security
- Uses **JWT authentication** for user access.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact
For any inquiries or contributions, reach out via:
- Email: eochieng@ebk.go.ke
- GitHub: [Eugooti](https://github.com/your-username)

