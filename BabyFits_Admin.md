---

# Admin Panel

## Overview

Babybooocloset includes a dedicated Admin Panel that allows the store owner to manage the website without modifying the source code.

The admin panel is completely separate from the customer-facing website and is protected using Supabase Authentication.

Only authorized administrators can access the dashboard.

---

# Admin URL Structure

```
/admin/login
/admin/dashboard
/admin/products
/admin/products/add
/admin/products/edit/:id
/admin/categories
/admin/orders
/admin/settings
```

---

# Authentication

Authentication is handled using **Supabase Auth**.

Only one administrator account is required for this project.

Features:

- Secure Login
- Session Management
- Protected Routes
- Logout

There is **no public registration** for administrators.

---

# Admin Dashboard

Dashboard should provide a quick overview of the store.

Example widgets:

- Total Products
- Featured Products
- New Arrivals
- Low Stock Products
- Total Orders
- Pending Orders

---

# Admin Sidebar

Navigation Menu

```
Dashboard

Products

Categories

Orders

Settings

Logout
```

The sidebar should remain fixed on desktop and collapse into a drawer on mobile devices.

---

# Product Management

The Products page should allow the administrator to:

- View all products
- Search products
- Filter products
- Add new products
- Edit existing products
- Delete products

Each product card/table row should display:

- Product Image
- Product Name
- Category
- Price
- Stock
- Featured Status
- New Arrival Status
- Actions

---

# Add Product

The Add Product page should contain:

- Product Image Upload
- Product Name
- Description
- Price
- Sale Price
- Stock
- Category Selection
- Featured Toggle
- New Arrival Toggle
- Save Button
- Cancel Button

Product images are uploaded to **Supabase Storage**, while product details are stored in the **Supabase Database**.

---

# Edit Product

The Edit Product page should allow:

- Update product information
- Replace product image
- Change stock
- Update pricing
- Enable/Disable Featured
- Enable/Disable New Arrival

---

# Categories

The store contains the following categories:

- Boys
- Girls
- unisex Essentials
- Unisex

The administrator should be able to:

- View Categories
- Add Categories (future enhancement)
- Edit Category Names (future enhancement)
- Delete Categories (future enhancement)

Initially, only these four predefined categories will be used.

---

# Orders

The Orders page should display:

- Order ID
- Customer Name
- Phone Number
- Order Date
- Order Status
- Total Amount

The administrator should be able to:

- View Order Details
- Update Order Status

Order Status examples:

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

---

# Settings

The Settings page can later include:

- Store Information
- Contact Details
- Social Media Links
- Footer Content
- Website Logo
- Hero Banner Management

---

# Admin UI Design

The Admin Panel should follow a clean and professional dashboard design.

Design Guidelines:

- White background
- Light gray sections
- Minimal shadows
- Rounded cards
- Consistent spacing
- Professional typography
- Responsive layout

Avoid excessive animations and unnecessary visual clutter.

---

# Folder Structure

```
src/

admin/

    components/

        Sidebar/

        Header/

        ProductTable/

        ProductForm/

        DashboardCard/

    pages/

        Login/

        Dashboard/

        Products/

        AddProduct/

        EditProduct/

        Orders/

        Settings/

    layouts/

        AdminLayout/

    routes/

        AdminRoutes/

    services/

        productService.ts

        categoryService.ts

        orderService.ts

        authService.ts
```

---

# Backend Integration

The Admin Panel communicates directly with **Supabase**.

Services used:

- Supabase Authentication
- PostgreSQL Database
- Supabase Storage

No custom backend server is required.

---

# Security

The Admin Panel must implement:

- Protected Routes
- Session Validation
- Automatic Logout (optional)
- Role-based access (future enhancement)

Only authenticated administrators should be able to access admin pages.

---

# Future Enhancements

Possible future improvements:

- Multiple Admin Accounts
- Customer Management
- Coupon Management
- Inventory Alerts
- Sales Dashboard
- Analytics
- Product Reviews
- Wishlist Management
- Email Notifications
- Reports & Export
- Banner Management
- Discount Campaigns

---

# Admin Workflow

```
Admin Login
      │
      ▼
Dashboard
      │
      ▼
Products
      │
      ▼
Add / Edit Product
      │
      ▼
Upload Product Image
      │
      ▼
Save to Supabase
      │
      ▼
Website Updates Automatically
```

The administrator should be able to manage the entire Babybooocloset store through this dashboard without making any changes to the frontend code.