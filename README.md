# SBI Banking Backend

A secure and scalable **digital banking backend** built using **Node.js, Express.js, MongoDB, and JWT authentication**. The system provides APIs for account management, banking transactions, authentication, and immutable ledger records.

## 🚀 Features

* 🔐 **User Authentication & Authorization**

  * JWT-based authentication
  * Access and refresh token mechanism
  * Protected API routes

* 🏦 **Account Management**

  * Create and manage bank accounts
  * Retrieve account information
  * Secure account operations

* 💸 **Banking Transactions**

  * Deposit and withdrawal operations
  * Account-to-account transfers
  * Transaction validation
  * Idempotency support to prevent duplicate transactions

* 📒 **Immutable Ledger**

  * Maintains transaction records
  * Prevents unauthorized modification or deletion of ledger entries
  * Supports auditability and transaction tracking

* 📧 **Email Services**

  * Email notifications using Nodemailer
  * Gmail OAuth2 authentication

* 🛡️ **Security**

  * Environment-based configuration
  * JWT authentication
  * Request validation
  * Protected routes
  * Rate limiting

* 🗄️ **MongoDB Database**

  * MongoDB Atlas support
  * Mongoose ODM
  * Structured schemas and relationships

## 🛠️ Tech Stack

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | Backend runtime           |
| Express.js | REST API framework        |
| MongoDB    | Database                  |
| Mongoose   | MongoDB ODM               |
| JWT        | Authentication            |
| Nodemailer | Email services            |
| Redis      | Rate limiting / caching   |
| dotenv     | Environment configuration |

## 📁 Project Structure

```text
sbi/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── ...
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> The exact structure may evolve as new modules and services are added.

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Varad7727/SBI.git
cd SBI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=8000

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

REDIS_URL=your_redis_connection_string
```

**Never commit your `.env` file or other credentials to GitHub.**

### 4. Start the server

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

The API will run on:

```text
http://localhost:8000
```

## 🔑 Authentication

The application uses **JWT-based authentication**.

Typical authentication flow:

```text
User
  ↓
Login
  ↓
Authentication
  ↓
Access Token + Refresh Token
  ↓
Protected API
  ↓
Authorization
```

Protected requests require a valid access token.

## 💰 Transaction Flow

The banking transaction system follows a controlled transaction workflow:

```text
Client
  ↓
API Request
  ↓
Authentication
  ↓
Validation
  ↓
Transaction Processing
  ↓
Database Transaction
  ↓
Ledger Entry
  ↓
Response
```

The system uses database sessions for operations that require atomicity, helping maintain consistency when transferring funds between accounts.

## 📒 Ledger System

The ledger maintains a reliable record of financial transactions.

Ledger records are designed to be **immutable** after creation. Modification and deletion operations are restricted to preserve the integrity of transaction history.

This provides:

* Transaction traceability
* Audit history
* Data integrity
* Protection against accidental modification

## 🔁 Idempotency

The transaction APIs support **idempotency keys** to prevent duplicate processing when the same request is submitted multiple times.

For example:

```text
Client
  │
  ├── Transaction Request
  │       Idempotency-Key: ABC123
  │
  ↓
Server
  │
  ├── Check existing transaction
  │
  ├── New → Process
  │
  └── Existing → Return previous result
```

This is particularly important for financial applications where accidentally processing the same payment twice must be avoided.

## 📡 API Modules

The backend is organized around modular REST APIs including:

* Authentication
* Accounts
* Transactions
* Ledger
* User management

Example API structure:

```text
/api/auth
/api/account
/api/transaction
/api/ledger
```

> Endpoints may change as the project evolves.

## 🔒 Security Considerations

The following security practices are implemented or planned:

* JWT authentication
* Protected routes
* Environment variables for secrets
* Password security
* Rate limiting
* MongoDB validation
* Transaction atomicity
* Idempotent transaction processing
* Immutable ledger records

## 🧪 Development

Check the project status:

```bash
git status
```

Run the development server:

```bash
npm run dev
```

Build and test new features before pushing changes.

## 🔮 Future Improvements

* [ ] API documentation with Swagger/OpenAPI
* [ ] Automated unit and integration testing
* [ ] Role-based access control
* [ ] Advanced fraud detection
* [ ] Transaction analytics
* [ ] Docker containerization
* [ ] CI/CD pipeline
* [ ] Monitoring and logging
* [ ] React-based banking dashboard

## 👨‍💻 Author

**Varad Milind Sonavadekar**

Computer Engineering (AI & ML)

GitHub: [Varad7727](https://github.com/Varad7727)

## 📄 License

This project is developed for educational and academic purposes.
