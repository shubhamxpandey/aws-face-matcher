# React AWS Face Match

A full-stack facial recognition web application built with React, Node.js, and AWS Rekognition. This app captures a live photo via webcam and compares it against a pre-existing target image (like an Aadhaar or ID card) to verify identity in real-time.

## Features
- **Real-time Camera Integration:** Uses `react-webcam` to capture live photos from the user's browser.
- **AWS Rekognition API:** Leverages AWS Rekognition's powerful `CompareFaces` API for highly accurate face matching.
- **Security Checks:** Ensures only one face is present in the live capture and sets an 80% similarity threshold for successful matches.
- **Full-Stack Architecture:** 
  - **Frontend:** React.js
  - **Backend:** Node.js, Express, and Multer for handling file uploads.

## Prerequisites

Before running the application, make sure you have the following installed and set up:
- **Node.js** (v14+ recommended)
- **AWS Account:** You will need an AWS account with an IAM user that has access to **Amazon Rekognition**.

### AWS Credentials Setup
1. Log in to your AWS Console.
2. Go to IAM and create a user with programmatic access.
3. Attach the `AmazonRekognitionFullAccess` policy (or create a custom policy with `rekognition:CompareFaces` permissions).
4. Save the **Access Key ID** and **Secret Access Key**.

---

## Project Setup

Clone the repository and install the dependencies for both the frontend and backend.

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your AWS credentials:
```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

Make sure you have an image placed at `backend/uploads/aadhar/shubham.jpeg` as the base target image (or update the file path in `backend/server.js` to point to your desired target image).

Start the backend server:
```bash
npm run dev
```
The server will run at `http://localhost:5000`.

### 2. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the React application:
```bash
npm start
```
The application will run at `http://localhost:3000`.

---

## How It Works

1. The frontend fetches and displays the base target ID image.
2. The user clicks "Open Camera" to grant webcam access.
3. The user clicks "Capture & Compare" to take a live photo.
4. The photo is sent to the Express backend via `FormData`.
5. The backend uses the AWS SDK to send both the target image and live image to Amazon Rekognition.
6. The backend returns a similarity percentage. If the similarity is above 80% and only one face is detected, it's considered a match!

## Technologies Used
- **Frontend:** React, `react-webcam`
- **Backend:** Node.js, Express, Multer
- **Cloud/AI:** AWS SDK (`@aws-sdk/client-rekognition`)

## License
This project is open-source and available under the [MIT License](LICENSE).
