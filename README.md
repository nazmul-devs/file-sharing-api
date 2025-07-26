# 📁 File Sharing API (Node.js)

This is a Node.js backend API for uploading, downloading, and deleting files using a unique public/private key system. It supports both **local file storage** and optional **Google Cloud Storage** (GCS).

---

## 🚀 Features

- Upload files with `multipart/form-data`
- Secure access using public/private keys
- Local filesystem + GCS support (plug-and-play)
- Configurable daily limits per IP
- Auto-cleanup of inactive files
- Full unit + integration testing support

---

# 📂 File Sharing API

A simple Node.js + Express API for uploading, listing, viewing, and deleting files.

## 📦 Installation

```bash
git clone https://github.com/nazmul-devs/file-sharing-api.git
cd file-sharing-api
npm install
```

## 🚀 Server run on

```bash
http://localhost:3000
```

## 🔗 API Routes

```bash
Create (Upload): POST http://localhost:3000/files Body: form-data (key: file)
Get All Files: GET http://localhost:3000/files
View a File: GET http://localhost:3000/files/:publicKey
Delete a File: DELETE http://localhost:3000/files/:privateKey
```
