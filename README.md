# Parent Social Circle API

A Node.js and MongoDB-based API that allows parents to join and manage social circles within their society or school. This system supports nested circles (e.g., "Brigade Society" -> "Brigade Society Bus 92" -> "Brigade Society Bus 92 Delhi") and provides options to discover, join, and fetch suggested circles.

---

## Features

- **Nested Circles**: Supports creation of nested social circles.
- **Circle Discovery**: Recommends circles to parents based on their current memberships.
- **Join Circles**: Allows parents to join circles and automatically adds them to both the parent’s and the circle’s records.
- **Circle Management**: Provides options for creating, updating, and viewing circles.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)

---

## Project Setup

### Prerequisites

1. **Node.js** and **npm** installed
2. **MongoDB** set up locally or on a service like MongoDB Atlas

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/parent-social-circle.git
   cd parent-social-circle
