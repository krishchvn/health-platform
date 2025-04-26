# Health Platform – Real-Time Consultation Web App

A full-stack, serverless health consultation platform where patients can connect with doctors in real-time using secure chat, image sharing, and notification services.

Check the website out: https://health-platform-three.vercel.app

Backend hosted on Render.

---

## 🚀 Technologies Used

| Technology          | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| **React + TypeScript** | Frontend UI with role-based dashboards for patients and doctors         |
| **Tailwind CSS**     | Styling components for responsiveness and utility-first design          |
| **Clerk**            | Authentication and role-based access (Doctor vs Patient)                |
| **Socket.io**        | Real-time, 1-to-1 chat between patient and doctor                        |
| **AWS DynamoDB**     | Storing user records and chat messages in NoSQL format                  |
| **AWS Lambda**       | Serverless backend APIs for posting and retrieving messages             |
| **AWS S3**           | Uploading and serving image attachments in chat                         |
| **AWS EventBridge**  | Triggers on S3 upload to store metadata in DynamoDB automatically       |
| **AWS SNS**          | Sending real-time email notifications to recipient when new messages arrive |
| **API Gateway**      | Routing frontend requests to Lambda functions securely                  |

---
# How to start 
### Clerk Auth
Sign in to Clerk and you can find VITE_CLERK_PUBLISHABLE_KEY in API Keys.
Create a .env file in root folder to store VITE_CLERK_PUBLISHABLE_KEY.
### Frontend (React)
```bash
git clone https://github.com/krishchvn/health-platform.git
npm install
npm run dev
```
Open another terminal
```
cd server
node socket.js
```

# WorkFlow
1. User signs up via Clerk and selects role
2. Role is stored in Clerk metadata → redirected to appropriate dashboard
3. If Role == Patient clicks “Consult” → opens chat with selected doctor
   If Role == Doctor sees patients that have consulted and clicks "Open Chat" for further consultation
4. Chat messages and images are:
    4.1 Sent via Socket.io
    4.2 Stored in DynamoDB (via Lambda)
    4.3 Images uploaded to S3 -> trigger EventBridge -> metadata saved in DynamoDB
5. Notification sent to recipient via SNS
6. Doctor and Patient dashboards show real-time chat summaries and latest messages

# Author
Made with ❤️ by Krish

    If you found this project cool, consider ⭐️ starring the repo!

