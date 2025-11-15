# Blog website

This website uses JavaScript wrappers with SQL for the database tables.

## Showcase
https://youtu.be/hC9J_UpfqzU

> [!IMPORTANT]
> You need to create the database locally in order for this to work.

> [!NOTE]
> This project uses port 3001 by default unless specified otherwise in your .env


# Setup/Installation

`git clone https://github.com/Mitchyopp/blog-auth`
`cd blog-auth`
# CREATE THE DATABASE
On LINUX this is:

`sudo mysql`
```sql
CREATE DATABASE BlogDatabase;
CREATE USER 'bloguser'@'localhost' IDENTIFIED BY 'supersecretpasswordlol';
GRANT ALL PRIVILEGES ON BlogDatabase.* TO 'bloguser'@'localhost';
FLUSH PRIVILEGES;
```

Create a .env file `touch .env` (in the root of the project)
```env
DB_NAME=BlogDatabase
DB_USER=bloguser
DB_PASSWORD=supersecretpasswordlol
DB_HOST=localhost
JWT_SECRET=some-super-secret-string
PORT=3001
```

`npm run start`

Then open your browser and go to `http://localhost:3001`


# Features

Users can create an account, log into that account, create a blog post, delete it if they are logged in as the correct user and filter posts by category.

# Technologies

**Node.js**
**Express**
**MySQL**
**JWT**
**HTML5**
**CSS3**
**Javascript**
