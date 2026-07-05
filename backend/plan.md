# Backend Laravel POS

## React Native
- Login
- Dashboard
- POS
- Produk
- Customer
- Supplier
- Laporan
- Setting

↓

## Laravel API

### Authentication
- Login
- Logout
- Refresh Token
- Profile
- Change Password

↓

### Middleware
- Auth Sanctum
- Role
- Permission

↓

### Master Data

#### User
- Create User
- Update User
- Delete User
- List User

#### Role
- Admin
- Kasir
- Owner

#### Product
- CRUD Product
- Barcode
- Search Product
- Update Stock

#### Category
- CRUD Category

#### Unit
- CRUD Unit

#### Supplier
- CRUD Supplier

#### Customer
- CRUD Customer

↓

### Transaction

#### Sales

- Create Transaction
- Add Item
- Remove Item
- Update Qty
- Discount
- Tax
- Payment
- Save Transaction
- Print Receipt

↓

Sale Items

↓

Reduce Stock

↓

Stock Movement

---

#### Purchase

- Create Purchase
- Supplier
- Add Item
- Save Purchase

↓

Purchase Items

↓

Increase Stock

↓

Stock Movement

---

#### Return Sales

- Return Item
- Update Stock

---

#### Return Purchase

- Return Supplier
- Update Stock

↓

### Inventory

#### Stock

- Current Stock
- Stock History
- Stock Adjustment
- Stock Opname

↓

### Report

#### Sales Report

- Daily
- Weekly
- Monthly
- Yearly

#### Purchase Report

- Daily
- Monthly

#### Inventory Report

- Stock
- Low Stock
- Out of Stock

#### Profit Report

- Revenue
- Expense
- Profit

↓

### Dashboard

- Today's Sales
- Monthly Sales
- Total Product
- Total Customer
- Best Seller
- Low Stock
- Revenue

↓

### Settings

- Store Profile
- Tax
- Printer
- Receipt
- Backup
- Restore

↓

### Notification

- Low Stock
- Purchase Reminder

↓

### Logging

- Login Log
- Activity Log
- Error Log

↓

## Database

### users

↓

roles

↓

permissions

↓

categories

↓

units

↓

products

↓

customers

↓

suppliers

↓

sales

↓

sale_items

↓

purchases

↓

purchase_items

↓

payments

↓

stock_movements

↓

settings

↓

activity_logs

↓

failed_jobs

↓

personal_access_tokens

↓

## External Service (Optional)

- Redis
- Queue
- Storage
- Firebase Notification
- WhatsApp Gateway
- Email