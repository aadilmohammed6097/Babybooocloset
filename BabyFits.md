# Babybooocloset Frontend Documentation

## Project Overview

Babybooocloset is a premium baby clothing e-commerce website inspired by modern stores such as LillyWhale, Zara Kids, and H&M Baby.

The frontend should feel:

- Premium
- Elegant
- Minimal
- Soft colors
- Fast
- Responsive
- Modern

The design should focus on showcasing products with large images, clean typography, generous spacing, and a smooth shopping experience.

---

# Technology Stack

## Framework

- React 19
- TypeScript
- Vite

## Routing

- React Router DOM

## Styling

- CSS Modules

Reason:
- Component scoped styles
- Easy maintenance
- Production ready
- No CSS conflicts

## Icons

- Lucide React

## State Management

Current:
- React Context API

Future:
- Redux Toolkit (if needed)

## HTTP Client

Future:
- Axios

## Code Style

- Functional Components
- React Hooks
- TypeScript
- PascalCase naming
- Reusable Components

---

# Design Philosophy

The website should look modern and premium.

Avoid:

- Heavy colors
- Large borders
- Overly colorful UI
- Complex animations
- Crowded layouts

Preferred design:

- White backgrounds
- Beige / Cream accents
- Rounded corners
- Soft shadows
- Large product photography
- Elegant spacing
- Smooth hover effects

Reference Websites

- LillyWhale
- Zara Kids
- H&M Baby
- Jamie Kay

---

# Color Palette

Primary

#A67C52

Secondary

#DCC5A0

Background

#FFFFFF

Section Background

#FAF8F6

Text Primary

#222222

Text Secondary

#666666

Border

#ECECEC

Success

#4CAF50

Error

#E53935

---

# Typography

Primary Font

Poppins

Logo Font

Playfair Display

Heading Style

Large
Minimal
Elegant

Body Text

Simple
Readable
Light Weight

---

# Responsive Design

Desktop

1200px+

Laptop

992px

Tablet

768px

Mobile

576px

Every page must be fully responsive.

---

# Frontend Folder Structure

src/

assets/
images/
icons/
logo/

components/

Navbar/
Footer/
Hero/
Collections/
FeaturedProducts/
ProductCard/
Button/
Loader/
Modal/

pages/

Home/
Shop/
ProductDetails/
Cart/
Checkout/
Orders/
Login/
Contact/

layouts/

routes/

context/

hooks/

services/

utils/

styles/

---

# Website Pages

## Home

Contains:

Navbar

↓

Hero Banner

↓

Collections

↓

Featured Products

↓

New Arrivals

↓

Newsletter

↓

Footer

---

## Shop

Contains:

Navbar

↓

Search Bar

↓

Filters

Category

Age

Price

↓

Product Grid

↓

Pagination

↓

Footer

---

## Product Details

Contains:

Navbar

↓

Image Gallery

↓

Product Information

↓

Price

↓

Available Sizes

↓

Quantity Selector

↓

Add To Cart

↓

Related Products

↓

Footer

---

## Cart

Contains:

Navbar

↓

Cart Products

↓

Quantity Update

↓

Remove Item

↓

Order Summary

↓

Checkout Button

↓

Footer

---

## Checkout

Contains:

Shipping Address

Payment Method

Order Summary

Place Order

---

## Orders

Contains:

Previous Orders

Status

Order Details

Invoice

---

## Login

Contains:

Logo

Login Form

Register

Forgot Password

---

# Navigation Bar

Desktop Layout

-----------------------------------------------------

Logo

Home

Shop

Contact

My Orders

Search

Profile

Cart

-----------------------------------------------------

Requirements

Sticky

Responsive

Hover animations

Active page highlight

Cart count badge

Mobile menu

---

# Hero Banner

Large full-width background image.

Centered content.

Heading

Made for Tiny Giggles & Big Cuddles

Subtitle

Premium baby clothing for your little one.

Primary Button

Shop Now

Smooth fade animation.

---

# Collections Section

Display four categories.

unisex

Baby Girl

Baby Boy

unisex

Each card contains

Image

Title

Hover animation

Clickable

---

# Featured Products

Each product card contains

Product Image

Product Name

Price

Add To Cart Button

Wishlist Icon

Hover Effect

Product cards should be reusable.

---

# Footer

Contains

Logo

Quick Links

Collections

Contact Information

Newsletter

Social Media

Copyright

---

# Animations

Keep animations subtle.

Preferred

Fade In

Scale

Slide Up

Hover Lift

Avoid flashy animations.

---

# Coding Standards

Always use:

TypeScript

Functional Components

CSS Modules

Reusable Components

Reusable Interfaces

Clean Folder Structure

Small Components

Readable Code

Avoid inline styles.

Avoid duplicated code.

---

# Naming Convention

Folders

PascalCase

Example

Navbar

Hero

ProductCard

Files

PascalCase

Navbar.tsx

ProductCard.tsx

CSS

Navbar.module.css

Variables

camelCase

Functions

camelCase

Interfaces

PascalCase

Example

Product

CartItem

Category

---

# Future Backend Integration

Frontend should be designed so data can later come from APIs instead of hardcoded arrays.

Never tightly couple UI with data.

Use interfaces for every data model.

Example

Product

Category

Cart

Order

User

---

# Performance Goals

Lazy loading

Optimized images

Reusable components

Minimal re-rendering

Responsive images

Fast page loading

---

# Overall Goal

The final frontend should resemble a premium baby clothing brand.

The shopping experience should feel elegant, modern, clean, and trustworthy while remaining lightweight and responsive.