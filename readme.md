# Vendor Feed Integration & XML Processing Service

# Overview
A backend system for integrating and normalizing supplier XML feeds into a unified product database.

It solves the problem of inconsistent data formats across multiple vendors by using a pluggable adapter architecture.

# Problem
Different suppliers provide product data in incompatible XML formats:
- different field names
- different structures
- inconsistent attributes

This makes it difficult to maintain a clean and unified product catalog.

# Solution
This project introduces a vendor adapter system:
- Each supplier defines a small adapter
- XML feeds are parsed and normalized into a unified schema
- Data is stored in a relational database
- New XML feeds can be generated from normalized data

# Features
- XML parsing and transformation
- Vendor-specific adapters (extensible)
- Data normalization across suppliers
- Relational database design (Sequelize + SQLite)
- Automated processing via cron jobs
- XML export builder
- Backend API for frontend integration

# Architecture
Vendor XML → Adapter → Normalization → Database → XML Builder / API

# Data Model
Main entities:
- Product (Izdelek)
- Supplier (Dobavitelj)
- Category (Kategorija)
- Attribute (Atribut)
- Filter
- Component (Komponenta)

Key relationships:
- One product can exist across multiple suppliers
- Suppliers provide different attributes for the same product
- Categories define filters and components
- Attributes are linked dynamically to components

# Example Flow
1. XML feed is downloaded from supplier
2. Adapter maps XML → internal structure
3. Product is created or updated
4. Supplier-specific data is stored
5. Attributes and filters are normalized
6. New XML feeds are generated

# Tech Stack
- Node.js
- Sequelize
- SQLite
- Express
- Cron jobs

# Setup

bash
npm install