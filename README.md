# Finsecure AI – An AI Powered Loan Approval Bot

🚀 Prototype submission for **ATOS Srijan 2025**  
👥 Developed by **Team BitSquad VIT**

---

## 📌 Problem Statement

In the BFSI (Banking, Financial Services, and Insurance) sector, loan approvals are often **time-consuming, error-prone, and vulnerable to fraud** because most document verification is still performed manually by loan officers.  

Documents such as **Aadhaar, PAN, salary slips, income certificates, and bank statements** need to be verified for authenticity and eligibility. Manual checks not only delay the process but also affect transparency and customer experience.

---

## 💡 Proposed Solution

We built **Finsecure AI**, an **AI-powered loan approval assistant** that:  

- Uses **OCR (Optical Character Recognition)** to extract data from applicant documents.  
- Classifies documents (Aadhaar, PAN, salary slip, bank statement, etc.) automatically.  
- Applies rule-based/AI checks to **approve or reject applications** in near real-time.  
- Maintains an **audit trail** to ensure transparency and explainability of decisions.  
- Scales to integrate with banking systems and APIs in production environments.  

For the **prototype**, due to limitations of Tesseract OCR, we have focused on **Aadhaar and PAN verification**. In the **final product**, we will use strong OCR tools like **Google Cloud Vision API**, **Microsoft Azure** or **AWS** to support all required financial documents (salary slips, income certificates, bank statements, etc.).

---

## ⚙️ Prerequisites

Before running this project locally, make sure you have the following installed:

- **Python 3.9+**  
- **MySQL 8.0+** (with your own DB username & password)  
- **Node.js 18+** and **npm** (for frontend)  
- **React Vite v6**  
- **Git**  

---

## 🚀 Instructions to Run Locally

1. **Clone the repository**
2. **Configure backend database**: Open backend/main.py and update your MySQL credentials:
   ```bash
   DB_USER = "YOUR_USERNAME"
   DB_PASSWORD = "YOUR_PASSWORD"
   ```
3. **Start Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   Your backend will start on http://localhost:8000
4. **Start Fronted**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:5173
5. **Access the Application**:
   Open your browser and go to:
   👉 http://localhost:5173/

---

## 🎥 Demo Video

You can check out the detailed demo video here 👉 https://drive.google.com/drive/folders/1SP8j-EhHSe437e6djbYTF__OtZB-gC4p?usp=sharing
