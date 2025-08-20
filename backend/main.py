# backend/main.py

import os
import re
import shutil
from datetime import datetime
from typing import Dict, Any, Optional

import mysql.connector
import pytesseract
from PIL import Image
from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# --- Configuration ---
pytesseract.pytesseract.tesseract_cmd = r'D:\Tesseract-OCR\tesseract.exe'
DB_HOST = "localhost"
DB_USER = "YOUR_USERNAME"
DB_PASSWORD = "YOUR_PASSWORD"
DB_NAME = "doc_extractor_db"
VALIDATION_DB_NAME = "atos_srijan" # Master database for validation
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)

app = FastAPI(title="AI Loan Approval API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Connections ---
def get_db_connection(db_name: str):
    """Establishes a connection to the specified MySQL database."""
    try:
        return mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=db_name)
    except mysql.connector.Error as e:
        print(f"DB Connection Error to {db_name}: {e}")
        return None

# --- OCR and Parsing Logic (Unchanged) ---
def extract_text_from_image(file: UploadFile) -> str:
    """Saves, processes, and extracts text from an uploaded image file."""
    file_path = os.path.join(UPLOADS_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        text = pytesseract.image_to_string(Image.open(file_path), lang='eng+hin')
        return text
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

def parse_document_text(text: str) -> Dict[str, Optional[str]]:
    """This is our highly trained, custom OCR parsing logic."""
    data = {
        "aadhaar_number": None, "aadhaar_name": None, "aadhaar_dob": None,
        "pan_number": None, "pan_name": None, "pan_dob": None,
    }
    aadhaar_pattern = re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b')
    pan_pattern = re.compile(r'\b[A-Z]{5}\d{4}[A-Z]\b')
    dob_pattern = re.compile(r'(\d{2}/\d{2}/\d{4})')
    yob_pattern = re.compile(r'Year of Birth\s*[:]?\s*(\d{4})')
    generic_name_pattern = re.compile(r'([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})')
    pan_name_no_label_pattern = re.compile(r'^[A-Z\s]{5,}$')
    
    doc_texts = {}
    doc_texts['aadhaar'] = text.split('--- Start of aadhaar ---')[1].split('--- End of aadhaar ---')[0] if '--- Start of aadhaar ---' in text else ''
    doc_texts['pan'] = text.split('--- Start of pan ---')[1].split('--- End of pan ---')[0] if '--- Start of pan ---' in text else ''

    # Aadhaar Parsing
    if doc_texts['aadhaar']:
        aadhaar_text = doc_texts['aadhaar']
        lines = [line.strip() for line in aadhaar_text.split('\n') if line.strip()]
        match = aadhaar_pattern.search(aadhaar_text)
        if match:
            # Store with spaces for display, validation logic will handle spaces
            data["aadhaar_number"] = match.group(0)
        dob_line_index = -1
        for i, line in enumerate(lines):
            yob_match = yob_pattern.search(line)
            dob_match = dob_pattern.search(line)
            if yob_match:
                data["aadhaar_dob"] = yob_match.group(1)
                dob_line_index = i
                break
            elif dob_match:
                data["aadhaar_dob"] = dob_match.group(1)
                dob_line_index = i
                break
        if dob_line_index > 0:
            name_line = lines[dob_line_index - 1]
            name_match = generic_name_pattern.search(name_line)
            if name_match:
                data["aadhaar_name"] = name_match.group(1).strip()
        if not data["aadhaar_name"]:
            for line in lines:
                name_match = generic_name_pattern.search(line)
                if name_match and "Government" not in line:
                    data["aadhaar_name"] = name_match.group(1).strip()
                    break
    
    # PAN Parsing
    if doc_texts['pan']:
        pan_text = doc_texts['pan']
        lines = [line.strip() for line in pan_text.split('\n') if line.strip()]
        pan_match = pan_pattern.search(pan_text)
        if pan_match:
            data["pan_number"] = pan_match.group(0)
        dob_match = dob_pattern.search(pan_text)
        if dob_match:
            data["pan_dob"] = dob_match.group(1)
        name_line_index = -1
        for i, line in enumerate(lines):
            if "Name" in line and "Father" not in line:
                name_line_index = i
                break
        if name_line_index != -1 and name_line_index + 1 < len(lines):
            data["pan_name"] = lines[name_line_index + 1]
        else:
            potential_names = []
            for line in lines:
                if pan_name_no_label_pattern.match(line) and len(line.split()) >= 2:
                    if "DEPARTMENT" not in line and "GOVT" not in line and "PERMANENT" not in line:
                        potential_names.append(line)
            if potential_names:
                data["pan_name"] = potential_names[0]
    return data

# --- KYC Validation Logic with DEBUGGING and FIX ---
def validate_kyc_details(extracted_data: Dict[str, Any]) -> bool:
    """Validates extracted details against the master identitydetails table with detailed logging."""
    print("\n" + "="*50)
    print("||       STARTING KYC VALIDATION        ||")
    print("="*50)
    
    db_conn = get_db_connection(VALIDATION_DB_NAME)
    if not db_conn:
        print("[DEBUG] FAILED: Could not connect to validation database.")
        return False

    is_valid = False
    try:
        cursor = db_conn.cursor(dictionary=True)
        pan_to_check = extracted_data.get("pan_number")
        print(f"[DEBUG] 1. LOOKUP: Searching for PAN Number '{pan_to_check}' in master DB.")
        
        query = "SELECT * FROM identitydetails WHERE PAN_Number = %s"
        cursor.execute(query, (pan_to_check,))
        master_record = cursor.fetchone()

        if not master_record:
            print(f"[DEBUG] FAILED: No master record found for PAN '{pan_to_check}'.")
            return False
        
        print("[DEBUG] SUCCESS: Master record found.")
        print("\n--- DATA COMPARISON ---")
        
        # --- Date Format Normalization ---
        master_pan_dob_obj = master_record.get("DOB_PAN")
        master_aadhaar_dob_obj = master_record.get("DOB_Aadhar")
        master_pan_dob_str = master_pan_dob_obj.strftime('%d/%m/%Y') if master_pan_dob_obj else None
        master_aadhaar_dob_str = master_aadhaar_dob_obj.strftime('%d/%m/%Y') if master_aadhaar_dob_obj else None
        print("[DEBUG] 2. NORMALIZE: Master dates converted for comparison.")

        # --- Field-by-Field Verification with Logging ---
        print("[DEBUG] 3. VERIFY: Comparing all fields...")
        pan_name_match = (extracted_data.get("pan_name", "") or "").upper() == (master_record.get("PAN_Card_Name", "") or "").upper()
        print(f"  - PAN Name Match:      {pan_name_match} ('{extracted_data.get('pan_name', '').upper()}' vs '{master_record.get('PAN_Card_Name', '').upper()}')")

        aadhaar_name_match = (extracted_data.get("aadhaar_name", "") or "").strip().upper() == (master_record.get("Aadhar_Card_Name", "") or "").strip().upper()
        print(f"  - Aadhaar Name Match:  {aadhaar_name_match} ('{extracted_data.get('aadhaar_name', '').strip().upper()}' vs '{master_record.get('Aadhar_Card_Name', '').strip().upper()}')")
        
        pan_dob_match = extracted_data.get("pan_dob") == master_pan_dob_str
        print(f"  - PAN DOB Match:       {pan_dob_match} ('{extracted_data.get('pan_dob')}' vs '{master_pan_dob_str}')")
        
        aadhaar_dob_match = extracted_data.get("aadhaar_dob") == master_aadhaar_dob_str
        print(f"  - Aadhaar DOB Match:   {aadhaar_dob_match} ('{extracted_data.get('aadhaar_dob')}' vs '{master_aadhaar_dob_str}')")
        
        # --- FIX: Remove spaces from extracted Aadhaar number before comparing ---
        extracted_aadhaar_no_spaces = (extracted_data.get("aadhaar_number") or "").replace(" ", "")
        master_aadhaar_no_spaces = (master_record.get("Aadhar_Number") or "").replace(" ", "")
        aadhaar_number_match = extracted_aadhaar_no_spaces == master_aadhaar_no_spaces
        print(f"  - Aadhaar No. Match:   {aadhaar_number_match} ('{extracted_aadhaar_no_spaces}' vs '{master_aadhaar_no_spaces}')")
        
        print("--- END COMPARISON ---")

        if all([pan_name_match, aadhaar_name_match, pan_dob_match, aadhaar_dob_match, aadhaar_number_match]):
            is_valid = True
            print("\n[DEBUG] 4. DECISION: All fields match. KYC VALID.")
        else:
            print("\n[DEBUG] 4. DECISION: One or more fields do not match. KYC INVALID.")
            
    except mysql.connector.Error as e:
        print(f"[DEBUG] FAILED: Validation query error: {e}")
    finally:
        if db_conn.is_connected():
            db_conn.close()
        print("="*50)
        print("||        END KYC VALIDATION          ||")
        print("="*50 + "\n")
            
    return is_valid

# --- Financial Logic (Unchanged) ---
def calculate_age(dob_str: str) -> Optional[int]:
    """Calculates age from a DOB string."""
    try:
        if len(dob_str) == 4: return datetime.now().year - int(dob_str)
        birth_date = datetime.strptime(dob_str, '%d/%m/%Y')
        today = datetime.today()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    except (ValueError, TypeError): return None

def calculate_emi(p: float, r: float, n: int) -> float:
    """Calculates EMI."""
    r_monthly = r / (12 * 100)
    if r_monthly == 0: return p / n
    return (p * r_monthly * (1 + r_monthly)**n) / ((1 + r_monthly)**n - 1)

def run_loan_eligibility_model(age: int, annual_income_lakhs: float, desired_amount: float, desired_tenure: int) -> Dict[str, Any]:
    """The core financial model to determine loan eligibility."""
    if not (18 <= age <= 60): return {"status": "Rejected", "reason": "Age must be between 18 and 60."}
    monthly_income = (annual_income_lakhs * 100000) / 12
    if monthly_income < 25000: return {"status": "Rejected", "reason": "Minimum net monthly income of Rs. 25,000 is required."}
    interest_rate = 14.5 if age < 30 else (12.0 if age < 45 else 13.0)
    max_loan_by_income = monthly_income * 20
    max_permissible_emi = monthly_income * 0.50
    r_monthly = interest_rate / (12 * 100)
    max_loan_by_emi = (max_permissible_emi * (((1 + r_monthly)**desired_tenure - 1))) / (r_monthly * (1 + r_monthly)**desired_tenure)
    eligible_amount = round(min(desired_amount, max_loan_by_income, max_loan_by_emi) / 1000) * 1000
    if eligible_amount < 50000: return {"status": "Rejected", "reason": f"Calculated eligible amount (Rs. {int(eligible_amount)}) is below the minimum of Rs. 50,000."}
    suggested_tenure = min(desired_tenure, 60)
    final_emi = calculate_emi(eligible_amount, interest_rate, suggested_tenure)
    return {"status": "Approved", "eligible_amount": int(eligible_amount), "offered_rate": interest_rate, "offered_tenure": suggested_tenure, "calculated_emi": int(final_emi)}

# --- API Endpoint (UPDATED with Validation Step) ---
@app.post("/extract")
async def process_application(
    aadhaar_file: UploadFile, pan_file: UploadFile,
    annual_income: float = Form(...), desired_amount: float = Form(...), desired_tenure: int = Form(...)
):
    """Main endpoint to process loan applications."""
    combined_text = ""
    try:
        for doc_type, file in [("aadhaar", aadhaar_file), ("pan", pan_file)]:
            combined_text += f"\n--- Start of {doc_type} ---\n"
            combined_text += extract_text_from_image(file)
            combined_text += f"\n--- End of {doc_type} ---\n"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")

    extracted_data = parse_document_text(combined_text)
    
    # --- NEW VALIDATION STEP ---
    if not validate_kyc_details(extracted_data):
        rejection_response = {
            "status": "Rejected",
            "reason": "KYC Verification Failed. The details on the uploaded documents do not match our official records. Please ensure you are using correct documents."
        }
        return {**extracted_data, **rejection_response}

    # --- Continue with loan logic only if validation passes ---
    dob = extracted_data.get('aadhaar_dob') or extracted_data.get('pan_dob')
    if not dob: raise HTTPException(status_code=400, detail="Could not extract Date of Birth from documents.")
    age = calculate_age(dob)
    if not age: raise HTTPException(status_code=400, detail="Could not calculate age from Date of Birth.")

    loan_offer = run_loan_eligibility_model(age, annual_income, desired_amount, desired_tenure)
    final_result = {**extracted_data, **loan_offer, "annual_income": f"{annual_income} Lakhs"}

    # Save to application DB
    app_db_conn = get_db_connection(DB_NAME)
    if app_db_conn:
        try:
            cursor = app_db_conn.cursor()
            sql = "INSERT INTO extracted_data (aadhaar_number, aadhaar_name, aadhaar_dob, pan_number, pan_name, pan_dob, salary_gross) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            values = (final_result.get("aadhaar_number"), final_result.get("aadhaar_name"), final_result.get("aadhaar_dob"), final_result.get("pan_number"), final_result.get("pan_name"), final_result.get("pan_dob"), final_result.get("annual_income"))
            cursor.execute(sql, values)
            app_db_conn.commit()
        except mysql.connector.Error as e:
            print(f"DB Insert Error: {e}")
        finally:
            cursor.close()
            app_db_conn.close()

    return final_result
