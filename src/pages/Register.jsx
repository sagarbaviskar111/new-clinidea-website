import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BASE_URL } from '../config';
import LiveFacialCapture from '../components/LiveFacialCapture';

const COUNTRIES = [
  'India', 'Afghanistan', 'Australia', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brazil', 'Canada',
  'China', 'Egypt', 'France', 'Germany', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy',
  'Japan', 'Kenya', 'Kuwait', 'Malaysia', 'Maldives', 'Mauritius', 'Mexico', 'Myanmar',
  'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Oman', 'Pakistan',
  'Philippines', 'Qatar', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Thailand',
  'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Vietnam', 'Yemen', 'Zimbabwe'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry'
];

// Cities grouped by state/UT (district headquarters + major towns), so the City
// dropdown narrows down once a State is picked.
const CITIES_BY_STATE = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Vizianagaram', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur', 'Chittoor', 'Hindupur', 'Srikakulam', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram', 'Gudivada', 'Narasaraopet', 'Amaravati'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Aalo', 'Tezu', 'Changlang', 'Khonsa', 'Roing', 'Daporijo'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar', 'Goalpara', 'Barpeta', 'Dhubri', 'North Lakhimpur', 'Diphu', 'Golaghat', 'Kokrajhar', 'Mangaldoi', 'Nalbari', 'Hailakandi'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Bettiah', 'Motihari', 'Saharsa', 'Hajipur', 'Sasaram', 'Dehri', 'Siwan', 'Bihar Sharif', 'Buxar', 'Kishanganj', 'Jamalpur', 'Madhubani', 'Samastipur', 'Gopalganj'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Dhamtari', 'Mahasamund', 'Chirmiri', 'Kanker', 'Kawardha', 'Champa'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim', 'Cuncolim', 'Canacona'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad', 'Morbi', 'Mehsana', 'Bharuch', 'Navsari', 'Surendranagar', 'Porbandar', 'Godhra', 'Patan', 'Palanpur', 'Valsad', 'Vapi', 'Gandhidham', 'Veraval', 'Botad', 'Amreli', 'Deesa'],
  'Haryana': ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Kurukshetra', 'Kaithal', 'Rewari', 'Palwal', 'Fatehabad', 'Gohana', 'Narnaul', 'Jhajjar'],
  'Himachal Pradesh': ['Shimla', 'Solan', 'Dharamshala', 'Mandi', 'Kullu', 'Bilaspur', 'Hamirpur', 'Una', 'Chamba', 'Nahan', 'Palampur', 'Baddi', 'Kangra', 'Nalagarh', 'Sundarnagar'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Daltonganj', 'Chaibasa', 'Phusro', 'Dumka', 'Godda', 'Sahebganj', 'Jhumri Telaiya'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Raichur', 'Bidar', 'Hospet', 'Hassan', 'Udupi', 'Chikkamagaluru', 'Bagalkot', 'Chitradurga', 'Kolar', 'Mandya', 'Gadag', 'Ranebennuru', 'Gangavathi', 'Koppal', 'Puttur'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Kannur', 'Alappuzha', 'Palakkad', 'Malappuram', 'Kottayam', 'Kasaragod', 'Idukki', 'Pathanamthitta', 'Ernakulam', 'Munnar', 'Thodupuzha', 'Payyanur', 'Ponnani', 'Manjeri', 'Perinthalmanna', 'Chalakudy', 'Guruvayur', 'Attingal', 'Neyyattinkara'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Katni', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Damoh', 'Mandsaur', 'Khargone', 'Neemuch', 'Betul', 'Narmadapuram', 'Sehore', 'Morena', 'Balaghat'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Malegaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Jalgaon', 'Nanded', 'Satara', 'Ichalkaranji', 'Parbhani', 'Panvel', 'Yavatmal', 'Bhiwandi', 'Ulhasnagar', 'Vasai-Virar', 'Navi Mumbai', 'Thane', 'Wardha', 'Beed', 'Osmanabad', 'Gondia', 'Ratnagiri', 'Buldhana'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Tamenglong', 'Jiribam', 'Moreh'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Baghmara', 'Williamnagar', 'Nongpoh', 'Mairang'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Saiha', 'Mamit', 'Lawngtlai'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Mon', 'Peren', 'Kiphire'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh', 'Rayagada', 'Angul', 'Dhenkanal', 'Kendujhar', 'Koraput', 'Balangir', 'Paradeep', 'Talcher'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Muktsar', 'Barnala', 'Rajpura', 'Firozpur', 'Kapurthala', 'Faridkot', 'Sangrur', 'Zirakpur', 'Phagwara'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Kishangarh', 'Baran', 'Dhaulpur', 'Tonk', 'Beawar', 'Hanumangarh', 'Churu', 'Jhunjhunu', 'Nagaur', 'Barmer', 'Banswara', 'Jaisalmer', 'Sawai Madhopur', 'Chittorgarh', 'Dausa'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Rangpo', 'Jorethang', 'Singtam'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Nagercoil', 'Kanchipuram', 'Karur', 'Cuddalore', 'Kumbakonam', 'Hosur', 'Sivakasi', 'Namakkal', 'Tiruvannamalai', 'Pollachi', 'Rajapalayam', 'Pudukkottai', 'Neyveli', 'Nagapattinam', 'Karaikudi', 'Krishnagiri', 'Ooty'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Siddipet', 'Jagtial', 'Sangareddy', 'Medak', 'Kamareddy', 'Bhongir', 'Wanaparthy', 'Kothagudem'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Belonia', 'Khowai', 'Ambassa', 'Sabroom', 'Sonamura', 'Ranirbazar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida', 'Ghaziabad', 'Meerut', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Ayodhya', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Firozabad', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Mau', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sitapur', 'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sultanpur', 'Azamgarh', 'Bahraich', 'Basti', 'Unnao', 'Jaunpur', 'Ghazipur', 'Deoria', 'Greater Noida'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Nainital', 'Almora', 'Pithoragarh', 'Kotdwar', 'Ramnagar', 'Mussoorie', 'Pauri', 'Srinagar', 'Tehri', 'Bageshwar', 'Champawat', 'Uttarkashi'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Ranaghat', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Purulia', 'Cooch Behar', 'Darjeeling', 'Kalyani', 'Raiganj', 'Haldia', 'Alipurduar'],
  'Andaman and Nicobar Islands': ['Port Blair', 'Diglipur', 'Rangat', 'Mayabunder', 'Car Nicobar', 'Bamboo Flat'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Silvassa', 'Daman', 'Diu'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Karol Bagh', 'Saket', 'Connaught Place', 'Janakpuri', 'Pitampura', 'Vasant Kunj', 'Lajpat Nagar', 'Mayur Vihar', 'Shahdara', 'Narela', 'Najafgarh'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua', 'Udhampur', 'Rajouri', 'Poonch', 'Kupwara', 'Pulwama', 'Budgam', 'Bandipora', 'Ganderbal', 'Kulgam', 'Doda', 'Kishtwar', 'Samba', 'Ramban', 'Reasi'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Minicoy', 'Amini', 'Andrott'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Yanam', 'Mahe']
};

const QUALIFICATIONS = [
  'B.Sc (Life Sciences)', 'B.Pharm', 'D.Pharm', 'M.Pharm', 'M.Sc (Life Sciences)',
  'BAMS', 'BHMS', 'BUMS', 'BDS', 'MBBS', 'MD', 'BPT (Physiotherapy)',
  'B.Sc Nursing', 'BNYS', 'Other Medical / Life Science Degree'
];

const CURRENT_YEAR = new Date().getFullYear();
const PASSING_YEARS = Array.from({ length: CURRENT_YEAR + 1 - 1980 + 1 }, (_, i) => CURRENT_YEAR + 1 - i);

const OTHER_VALUE = '__other__';

const DOCUMENT_TYPES = [
  { key: 'photo', label: 'Passport-size Photograph', required: true, accept: 'image/*' },
  { key: 'idProof', label: 'Aadhaar Card / Government ID Copy', required: true, accept: '.pdf,image/*' },
  { key: 'pan', label: 'PAN Card Copy', required: false, accept: '.pdf,image/*' },
  { key: 'eduCert', label: 'Educational Qualification Certificate(s)', required: true, accept: '.pdf,image/*' }
];

// Reviewed on the Application Form step: link to the uploaded document + a confirmation checkbox.
const REVIEW_DOCUMENT_KEYS = ['photo', 'idProof', 'pan'];

const TERMS_AND_CONDITIONS_TEXT = `
TERMS AND CONDITIONS
GOVERNING STUDENT ADMISSION, ENROLLMENT, FEES AND COURSE PARTICIPATION
Effective Date: 21-Sep-2026
Version: 1.0

1. DEFINITIONS AND INTERPRETATION
In these Terms and Conditions ("Terms"), unless the context otherwise requires:
"Institute" / "Clinidea" / "We" / "Us" means Clinidea Education, its owners, partners, directors, employees, coordinators, mentors, trainers and authorised representatives, and includes its website, learning management system ("LMS"), and all associated online and offline touchpoints.
"Student" / "You" means the individual applying for, enrolling in, or admitted to any course, program or batch conducted by the Institute, and where the Student is a minor, includes the Student's parent/legal guardian who has co-signed the Admission Form.
"Course" means any program, certificate course, workshop, batch or training module offered by the Institute, whether delivered live online, in recorded/self-paced form, or in a blended format.
"Admission Form" means the official enrollment/registration form (physical or digital) executed by the Student, together with these Terms, the Fee Schedule and any annexures thereto.
"Fee" / "Course Fee" means the total consideration payable by the Student for a Course, as set out in the Fee Schedule annexed to the Admission Form, and includes the Registration Fee and all Installments.
"Registration Fee" / "Admission Fee" means the initial, non-refundable amount paid at the time of admission to confirm and reserve the Student's seat in a batch.
"LMS" means the Institute's learning management system, portal, app or any third-party platform through which course content, recordings, assessments or communication is delivered.
"Authorised Signatory" means a person specifically designated in writing by the Institute's management to bind the Institute contractually. For the avoidance of doubt, this does not include sales counsellors, coordinators, mentors or admission staff acting outside such written authorisation.
"Batch" means the specific group/cohort and schedule to which the Student is allotted at the time of admission.

2. ACCEPTANCE OF TERMS
2.1 By submitting the Admission Form, making any payment towards the Course Fee, accessing the LMS, or attending even a single session/orientation of any Course, the Student unconditionally and irrevocably accepts these Terms in their entirety. These Terms constitute a legally binding agreement between the Student and the Institute.
2.2 These Terms shall prevail over any advertisement, brochure, social media post, verbal statement, or any representation made by any sales counsellor, coordinator, mentor or other staff member of the Institute that is inconsistent with these Terms, unless such variation is confirmed in writing and signed by an Authorised Signatory of the Institute.
2.3 The Student confirms that they have read, understood and had a reasonable opportunity to seek clarification on these Terms and the Fee Schedule prior to making any payment, and that they are entering into this agreement voluntarily and with full understanding of its financial and academic obligations.

3. ELIGIBILITY FOR ADMISSION
3.1 Admission to a Course is subject to the eligibility criteria (educational qualification, age, documents, etc.) specified for that Course. The Institute reserves the right to verify all information and documents submitted by the Student and to cancel the admission, without refund of the Registration Fee, if any information or document is found to be false, forged or misleading.
3.2 Where the Student is below 18 years of age, the Admission Form and these Terms must additionally be signed by the Student's parent/legal guardian, who shall be jointly and severally liable, along with the Student, for all payment obligations under these Terms.

4. ADMISSION AND ENROLLMENT PROCESS
4.1 A seat in a Batch is confirmed only upon (a) submission of a duly completed and signed Admission Form, and (b) receipt of the Registration Fee (and, where applicable, the first Installment) by the Institute through an Approved Payment Mode (defined in Clause 5.5). No seat is reserved on the basis of an informal enquiry, verbal assurance, or WhatsApp/e-mail conversation alone.
4.2 The Institute reserves the right, at its sole discretion, to accept or reject any application for admission without assigning any reason, and to allot, re-allot, merge, split, postpone, or reschedule Batches based on operational requirements, provided that reasonable prior notice is given to affected Students.
4.3 Any discount, waiver, scholarship, or special payment plan offered to a Student is valid only if confirmed in writing by an Authorised Signatory and is not transferable to any other person or Course.

5. COURSE FEES AND PAYMENT TERMS
5.1 Total Fee and Fee Schedule
The total Course Fee, the number and amount of Installments, and the due date of each Installment shall be as set out in the Fee Schedule annexed to the Admission Form and/or communicated in writing (including by e-mail or through the LMS) at the time of admission. The Fee Schedule forms an integral part of these Terms.
5.2 Registration / Admission Fee
The Registration Fee is charged towards processing the application, reserving the Student's seat in a Batch, and administrative costs already incurred by the Institute. The Registration Fee is strictly non-refundable and non-transferable under any circumstances, including if the Student subsequently decides not to join the Course or is unable to attend.
5.3 Installments and Due Dates
All Installments are payable strictly on or before the due dates specified in the Fee Schedule, irrespective of the Student's attendance, satisfaction level, or personal circumstances.
The obligation to pay each Installment is independent of the number of classes actually attended by the Student and is not contingent upon continued attendance.
The Institute may, at its sole discretion and on written request, grant a one-time extension of up to 7 days for a specific Installment. Repeated requests for extension will not ordinarily be entertained and may be declined without reason.
5.4 Consequences of Delay or Default in Payment
Where any Installment remains unpaid beyond its due date, the Institute may, without further notice: (a) suspend the Student's access to live classes, recordings and the LMS; (b) withhold assessment results, mark-sheets and the Course completion certificate; and/or (c) charge a late-payment fee of 2% per month (or part thereof) on the overdue amount, or a flat late fee of ₹1,000, whichever is higher, as reasonable compensation for delay, and not as a penalty.
Continued non-payment for a period exceeding 15 days from the due date shall entitle the Institute to treat the enrollment as discontinued by the Student (see Clause 7) and to initiate recovery proceedings for the outstanding amount along with applicable interest and reasonable costs of recovery, through legal notice, arbitration/civil suit, or engagement of a recovery/collection agency, without prejudice to any other right or remedy available to the Institute.
A payment screenshot, UPI reference number, or any unverified proof shared by the Student shall not be treated as confirmation of payment until the amount is actually realised and reconciled in the Institute's bank account/payment gateway and reflected in the Institute's official records (CRM/LMS). The Student is responsible for retaining valid proof of payment and promptly reporting any discrepancy between payment made and the Institute's records within [7] days of the transaction.
5.5 Approved Payment Modes
Fees shall be paid only through the official payment channels notified by the Institute (registered bank account, payment gateway/link, or POS at the Institute's office), and a valid receipt/invoice shall be issued for each payment. Any payment made in cash, or into any account/person not officially authorised by the Institute in writing, is made entirely at the Student's own risk, and the Institute shall not be liable for any such payment or be bound to treat it as received.
5.6 Duplicate Entries / Reconciliation Errors
In the event of a bona fide error such as a duplicate payment entry, wrong amount recorded, or a payment not reflecting in the Student's CRM/LMS account despite actual receipt, the Student must notify the Institute in writing (with proof) within [7] days of noticing the discrepancy. The Institute shall investigate and rectify genuine errors within a reasonable time, and any excess amount found to be paid shall be adjusted against future dues or refunded, at the Institute's discretion, after due verification.
5.7 Chargebacks and Payment Reversals
The Student agrees not to initiate any chargeback, payment reversal, or dispute with their bank/card issuer/payment app in respect of any amount validly due and payable under these Terms and for which the Institute has provided or made available the corresponding Course access. An unauthorised or bad-faith chargeback shall be treated as a default in payment under Clause 5.4, in addition to any other remedy available to the Institute including recovery of the reversed amount, bank/gateway charges, and legal costs.

6. REFUND AND CANCELLATION POLICY
6.1 Cooling-Off Period
A Student who wishes to withdraw within 3 calendar days of the date of admission and before attending more than 1 live session/orientation may do so by submitting a written cancellation request. In such a case, the Registration Fee (₹10,000) shall remain non-refundable, but any Installment(s) already paid (less a processing charge of 5% or ₹2,000, whichever is higher, towards administrative and resource costs already incurred) shall be refunded within 15 working days.
6.2 Cancellation After the Cooling-Off Period
Once the cooling-off period under Clause 6.1 has lapsed, or once the Student has attended more than 1 session, no refund of any amount already paid (Registration Fee or Installments) shall be made, whether the withdrawal is on account of personal, financial, medical or any other reason, save where the withdrawal is directly attributable to a material and continuing failure of the Institute to deliver the Course as described (see Clause 6.4).
6.3 No Refund for Dissatisfaction Post-Delivery
Since the Course involves access to curated content, mentor time, batch allocation and administrative resources committed in advance, no refund shall be payable merely on the ground that the Student is dissatisfied with the pace, style, or perceived quality of teaching, provided the Course is being delivered substantially in accordance with the published curriculum. The Student's specific concerns should first be raised through the Grievance Redressal process under Clause 17.
6.4 Cancellation/Refund on Account of the Institute
If the Institute permanently discontinues a Course after commencement for reasons within its control, without offering an equivalent alternative Batch, mentor, or make-up sessions, the Student shall be entitled to a pro-rata refund of fees paid for the portion of the Course not delivered, calculated on a straight-line basis over the total course duration, within 30 days of such discontinuation.
6.5 No Cash Refunds
All permissible refunds under this Clause 6 shall be made only to the original source/bank account from which payment was received, by way of bank transfer, and not in cash.

7. DISCONTINUATION / WITHDRAWAL BY THE STUDENT
7.1 Written Withdrawal Required
Mere non-attendance, silence, or ceasing communication with the mentor/coordinator does NOT constitute withdrawal from the Course. A Student shall be deemed enrolled, and all payment obligations under the Fee Schedule shall continue to accrue and remain due, until the Student submits a formal written withdrawal request (by e-mail to the Institute's official admissions e-mail ID) and the Institute acknowledges the same in writing.
7.2 Fee Liability on Discontinuation
If a Student discontinues the Course after enrollment, for any reason whatsoever (including change of mind, personal or financial reasons, dissatisfaction, or inability to continue), the Student shall remain liable to pay 50% (half) of the Total Course Fee as per the Fee Schedule ("Discontinuation Charge"), regardless of the number of Installments actually paid or classes attended as on the date of discontinuation, unless a lesser amount is agreed in writing by an Authorised Signatory.
The Discontinuation Charge is recorded here as a genuine, pre-estimated measure of the loss and administrative cost reasonably incurred by the Institute on account of early withdrawal (seat blocking, batch planning, mentor allocation, material/LMS access already provisioned), and not as a penalty for breach.
Where a Student discontinues the Course and fails to pay the Discontinuation Charge within 15 days of the written withdrawal request (or within 15 days of the Institute treating the enrollment as discontinued under Clause 5.4), the Student shall face legal consequences, including recovery proceedings through a legal notice, arbitration or civil suit, and/or engagement of a recovery/collection agency, and shall be liable for the outstanding amount together with applicable interest and reasonable costs of recovery, without prejudice to any other right or remedy available to the Institute.
For the avoidance of doubt, once the full Course Fee has actually been collected by the Institute prior to discontinuation, no part of it becomes refundable by virtue of discontinuation (see Clause 6.2), and this Clause 7.2 applies only to amounts that would otherwise still have fallen due.
7.3 Batch Change, Pause or Transfer Requests
Any request to pause enrollment, shift to a future/different Batch, or transfer the seat to another individual is not a matter of right and shall be considered only on a written request, subject to seat availability and payment of an administrative fee of ₹2,000. Approval of any such request lies at the sole discretion of the Institute and does not, by itself, waive any Fee already due. An approved batch transfer/pause does not extend the overall validity of LMS access beyond 3 months from the original Course end date unless separately agreed in writing.
7.4 Effect on LMS Access
On acceptance of a withdrawal request, or on default under Clause 5.4, the Institute shall be entitled to immediately suspend or terminate the Student's access to the LMS, live classes and recordings. No further content shall be made available, and no certificate shall be issued, until all outstanding dues (including any Discontinuation Charge) have been cleared in full.

8. ATTENDANCE, ASSESSMENTS AND CERTIFICATION
8.1 The Student is required to maintain a minimum attendance of 75% of the scheduled live sessions (or complete the equivalent recorded sessions) and to complete all mandatory assignments/assessments prescribed for the Course.
8.2 A Course completion certificate shall be issued only where the Student has: (a) satisfied the minimum attendance requirement under Clause 8.1; (b) completed all mandatory assessments to the satisfaction of the Institute; and (c) cleared the entire Course Fee, including any late fee or Discontinuation Charge payable. Non-fulfilment of any of these conditions shall entitle the Institute to withhold the certificate, notwithstanding completion of the Course duration.
8.3 Unless expressly stated otherwise in the Course description, the certificate issued by the Institute is an internal certificate of training/participation and does not constitute a government-recognised degree, diploma, or statutory professional qualification, nor a guarantee of employment, licensure, or industry accreditation. The Student acknowledges having understood the specific nature and recognition (if any) of the certificate for the Course enrolled in, prior to admission.
8.4 Any request for correction of a factual error in the name/details printed on an issued certificate must be raised in writing within [30] days of issuance; re-issuance thereafter may attract an administrative charge.

9. COURSE CONTENT, SCHEDULE AND DELIVERY
9.1 The Institute shall make reasonable efforts to deliver the Course substantially in accordance with the published curriculum and schedule. However, the Institute reserves the right to modify the curriculum, add/remove topics, change the mentor/trainer, or alter the schedule of any session, where reasonably necessary for academic, operational or logistical reasons, including mentor unavailability, low enrolment, or force majeure events, provided that the overall learning outcomes of the Course are not materially reduced.
9.2 Where a live session cannot be conducted as scheduled due to a technical issue, platform failure, or mentor unavailability, the Institute shall reschedule the session or provide a recorded session/alternative arrangement within a reasonable time, and such rescheduling shall not, by itself, entitle the Student to any fee refund or reduction.
9.3 The Student acknowledges the distinction between recorded/self-paced content and live mentor-led sessions, and between any simulator/practice software used for training purposes and actual industry-grade software, and agrees that access to a simulator or training environment does not represent, and should not be understood as, certification on any specific commercial or industry software product unless expressly stated.

10. STUDENT CODE OF CONDUCT
Attend sessions punctually and engage respectfully with mentors, coordinators, and fellow students, without any form of harassment, abuse, or discriminatory behaviour.
Refrain from any inappropriate, abusive, or unauthorised communication with mentors/trainers outside of official channels, and immediately report any such conduct by staff to the Institute's grievance contact.
Not misuse, disrupt, or attempt unauthorised access to the LMS, any third-party software, or the Institute's systems.
The Institute reserves the right to suspend or terminate, with immediate effect and without refund of any fee paid, the enrollment of any Student found to be in serious or repeated breach of this Code of Conduct, after providing the Student a reasonable opportunity to respond.

11. LMS ACCESS, INTELLECTUAL PROPERTY AND CONFIDENTIALITY
11.1 Personal, Non-Transferable Access
LMS login credentials are issued to the Student personally and must not be shared with, sold to, or used by any other person. The Student is fully responsible for maintaining the confidentiality of their credentials and for all activity conducted through their account, whether or not authorised by the Student.
11.2 Prohibited Actions
Downloading, recording, screen-capturing, printing, or otherwise reproducing recorded sessions, presentations, question banks, assignments, or any other course material, except where expressly permitted in writing for personal study.
Circulating, forwarding, uploading, or reselling any course material, recordings, or LMS content on WhatsApp, Telegram, YouTube, file-sharing platforms, or any other medium, whether free of charge or for consideration.
Sharing database, software, or tool credentials provided for training purposes with any unauthorised person, or permitting any unauthorised person to access the same.
11.3 Intellectual Property
All course content, curriculum, presentations, recordings, question banks, branding, and material made available through the LMS or otherwise are and shall remain the exclusive intellectual property of the Institute (or its licensors). Enrollment grants the Student only a limited, non-exclusive, non-transferable licence to access such material for personal learning during the currency of the Course, and no ownership or further right is transferred.
11.4 Consequences of Breach
Any breach of this Clause 11 shall entitle the Institute, without prejudice to any other remedy, to immediately suspend or terminate the Student's LMS access and enrollment without refund, and to pursue civil and/or criminal remedies for breach of confidentiality, copyright infringement, or unauthorised access, including recovery of damages and costs, against the Student and any third party knowingly involved.
11.5 Duration of Access
LMS access shall be provided for the duration of the 6-month Course plus 3 months thereafter, and shall be automatically suspended immediately upon discontinuation, withdrawal, or default in payment by the Student, and in any event upon expiry of such period, regardless of whether the Student has reviewed all content.

12. USE OF THIRD-PARTY SOFTWARE, TOOLS AND DATABASES
12.1 Where the Course involves access to any third-party software, tool, database, or simulator, such access is provided solely for training purposes, strictly in accordance with the terms of the Institute's licence/permission with the relevant provider, and only for the duration approved by the Institute.
12.2 The Student shall not use such access for any purpose other than bona fide training, shall not share credentials with any unauthorised person, and shall not extract, copy, or use any data accessed thereby for any commercial or personal purpose outside the Course.
12.3 The Institute shall revoke all such third-party access promptly upon the Student's discontinuation, completion of the Course, or default in payment. The Student shall be personally liable for any loss, penalty, or third-party claim arising from their unauthorised use or sharing of such access.

13. PLACEMENT ASSISTANCE — DISCLAIMER
13.1 Where the Course includes a placement assistance component, the Institute shall provide reasonable support such as resume guidance, interview preparation, and introductions to prospective employers/hiring partners. This constitutes placement ASSISTANCE only and is not, and shall not be construed as, a guarantee, warranty, or assurance of a job offer, a minimum salary/package, or employment of any kind.
13.2 Any reference to placement statistics, average packages, or hiring partners in promotional material is indicative of past outcomes for illustrative purposes only and is not a representation as to the outcome for any individual Student, whose employability depends on multiple factors including their own performance, skills, and market conditions outside the Institute's control.
13.3 The Student is responsible for actively applying to and appearing for interview opportunities shared by the Institute, within their stated eligibility. Non-response to, or rejection of, a shared opportunity by the Student shall not entitle the Student to claim non-performance of placement assistance by the Institute. The Student agrees to promptly inform the Institute upon securing any placement (whether through the Institute or independently) to enable accurate record-keeping.
13.4 Clarification on "100% Assured Placement Support": Where the Institute's promotional material refers to "100% Assured Placement Support" or similar language, this expression means that the Institute shall continue to provide the placement assistance described in Clause 13.1 (resume support, interview preparation, and sharing of suitable job opportunities) on an ongoing basis until the Student secures employment or the Student discontinues engaging with the placement process, whichever is earlier. It is expressly clarified that this expression does NOT mean, warrant, or guarantee that any specific Student will receive a job offer, a minimum salary/package, or employment within any particular timeframe, employment outcomes being dependent on factors such as the Student's own performance, market conditions, and the hiring decisions of third-party employers which are outside the Institute's control.

14. MARKETING AND PROMOTIONAL MATERIAL
14.1 Advertisements, brochures, website content and social media posts are prepared for general informational and promotional purposes and are subject to change. In the event of any inconsistency between such promotional material and these Terms (including the specific Course description shared at the time of admission), these Terms and the specific written Course description shall prevail.
14.2 No sales counsellor, coordinator, or staff member is authorised to make any binding commitment, discount, or guarantee (including as to placement, certification, or outcomes) on behalf of the Institute beyond what is expressly stated in these Terms or confirmed separately in writing by an Authorised Signatory. The Student is encouraged to seek written confirmation of any specific representation made to them before making payment.

15. OFFICIAL COMMUNICATION
15.1 All binding communication, notices, approvals, or variations to these Terms shall be made only through the Institute's official e-mail ID / LMS notification / written letter. Conversations on WhatsApp, phone calls, or verbal discussions with mentors, coordinators, or sales staff are for convenience only and do not, by themselves, create a binding obligation on the Institute unless confirmed in writing by an Authorised Signatory.
15.2 The Student is responsible for keeping the Institute updated with their current contact e-mail and phone number, and for regularly checking official communication channels for fee reminders, schedule changes, and other notices.

16. DATA PRIVACY AND PROTECTION
16.1 The Institute collects and processes the Student's personal data (including name, contact details, educational records, payment information, and, where applicable, identity documents) for the purposes of admission processing, fee collection, academic administration, certification, and placement assistance, in accordance with the Digital Personal Data Protection Act, 2023 and other applicable law.
16.2 The Institute shall take reasonable technical and organisational measures to protect the Student's personal data against unauthorised access, and shall restrict access to such data internally to staff who require it for the purposes stated above.
16.3 The Institute shall not sell or share the Student's personal data with any unrelated third party for commercial purposes without the Student's consent, save that data may be shared with genuine hiring/placement partners for placement assistance, payment processors for fee collection, and as required by law or a competent authority.
16.4 The Student agrees not to publicly circulate screenshots of private communications, payment details, or personal information relating to any other Student, mentor, or staff member of the Institute obtained in the course of the program.

17. GRIEVANCE REDRESSAL
17.1 Any complaint or grievance relating to academics, mentor conduct, fees, or any other matter shall first be raised in writing to the Institute's designated grievance e-mail ID: admin@clinidea.in. The Institute shall acknowledge the complaint within 3 working days and endeavour to resolve it within 15 working days.
17.2 The Student agrees to exhaust this internal grievance process in good faith before taking any dispute to a public forum (including social media or review platforms) or initiating legal proceedings, save where the matter involves a genuine safety or statutory concern requiring immediate external escalation.

18. FORCE MAJEURE
Neither party shall be liable for any delay or failure in performance of its obligations under these Terms (including delivery of scheduled sessions) to the extent such delay or failure is caused by circumstances beyond its reasonable control, including natural disaster, pandemic, government action/lockdown, internet or power outage, strike, or failure of a third-party platform. The Institute shall make reasonable efforts to reschedule affected sessions once such circumstances cease.

19. LIMITATION OF LIABILITY
19.1 The Institute's total liability to the Student under or in connection with these Terms and the Course, whether in contract, tort or otherwise, shall not exceed the total Course Fee actually paid by the Student for the specific Course giving rise to the claim.
19.2 The Institute shall not be liable for any indirect, incidental, or consequential loss, including loss of income, business opportunity, or anticipated placement outcome, arising from the Student's participation in, or discontinuation of, the Course.

20. FAIR COMMENT AND MISUSE OF INFORMATION
20.1 Nothing in these Terms restricts the Student's right to give honest, good-faith feedback or file a genuine complaint with a consumer forum or regulatory authority. However, the Student agrees not to knowingly publish false or misleading statements about the Institute, its mentors, or staff on any public platform, and agrees to first use the Grievance Redressal process under Clause 17 for fee, refund, or service-related concerns.
20.2 The Institute likewise agrees not to publicly disclose any Student's personal or fee-payment information in connection with any dispute, save as required for legitimate legal recovery proceedings.

21. GOVERNING LAW, DISPUTE RESOLUTION AND JURISDICTION
21.1 These Terms shall be governed by and construed in accordance with the laws of India.
21.2 Any dispute arising out of or in connection with these Terms, the Admission Form, or the Course, which is not resolved through the Grievance Redressal process under Clause 17, shall be referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, by a sole arbitrator appointed by the Institute, with the seat and venue of arbitration at Jabalpur, Madhya Pradesh, and the proceedings shall be conducted in English. This shall not preclude either party from approaching the appropriate consumer forum where the dispute qualifies as a consumer dispute under applicable law.
21.3 Subject to Clause 21.2, the courts at Jabalpur, Madhya Pradesh alone shall have exclusive jurisdiction over any matter arising out of these Terms.

22. GENERAL PROVISIONS
22.1 Amendment: The Institute may revise these Terms from time to time for future admissions by publishing the updated version on its website with a revised effective date. For a Student already admitted, the Terms in force at the time of that Student's admission shall continue to apply, unless a change is required by law or is more beneficial to the Student.
22.2 Entire Agreement: The Admission Form, these Terms, and the annexed Fee Schedule together constitute the entire agreement between the Student and the Institute in relation to the Course, and supersede all prior discussions, negotiations, and representations, whether oral or written.
22.3 Severability: If any clause of these Terms is held invalid or unenforceable by a court or tribunal of competent jurisdiction, the remaining clauses shall continue in full force and effect, and the invalid clause shall be replaced with a valid clause that most closely reflects its original commercial intent.
22.4 No Waiver: No failure or delay by the Institute in exercising any right under these Terms shall operate as a waiver of that right.
22.5 Assignment: The Student may not assign or transfer their rights or obligations under these Terms to any other person without the prior written consent of the Institute.

23. STUDENT / GUARDIAN DECLARATION
I/We confirm that I/we have read and understood the above Terms and Conditions in their entirety, including the fee, refund, discontinuation, LMS-usage, and placement-related clauses, and I/we voluntarily agree to be bound by them. I/we understand that this is a binding agreement and that the obligation to pay the agreed Course Fee, as per the schedule, survives any decision on my/our part to discontinue the Course.
`.trim();

// Mirrors the backend's computeFeeBreakdown() for a live preview before payment.
// The server always recomputes this fresh at order-creation/verification time.
// The base course fee is identical for both modes; installment adds a separate
// processing fee (paid once, with the first installment) that coupons never discount.
function computeLocalBreakdown(course, paymentMode, discountPercent) {
  if (!course) return null;
  const plan = course.paymentPlan || {};
  const baseFee = Number(course.fees) || 0;
  const installmentProcessingFee = Number(plan.installmentAdditionalFee) || 0;
  const configuredInstallments = Array.isArray(plan.installments) && plan.installments.length
    ? plan.installments
    : [{ amount: baseFee, daysAfter: 0 }];

  const ratio = 1 - (discountPercent || 0) / 100;
  const discount = discountPercent || 0;

  if (paymentMode !== 'installment') {
    const discountedBaseTotal = Math.round(baseFee * ratio * 100) / 100;
    return {
      baseFee, discountPercent: discount, installmentProcessingFee: 0,
      discountedBaseTotal, discountedTotal: discountedBaseTotal, amountNow: discountedBaseTotal,
      installmentsSchedule: []
    };
  }

  // The processing fee is split evenly across every installment (not just the first),
  // so each due payment shows its own fee share.
  const n = configuredInstallments.length;
  const baseFeeShare = Math.floor(installmentProcessingFee / n);
  const feeShares = new Array(n).fill(baseFeeShare);
  feeShares[n - 1] += installmentProcessingFee - baseFeeShare * n;

  const installmentsSchedule = configuredInstallments.map((i, idx) => ({
    amount: Math.round(Number(i.amount || 0) * ratio * 100) / 100,
    feeAmount: feeShares[idx],
    daysAfter: Number(i.daysAfter || 0)
  }));
  const discountedBaseTotal = Math.round(installmentsSchedule.reduce((sum, i) => sum + i.amount, 0) * 100) / 100;
  const first = installmentsSchedule[0];
  const amountNow = Math.round(((first?.amount || 0) + (first?.feeAmount || 0)) * 100) / 100;
  const discountedTotal = Math.round((discountedBaseTotal + installmentProcessingFee) * 100) / 100;

  return { baseFee, discountPercent: discount, installmentProcessingFee, discountedBaseTotal, discountedTotal, amountNow, installmentsSchedule };
}

const Register = () => {
  const navigate = useNavigate();

  // Step 1: Student Admission Form - Applicant Details
  const [applicant, setApplicant] = useState({
    fullName: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    gender: '',
    alternateNumber: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    qualification: '',
    institution: '',
    yearOfPassing: '',
    govtIdNumber: '',
    panNumber: ''
  });
  const [cityMode, setCityMode] = useState('select');
  const [stateMode, setStateMode] = useState('select');
  const [qualMode, setQualMode] = useState('select');
  const [admissionId, setAdmissionId] = useState(null);
  const [applicantError, setApplicantError] = useState(null);
  const [savingApplicant, setSavingApplicant] = useState(false);

  // Resume: for applicants who already submitted the Application Form (Step 3) but
  // didn't complete payment — skip straight to Payment instead of redoing everything.
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [resumeEmail, setResumeEmail] = useState('');
  const [resumePassword, setResumePassword] = useState('');
  const [resumeError, setResumeError] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Step 2: Course + Password + Payment
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    course: '',
    city: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);

  // Step 2: Documents
  const [docChecked, setDocChecked] = useState({});
  const [documents, setDocuments] = useState({});
  const [docUploading, setDocUploading] = useState({});
  const [docsError, setDocsError] = useState(null);
  const [savingDocs, setSavingDocs] = useState(false);

  // Step 3: Application Form Review, Terms & Conditions, Facial Verification, Digital Signature
  const [docConfirmed, setDocConfirmed] = useState({});
  const [termsReadConfirmed, setTermsReadConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [facialPhotoUrl, setFacialPhotoUrl] = useState(null);
  const [facialUploading, setFacialUploading] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [signatureUploading, setSignatureUploading] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formError, setFormError] = useState(null);

  // Step 4: Payment
  const [paymentMode, setPaymentMode] = useState('onetime');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCourse = params.get('course');
    if (initialCourse) {
      setFormData(prev => ({ ...prev, course: initialCourse }));
    }
  }, []);

  React.useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(list => setCourseOptions(Array.isArray(list) ? list : []))
      .catch(() => setCourseOptions([]));
  }, []);

  React.useEffect(() => {
    if (!formData.course || !courseOptions.length) {
      setSelectedCourse(null);
      return;
    }
    setSelectedCourse(courseOptions.find(c => c.name === formData.course) || null);
  }, [formData.course, courseOptions]);

  const handleCourseSelect = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, course: value }));
    // Persist immediately so the choice survives even if the applicant reloads or
    // resumes later — matters most here since this can be picked as late as Step 4.
    if (admissionId && value) {
      fetch(`${BASE_URL}/api/admission/${admissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: value })
      }).catch(() => {});
    }
  };

  const feeBreakdown = React.useMemo(
    () => computeLocalBreakdown(selectedCourse, paymentMode, couponApplied?.discountPercent),
    [selectedCourse, paymentMode, couponApplied]
  );

  const handleApplicantChange = (e) => {
    setApplicant({ ...applicant, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setApplicant(prev => ({ ...prev, country: value, state: '', city: '' }));
    if (value === 'India') {
      setStateMode('select');
      setCityMode('select');
    } else {
      // No state/city reference data outside India — fall back to free text.
      setStateMode('custom');
      setCityMode('custom');
    }
  };

  const handleStateSelect = (e) => {
    const value = e.target.value;
    const citiesForState = CITIES_BY_STATE[value] || [];
    setApplicant(prev => ({ ...prev, state: value, city: '' }));
    setCityMode(citiesForState.length ? 'select' : 'custom');
  };

  const handleCitySelect = (e) => {
    const value = e.target.value;
    if (value === OTHER_VALUE) {
      setCityMode('custom');
      setApplicant(prev => ({ ...prev, city: '' }));
    } else {
      setApplicant(prev => ({ ...prev, city: value }));
    }
  };

  const handleQualSelect = (e) => {
    const value = e.target.value;
    if (value === OTHER_VALUE) {
      setQualMode('custom');
      setApplicant(prev => ({ ...prev, qualification: '' }));
    } else {
      setApplicant(prev => ({ ...prev, qualification: value }));
    }
  };

  const handleSaveApplicantDetails = async (e) => {
    e.preventDefault();
    setApplicantError(null);

    if (applicant.mobileNumber.replace(/\D/g, '').length < 10) {
      setApplicantError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSavingApplicant(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicant)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save applicant details.');

      setAdmissionId(data.admission.id);
      // Carry known details forward to Step 2
      setFormData(prev => ({
        ...prev,
        full_name: applicant.fullName,
        phone: applicant.mobileNumber,
        email: applicant.email,
        city: applicant.city
      }));
      setStep(2);
      window.scrollTo(0, 0);
    } catch (err) {
      setApplicantError(err.message);
    } finally {
      setSavingApplicant(false);
    }
  };

  const handleResumeToPayment = async (e) => {
    e.preventDefault();
    setResumeError(null);
    setResumeLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admission/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resumeEmail, password: resumePassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not resume your application.');

      // Already fully registered & paid — skip Payment entirely and log them straight
      // into their student portfolio instead of resuming an already-completed flow.
      if (data.alreadyRegistered) {
        localStorage.setItem('userToken', data.token);
        navigate('/student/portfolio');
        return;
      }

      const admission = data.admission;
      setAdmissionId(admission.id);
      setApplicant(prev => ({
        ...prev,
        fullName: admission.fullName || '',
        dateOfBirth: admission.dateOfBirth || '',
        mobileNumber: admission.mobileNumber || '',
        email: admission.email || '',
        gender: admission.gender || '',
        alternateNumber: admission.alternateNumber || '',
        address: admission.address || '',
        city: admission.city || '',
        state: admission.state || '',
        country: admission.country || 'India',
        pincode: admission.pincode || '',
        qualification: admission.qualification || '',
        institution: admission.institution || '',
        yearOfPassing: admission.yearOfPassing || '',
        govtIdNumber: admission.govtIdNumber || '',
        panNumber: admission.panNumber || ''
      }));
      setDocuments(admission.documents || {});
      setFormData(prev => ({
        ...prev,
        full_name: admission.fullName || '',
        phone: admission.mobileNumber || '',
        email: admission.email || '',
        city: admission.city || '',
        course: admission.course || '',
        password: resumePassword
      }));
      setStep(4);
      window.scrollTo(0, 0);
    } catch (err) {
      setResumeError(err.message);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleDocCheckToggle = (key) => {
    setDocChecked(prev => ({ ...prev, [key]: !prev[key] }));
    if (docChecked[key]) {
      // Unchecking clears any uploaded file for that document
      setDocuments(prev => { const next = { ...prev }; delete next[key]; return next; });
    }
  };

  const handleDocFileChange = async (key, file) => {
    if (!file) return;
    setDocsError(null);
    setDocUploading(prev => ({ ...prev, [key]: true }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${BASE_URL}/api/admission/upload-document`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setDocuments(prev => ({ ...prev, [key]: data.url }));
    } catch (err) {
      setDocsError(`${DOCUMENT_TYPES.find(d => d.key === key)?.label}: ${err.message}`);
      setDocChecked(prev => ({ ...prev, [key]: false }));
    } finally {
      setDocUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleContinueToApplicationForm = async (e) => {
    e.preventDefault();
    setDocsError(null);

    if (!formData.course) {
      setDocsError('Please select a course to continue.');
      return;
    }

    if (formData.password.length < 6) {
      setDocsError('Password must be at least 6 characters.');
      return;
    }

    const missing = DOCUMENT_TYPES.filter(d => d.required && (!docChecked[d.key] || !documents[d.key]));
    if (missing.length) {
      setDocsError(`Please tick and upload: ${missing.map(d => d.label).join(', ')}`);
      return;
    }

    setSavingDocs(true);
    try {
      if (admissionId) {
        await fetch(`${BASE_URL}/api/admission/${admissionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documents, status: 'documents_submitted', password: formData.password, course: formData.course })
        });
      }
      setStep(3);
      window.scrollTo(0, 0);
    } catch (err) {
      setDocsError('Failed to save documents. Please try again.');
    } finally {
      setSavingDocs(false);
    }
  };

  const handleFacialCapture = async (blob) => {
    setFormError(null);
    setFacialUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', blob, 'facial-verification.jpg');
      const res = await fetch(`${BASE_URL}/api/admission/upload-document`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFacialPhotoUrl(data.url);
    } catch (err) {
      setFormError('Facial verification photo upload failed: ' + err.message);
    } finally {
      setFacialUploading(false);
    }
  };

  const handleSignatureFileChange = async (file) => {
    if (!file) return;
    setFormError(null);
    setSignatureUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${BASE_URL}/api/admission/upload-document`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSignatureUrl(data.url);
    } catch (err) {
      setFormError('Signature upload failed: ' + err.message);
    } finally {
      setSignatureUploading(false);
    }
  };

  const handleSubmitApplicationForm = async () => {
    setFormError(null);

    const unconfirmedDocs = REVIEW_DOCUMENT_KEYS.filter(key => documents[key] && !docConfirmed[key]);
    if (unconfirmedDocs.length) {
      setFormError('Please confirm each uploaded document above.');
      return;
    }
    if (!termsReadConfirmed || !termsAgreed) {
      setFormError('Please confirm you have read and agree to the Terms and Conditions.');
      return;
    }
    if (!facialPhotoUrl) {
      setFormError('Please complete live facial verification.');
      return;
    }
    if (!signatureUrl) {
      setFormError('Please upload your digital signature.');
      return;
    }

    setSubmittingForm(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admission/${admissionId}/generate-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termsReadConfirmed, termsAgreed, facialPhotoUrl, signatureUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit the application form.');

      // Auto-download the generated PDF for the student's own records.
      const fileRes = await fetch(`${BASE_URL}${data.pdfUrl}`);
      const blob = await fileRes.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${applicant.fullName.replace(/\s+/g, '_')}_Application_Form.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setStep(4);
      window.scrollTo(0, 0);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setCouponChecking(true);
    try {
      const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid coupon');
      setCouponApplied({ code: data.code, discountPercent: data.discountPercent });
    } catch (err) {
      setCouponApplied(null);
      setCouponError(err.message);
    } finally {
      setCouponChecking(false);
    }
  };

  const handlePayNow = async () => {
    setError(null);
    if (!formData.course) {
      setError('Please select a course.');
      return;
    }

    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setError("Failed to load Razorpay. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order (server recomputes the fee breakdown fresh — never trusts the client amount)
      const res = await fetch(`${BASE_URL}/api/auth/course-fee-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, admissionId, paymentMode, couponCode: couponApplied?.code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Clinidea Education",
        description: `${formData.course} - ${paymentMode === 'installment' ? 'Installment 1' : 'Full Payment'}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-course-fee`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userDetails: data.userDetails
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);

            if (verifyData.token) {
              localStorage.setItem('userToken', verifyData.token);
            }

            setPaymentSummary(verifyData.summary);
            setSuccess(true);
            setStep(5);
            window.scrollTo(0,0);
          } catch (err) {
            setError(err.message);
          }
        },
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setError("Payment failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const STEP_TITLES = {
    1: { title: 'Student Admission Form', subtitle: 'Section A — Applicant Details' },
    2: { title: 'Course Details & Documents', subtitle: 'Section E — Documents Submitted' },
    3: { title: 'Application Form & Terms', subtitle: 'Review, verify, and sign your application' },
    4: { title: 'Complete Your Payment', subtitle: 'Choose a payment plan to confirm your seat' }
  };
  const stepTitle = success ? 'Registration Successful!' : STEP_TITLES[step].title;
  const stepSubtitle = success ? 'Welcome to Clinidea Education.' : STEP_TITLES[step].subtitle;

  return (
    <div className="reg-screen">
      <Helmet>
        <title>Student Registration | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <style>{`
        .reg-screen { min-height: 100vh; width: 100%; background: var(--color-bg-light); padding-top: 116px; }
        .reg-topbar {
          width: 100%;
          background: var(--theme-gradient);
          padding: 1.1rem clamp(1.25rem, 5vw, 4rem);
          color: #fff;
        }
        .reg-heading { max-width: 1200px; margin: 0 auto; }
        .reg-heading h1 { font-weight: 700; font-size: clamp(1.15rem, 1.8vw, 1.4rem); margin-bottom: 2px; }
        .reg-heading p { opacity: 0.85; margin: 0; font-size: 0.85rem; }
        @media (max-width: 991px) {
          .reg-screen { padding-top: 70px; }
        }

        .reg-steps { display: flex; align-items: center; gap: 6px; margin-top: 0.85rem; }
        .reg-step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .reg-step-circle {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.75rem;
          background: rgba(255,255,255,0.16); color: #fff;
          border: 2px solid rgba(255,255,255,0.35);
        }
        .reg-step.is-active .reg-step-circle, .reg-step.is-done .reg-step-circle { background: #fff; color: var(--color-secondary); border-color: #fff; }
        .reg-step-label { font-size: 0.68rem; font-weight: 700; opacity: 0.85; white-space: nowrap; }
        .reg-step-line { width: 44px; height: 2px; background: rgba(255,255,255,0.3); margin-bottom: 15px; }
        .reg-step-line.is-done { background: #fff; }

        .reg-body { max-width: 1200px; margin: 0 auto; padding: 2rem clamp(1.25rem, 5vw, 4rem) 4rem; }
        .reg-card { background: #fff; border: 1px solid var(--color-border); border-radius: 20px; box-shadow: var(--box-shadow-premium); padding: clamp(1.5rem, 3vw, 2.75rem); }

        .reg-section + .reg-section { margin-top: 2rem; }
        .reg-section-title {
          display: flex; align-items: center; gap: 10px;
          font-weight: 800; color: var(--color-primary); font-size: 1.05rem;
          margin: 0 0 1.15rem; padding-bottom: 0.6rem;
          border-bottom: 2px solid var(--color-gray-light);
        }
        .reg-section-title i { color: var(--color-secondary); }

        .reg-label { font-weight: 600; font-size: 0.87rem; color: var(--color-text-dark); margin-bottom: 0.4rem; display: block; }
        .reg-input, .reg-select {
          width: 100%; padding: 0.7rem 1rem;
          background: var(--color-bg-light);
          border: 1.5px solid var(--color-border);
          border-radius: 10px; font-size: 0.95rem; color: var(--color-text-dark);
          transition: var(--transition-smooth);
        }
        .reg-input:focus, .reg-select:focus {
          outline: none; border-color: var(--color-secondary); background: #fff;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
        }
        .reg-phone .form-control {
          width: 100% !important; height: 45px !important; font-size: 0.95rem !important;
          background: var(--color-bg-light) !important; border: 1.5px solid var(--color-border) !important;
          border-radius: 10px !important; padding-left: 48px !important; color: var(--color-text-dark) !important;
        }
        .reg-phone .form-control:focus { border-color: var(--color-secondary) !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12) !important; }
        .reg-phone .flag-dropdown { border-radius: 10px 0 0 10px !important; border: 1.5px solid var(--color-border) !important; background: var(--color-bg-light) !important; }

        .reg-gender-pill { display: flex; align-items: center; gap: 8px; padding: 0.6rem 1rem; border-radius: 10px; background: var(--color-bg-light); border: 1.5px solid var(--color-border); cursor: pointer; font-weight: 600; font-size: 0.9rem; color: var(--color-text-dark); transition: var(--transition-smooth); }
        .reg-gender-pill.is-active { background: rgba(79, 70, 229, 0.08); border-color: var(--color-secondary); color: var(--color-secondary); }
        .reg-gender-pill input { accent-color: var(--color-secondary); }

        .reg-link-btn { background: none; border: none; padding: 0; font-size: 0.8rem; font-weight: 700; color: var(--color-secondary); margin-top: 6px; }
        .reg-link-btn:hover { text-decoration: underline; }

        .reg-submit-btn {
          width: 100%; padding: 1rem; border: none; border-radius: 12px;
          font-weight: 700; font-size: 1.05rem; color: #fff;
          background: var(--theme-gradient);
          box-shadow: 0 10px 25px -8px rgba(79, 70, 229, 0.5);
          transition: var(--transition-smooth);
        }
        .reg-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px -8px rgba(79, 70, 229, 0.55); }
        .reg-submit-btn:disabled { opacity: 0.7; }
        .reg-back-btn { padding: 1rem 1.4rem; border-radius: 12px; font-weight: 700; border: 1.5px solid var(--color-border); background: #fff; color: var(--color-text-dark); white-space: nowrap; }
        .reg-back-btn:hover:not(:disabled) { border-color: #c7c9d1; background: var(--color-bg-light); }
        .reg-back-btn:disabled { opacity: 0.6; }

        .reg-course-summary { background: var(--color-bg-light); border: 1.5px solid var(--color-border); border-radius: 12px; padding: 1rem 1.25rem; }
        .reg-course-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; font-size: 0.92rem; color: var(--color-text-dark); }
        .reg-course-row + .reg-course-row { border-top: 1px solid var(--color-border); }
        .reg-course-row span { color: var(--color-text-muted); }

        .reg-doc-row { padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-light); }
        .reg-doc-row:last-child { border-bottom: none; }
        .reg-doc-check { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.92rem; color: var(--color-text-dark); cursor: pointer; }
        .reg-doc-check input { width: 18px; height: 18px; accent-color: var(--color-secondary); }
        .reg-doc-check em { color: var(--color-text-muted); font-weight: 500; font-style: normal; }
        .reg-doc-upload { margin-top: 0.6rem; margin-left: 28px; display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
        .reg-doc-upload .reg-input { max-width: 320px; padding: 0.5rem 0.75rem; }

        .reg-terms-box {
          max-height: 340px; overflow-y: auto; white-space: pre-wrap;
          background: var(--color-bg-light); border: 1.5px solid var(--color-border);
          border-radius: 12px; padding: 1rem 1.25rem; font-size: 0.82rem; color: var(--color-text-muted); line-height: 1.65;
        }

        .reg-pay-modes { display: flex; gap: 1rem; flex-wrap: wrap; }
        .reg-pay-mode { flex: 1; min-width: 220px; display: flex; align-items: flex-start; gap: 10px; padding: 1rem; border-radius: 12px; background: var(--color-bg-light); border: 1.5px solid var(--color-border); cursor: pointer; transition: var(--transition-smooth); }
        .reg-pay-mode.is-active { background: rgba(79, 70, 229, 0.06); border-color: var(--color-secondary); }
        .reg-pay-mode input { margin-top: 4px; accent-color: var(--color-secondary); }

        @media (max-width: 575px) {
          .reg-step-line { width: 28px; }
          .reg-step-label { display: none; }
          .reg-card { border-radius: 16px; }
        }
      `}</style>

      <div className="reg-topbar">
        <div className="reg-heading">
          <h1>{stepTitle}</h1>
          <p>{stepSubtitle}</p>

          {!success && (
            <div className="reg-steps">
              <div className={`reg-step ${step === 1 ? 'is-active' : 'is-done'}`}>
                <div className="reg-step-circle">{step > 1 ? <i className="fa fa-check"></i> : 1}</div>
                <span className="reg-step-label">Applicant Details</span>
              </div>
              <div className={`reg-step-line ${step > 1 ? 'is-done' : ''}`}></div>
              <div className={`reg-step ${step === 2 ? 'is-active' : step > 2 ? 'is-done' : ''}`}>
                <div className="reg-step-circle">{step > 2 ? <i className="fa fa-check"></i> : 2}</div>
                <span className="reg-step-label">Course &amp; Documents</span>
              </div>
              <div className={`reg-step-line ${step > 2 ? 'is-done' : ''}`}></div>
              <div className={`reg-step ${step === 3 ? 'is-active' : step > 3 ? 'is-done' : ''}`}>
                <div className="reg-step-circle">{step > 3 ? <i className="fa fa-check"></i> : 3}</div>
                <span className="reg-step-label">Application Form</span>
              </div>
              <div className={`reg-step-line ${step > 3 ? 'is-done' : ''}`}></div>
              <div className={`reg-step ${step === 4 ? 'is-active' : ''}`}>
                <div className="reg-step-circle">4</div>
                <span className="reg-step-label">Payment</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="reg-body">
        <div className="reg-card">
        {step === 1 && !success && (
          <>
            {applicantError && <div className="alert alert-danger p-3 text-center fw-bold rounded-3">{applicantError}</div>}

            <form onSubmit={handleSaveApplicantDetails}>
              {/* Personal Information */}
              <div className="reg-section">
                <h5 className="reg-section-title"><i className="fa fa-user"></i> Personal Information</h5>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="reg-label">Full Name (as per ID Proof) *</label>
                    <input type="text" name="fullName" className="reg-input" value={applicant.fullName} onChange={handleApplicantChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="reg-label">Date of Birth *</label>
                    <input type="date" name="dateOfBirth" className="reg-input" value={applicant.dateOfBirth} onChange={handleApplicantChange} required />
                  </div>
                  <div className="col-md-12">
                    <label className="reg-label d-block">Gender *</label>
                    <div className="d-flex flex-wrap gap-3">
                      {['Male', 'Female', 'Other'].map(g => (
                        <label key={g} className={`reg-gender-pill ${applicant.gender === g ? "is-active" : ""}`}>
                          <input type="radio" name="gender" value={g} checked={applicant.gender === g} onChange={handleApplicantChange} required />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="reg-section">
                <h5 className="reg-section-title"><i className="fa fa-address-book"></i> Contact Details</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="reg-label">Mobile Number *</label>
                    <PhoneInput
                      country={'in'}
                      value={applicant.mobileNumber}
                      onChange={(value, country, e, formattedValue) => setApplicant(prev => ({ ...prev, mobileNumber: formattedValue }))}
                      containerClass="reg-phone w-100"
                      inputStyle={{ width: '100%' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="reg-label">Alternate / WhatsApp Number</label>
                    <PhoneInput
                      country={'in'}
                      value={applicant.alternateNumber}
                      onChange={(value, country, e, formattedValue) => setApplicant(prev => ({ ...prev, alternateNumber: formattedValue }))}
                      containerClass="reg-phone w-100"
                      inputStyle={{ width: '100%' }}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="reg-label">E-mail ID *</label>
                    <input type="email" name="email" className="reg-input" value={applicant.email} onChange={handleApplicantChange} required />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="reg-section">
                <h5 className="reg-section-title"><i className="fa fa-map-marker-alt"></i> Residential Address</h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="reg-label">Address</label>
                    <input type="text" name="address" className="reg-input" value={applicant.address} onChange={handleApplicantChange} placeholder="House no., street, locality" />
                  </div>

                  <div className="col-md-4">
                    <label className="reg-label">Country *</label>
                    <select name="country" className="reg-select" value={applicant.country} onChange={handleCountryChange} required>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="reg-label">State *</label>
                    {stateMode === 'select' ? (
                      <select name="state" className="reg-select" value={applicant.state} onChange={handleStateSelect} required>
                        <option value="" disabled>Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <input type="text" name="state" className="reg-input" value={applicant.state} onChange={handleApplicantChange} placeholder="State / Province" required />
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="reg-label">City *</label>
                    {cityMode === 'select' ? (
                      <select className="reg-select" value={applicant.city} onChange={handleCitySelect} required>
                        <option value="" disabled>Select City</option>
                        {(CITIES_BY_STATE[applicant.state] || []).map(c => <option key={c} value={c}>{c}</option>)}
                        <option value={OTHER_VALUE}>Other (type manually)</option>
                      </select>
                    ) : (
                      <>
                        <input type="text" name="city" className="reg-input" value={applicant.city} onChange={handleApplicantChange} placeholder="Enter your city" required autoFocus />
                        {applicant.country === 'India' && (CITIES_BY_STATE[applicant.state] || []).length > 0 && (
                          <button type="button" className="reg-link-btn" onClick={() => { setCityMode('select'); setApplicant(prev => ({ ...prev, city: '' })); }}>
                            <i className="fa fa-list me-1"></i>Choose from list
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="reg-label">PIN / ZIP Code *</label>
                    <input type="text" name="pincode" className="reg-input" value={applicant.pincode} onChange={handleApplicantChange} inputMode="numeric" maxLength={6} placeholder="e.g. 411001" required />
                  </div>
                </div>
              </div>

              {/* Educational Background */}
              <div className="reg-section">
                <h5 className="reg-section-title"><i className="fa fa-graduation-cap"></i> Educational Background</h5>
                <div className="row g-3">
                  <div className="col-md-5">
                    <label className="reg-label">Highest Qualification *</label>
                    {qualMode === 'select' ? (
                      <select className="reg-select" value={applicant.qualification} onChange={handleQualSelect} required>
                        <option value="" disabled>Select Qualification</option>
                        {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                        <option value={OTHER_VALUE}>Other (type manually)</option>
                      </select>
                    ) : (
                      <>
                        <input type="text" name="qualification" className="reg-input" value={applicant.qualification} onChange={handleApplicantChange} placeholder="Enter your qualification" required autoFocus />
                        <button type="button" className="reg-link-btn" onClick={() => { setQualMode('select'); setApplicant(prev => ({ ...prev, qualification: '' })); }}>
                          <i className="fa fa-list me-1"></i>Choose from list
                        </button>
                      </>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="reg-label">Institution *</label>
                    <input type="text" name="institution" className="reg-input" value={applicant.institution} onChange={handleApplicantChange} placeholder="College / University name" required />
                  </div>
                  <div className="col-md-3">
                    <label className="reg-label">Year of Passing *</label>
                    <select name="yearOfPassing" className="reg-select" value={applicant.yearOfPassing} onChange={handleApplicantChange} required>
                      <option value="" disabled>Select Year</option>
                      {PASSING_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Identity Verification */}
              <div className="reg-section">
                <h5 className="reg-section-title"><i className="fa fa-id-card"></i> Identity Verification</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="reg-label">Aadhaar / Government ID Number *</label>
                    <input type="text" name="govtIdNumber" className="reg-input" value={applicant.govtIdNumber} onChange={handleApplicantChange} placeholder="XXXX XXXX XXXX" required />
                  </div>
                  <div className="col-md-6">
                    <label className="reg-label">PAN (if applicable)</label>
                    <input type="text" name="panNumber" className="reg-input text-uppercase" value={applicant.panNumber} onChange={handleApplicantChange} placeholder="ABCDE1234F" maxLength={10} />
                  </div>
                </div>
              </div>

              <button type="submit" className="reg-submit-btn mt-4" disabled={savingApplicant}>
                {savingApplicant ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <>Save &amp; Continue <i className="fa fa-arrow-right ms-2"></i></>}
              </button>
            </form>

            <div className="reg-resume-block mt-4">
              {!showResumeForm ? (
                <button type="button" className="reg-link-btn" onClick={() => setShowResumeForm(true)}>
                  Already submitted your application form? Resume to Payment
                </button>
              ) : (
                <div className="reg-section">
                  <h5 className="reg-section-title"><i className="fa fa-redo"></i> Already Submitted Your Application Form?</h5>
                  <p className="text-muted small mb-3">Enter the email and password you used earlier, and we'll take you straight to Payment.</p>
                  {resumeError && <div className="alert alert-danger p-3 text-center fw-bold rounded-3">{resumeError}</div>}
                  <form onSubmit={handleResumeToPayment}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="reg-label">E-mail ID</label>
                        <input type="email" className="reg-input" value={resumeEmail} onChange={(e) => setResumeEmail(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="reg-label">Password</label>
                        <input type="password" className="reg-input" value={resumePassword} onChange={(e) => setResumePassword(e.target.value)} required />
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button type="button" className="reg-back-btn" onClick={() => { setShowResumeForm(false); setResumeError(null); }}>Cancel</button>
                      <button type="submit" className="reg-submit-btn flex-grow-1" disabled={resumeLoading}>
                        {resumeLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Checking...</> : <>Continue to Payment <i className="fa fa-arrow-right ms-2"></i></>}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </>
        )}

        {step === 2 && !success && (
          <>
            {docsError && <div className="alert alert-danger p-3 text-center fw-bold rounded-3">{docsError}</div>}

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-book"></i> Course Details</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="reg-label">Select Your Course *</label>
                  <select className="reg-input" value={formData.course} onChange={handleCourseSelect} required>
                    <option value="">-- Select a Course --</option>
                    {courseOptions.map(c => (
                      <option key={c.id || c._id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {!formData.course && (
                    <div className="form-text text-muted mt-1">
                      Tip: your course is picked up automatically when you click "Register Now" from a course page — or just select it here.
                    </div>
                  )}
                </div>
              </div>

              {formData.course && (
                <div className="reg-course-summary mt-3">
                  <div className="reg-course-row"><span>Course Name</span><strong>{formData.course}</strong></div>
                  <div className="reg-course-row"><span>Delivery Mode</span><strong>{selectedCourse?.deliveryMode || 'To be announced'}</strong></div>
                  <div className="reg-course-row"><span>Duration</span><strong>{selectedCourse?.duration || 'To be announced'}</strong></div>
                  <div className="reg-course-row"><span>Total Fees</span><strong>₹{(selectedCourse?.paymentPlan?.oneTimeAmount || selectedCourse?.fees || 0).toLocaleString('en-IN')}</strong></div>
                  <div className="reg-course-row"><span>Batch Start Date</span><strong>{selectedCourse?.batchStartDate ? new Date(selectedCourse.batchStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'To be announced'}</strong></div>
                </div>
              )}
            </div>

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-lock"></i> Set Account Password</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="reg-label">Password *</label>
                  <input type="password" name="password" className="reg-input" placeholder="Minimum 6 characters" value={formData.password} onChange={handleChange} required minLength={6} />
                </div>
              </div>
            </div>

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-file-text"></i> E. Documents Submitted</h5>
              <p className="text-muted small mb-3">Please tick the documents submitted:</p>
              {DOCUMENT_TYPES.map(doc => (
                <div className="reg-doc-row" key={doc.key}>
                  <label className="reg-doc-check">
                    <input type="checkbox" checked={!!docChecked[doc.key]} onChange={() => handleDocCheckToggle(doc.key)} />
                    <span>{doc.label}{!doc.required && <em> (optional)</em>}</span>
                  </label>
                  {docChecked[doc.key] && (
                    <div className="reg-doc-upload">
                      <input type="file" className="reg-input" accept={doc.accept} onChange={(e) => handleDocFileChange(doc.key, e.target.files[0])} />
                      {docUploading[doc.key] && <span className="text-muted small ms-2"><span className="spinner-border spinner-border-sm me-1"></span>Uploading...</span>}
                      {documents[doc.key] && !docUploading[doc.key] && <span className="text-success small ms-2"><i className="fa fa-check-circle me-1"></i>Uploaded</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="button" className="reg-back-btn" onClick={() => { setStep(1); window.scrollTo(0,0); }}>
                <i className="fa fa-arrow-left me-1"></i> Back
              </button>
              <button type="button" className="reg-submit-btn flex-grow-1" disabled={savingDocs} onClick={handleContinueToApplicationForm}>
                {savingDocs ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <>Continue <i className="fa fa-arrow-right ms-2"></i></>}
              </button>
            </div>
          </>
        )}

        {step === 3 && !success && (
          <>
            {formError && <div className="alert alert-danger p-3 text-center fw-bold rounded-3">{formError}</div>}

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-file-alt"></i> Application Form Preview</h5>
              <p className="text-muted small mb-3">The details below are auto-filled from what you already provided in Section A.</p>
              <div className="reg-course-summary">
                <div className="reg-course-row"><span>Full Name</span><strong>{applicant.fullName}</strong></div>
                <div className="reg-course-row"><span>Date of Birth</span><strong>{applicant.dateOfBirth}</strong></div>
                <div className="reg-course-row"><span>Gender</span><strong>{applicant.gender}</strong></div>
                <div className="reg-course-row"><span>Mobile Number</span><strong>{applicant.mobileNumber}</strong></div>
                <div className="reg-course-row"><span>E-mail ID</span><strong>{applicant.email}</strong></div>
                <div className="reg-course-row"><span>Address</span><strong>{applicant.address}, {applicant.city}, {applicant.state}, {applicant.country} - {applicant.pincode}</strong></div>
                <div className="reg-course-row"><span>Highest Qualification</span><strong>{applicant.qualification}</strong></div>
                <div className="reg-course-row"><span>Institution</span><strong>{applicant.institution}</strong></div>
                <div className="reg-course-row"><span>Year of Passing</span><strong>{applicant.yearOfPassing}</strong></div>
                <div className="reg-course-row"><span>Aadhaar / Government ID</span><strong>{applicant.govtIdNumber}</strong></div>
                <div className="reg-course-row"><span>PAN</span><strong>{applicant.panNumber || 'N/A'}</strong></div>
                <div className="reg-course-row"><span>Course Applied For</span><strong>{formData.course}</strong></div>
              </div>
            </div>

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-check-square"></i> Confirm Uploaded Documents</h5>
              {REVIEW_DOCUMENT_KEYS.filter(key => documents[key]).map(key => {
                const doc = DOCUMENT_TYPES.find(d => d.key === key);
                return (
                  <div className="reg-doc-row" key={key}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <a href={documents[key]} target="_blank" rel="noreferrer" className="reg-link-btn" style={{ marginTop: 0 }}>
                        <i className="fa fa-eye me-1"></i>View {doc?.label}
                      </a>
                      <label className="reg-doc-check mb-0">
                        <input type="checkbox" checked={!!docConfirmed[key]} onChange={() => setDocConfirmed(prev => ({ ...prev, [key]: !prev[key] }))} />
                        <span>Confirmed</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-file-contract"></i> Terms &amp; Conditions</h5>
              <div className="reg-terms-box">{TERMS_AND_CONDITIONS_TEXT}</div>
              <div className="mt-3 d-flex flex-column gap-2">
                <label className="reg-gender-pill" style={{ justifyContent: 'flex-start', width: 'fit-content' }}>
                  <input type="checkbox" checked={termsReadConfirmed} onChange={() => setTermsReadConfirmed(v => !v)} />
                  I have read all the Terms and Conditions
                </label>
                <label className="reg-gender-pill" style={{ justifyContent: 'flex-start', width: 'fit-content' }}>
                  <input type="checkbox" checked={termsAgreed} onChange={() => setTermsAgreed(v => !v)} />
                  I agree to the above Terms and Conditions
                </label>
              </div>
            </div>

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-user-check"></i> Live Facial Verification</h5>
              <p className="text-muted small mb-2">Take a live photo of yourself (not an upload) to verify your identity.</p>
              <LiveFacialCapture onCapture={handleFacialCapture} capturedUrl={facialPhotoUrl} uploading={facialUploading} />
            </div>

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-signature"></i> Digital Signature</h5>
              <p className="text-muted small mb-2">Upload an image of your signature.</p>
              {signatureUrl ? (
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <img src={signatureUrl} alt="Signature" style={{ height: 60, background: '#fff', border: '1.5px solid var(--color-border)', borderRadius: 8, padding: 4 }} />
                  <label className="reg-link-btn" style={{ cursor: 'pointer' }}>
                    <i className="fa fa-upload me-1"></i>Replace Signature
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleSignatureFileChange(e.target.files[0])} />
                  </label>
                </div>
              ) : (
                <input type="file" className="reg-input" accept="image/*" onChange={(e) => handleSignatureFileChange(e.target.files[0])} style={{ maxWidth: 320 }} />
              )}
              {signatureUploading && <p className="text-muted small mt-2"><span className="spinner-border spinner-border-sm me-1"></span>Uploading...</p>}
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="button" className="reg-back-btn" onClick={() => { setStep(2); window.scrollTo(0,0); }}>
                <i className="fa fa-arrow-left me-1"></i> Back
              </button>
              <button type="button" className="reg-submit-btn flex-grow-1" disabled={submittingForm} onClick={handleSubmitApplicationForm}>
                {submittingForm ? <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</> : <>Submit Application Form <i className="fa fa-arrow-right ms-2"></i></>}
              </button>
            </div>
          </>
        )}

        {step === 4 && !success && (
          <>
            {error && <div className="alert alert-danger p-3 text-center fw-bold rounded-3">{error}</div>}

            {!formData.course && (
              <div className="reg-section">
                <h5 className="reg-section-title"><i className="fa fa-book"></i> Select Your Course</h5>
                <div className="row g-3">
                  <div className="col-12">
                    <select className="reg-input" value={formData.course} onChange={handleCourseSelect} required>
                      <option value="">-- Select a Course --</option>
                      {courseOptions.map(c => (
                        <option key={c.id || c._id || c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <div className="form-text text-muted mt-1">Please select a course to see the fee breakdown and continue to payment.</div>
                  </div>
                </div>
              </div>
            )}

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-money-bill"></i> Choose Payment Option</h5>
              <div className="reg-pay-modes">
                <label className={`reg-pay-mode ${paymentMode === 'onetime' ? 'is-active' : ''}`}>
                  <input type="radio" name="paymentMode" checked={paymentMode === 'onetime'} onChange={() => setPaymentMode('onetime')} />
                  <div>
                    <strong>One-Time Payment</strong>
                    <p className="mb-0 text-muted small">Pay the full course fee now.</p>
                  </div>
                </label>
                <label className={`reg-pay-mode ${paymentMode === 'installment' ? 'is-active' : ''}`}>
                  <input type="radio" name="paymentMode" checked={paymentMode === 'installment'} onChange={() => setPaymentMode('installment')} />
                  <div>
                    <strong>Installment Plan</strong>
                    <p className="mb-0 text-muted small">Split your fee across scheduled installments.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="reg-section">
              <h5 className="reg-section-title"><i className="fa fa-tag"></i> Have a Coupon?</h5>
              <div className="d-flex gap-2 flex-wrap">
                <input
                  type="text"
                  className="reg-input text-uppercase"
                  style={{ maxWidth: 220 }}
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value); setCouponApplied(null); setCouponError(null); }}
                  disabled={!!couponApplied}
                />
                {couponApplied ? (
                  <button type="button" className="reg-back-btn" onClick={() => { setCouponApplied(null); setCouponCode(''); }}>
                    <i className="fa fa-times me-1"></i> Remove ({couponApplied.code})
                  </button>
                ) : (
                  <button type="button" className="reg-back-btn" onClick={handleApplyCoupon} disabled={couponChecking || !couponCode.trim()}>
                    {couponChecking ? 'Checking...' : 'Apply Coupon'}
                  </button>
                )}
              </div>
              {couponError && <p className="text-danger small mt-2 mb-0">{couponError}</p>}
              {couponApplied && <p className="text-success small mt-2 mb-0"><i className="fa fa-check-circle me-1"></i>{couponApplied.discountPercent}% discount applied</p>}
            </div>

            {feeBreakdown && (
              <div className="reg-section">
                <h5 className="reg-section-title"><i className="fa fa-calculator"></i> Fee Calculation</h5>
                <div className="reg-course-summary">
                  <div className="reg-course-row"><span>Base Course Fees</span><strong>₹{feeBreakdown.baseFee.toLocaleString('en-IN')}</strong></div>
                  {feeBreakdown.discountPercent > 0 && (
                    <div className="reg-course-row text-success"><span>Coupon Discount (on base fees only)</span><strong>-{feeBreakdown.discountPercent}%</strong></div>
                  )}
                  {paymentMode === 'installment' && feeBreakdown.installmentProcessingFee > 0 && (
                    <div className="reg-course-row"><span>Installment Processing Fee</span><strong>₹{feeBreakdown.installmentProcessingFee.toLocaleString('en-IN')}</strong></div>
                  )}
                  <div className="reg-course-row"><span>Total Payable</span><strong>₹{feeBreakdown.discountedTotal.toLocaleString('en-IN')}</strong></div>
                  <div className="reg-course-row" style={{ fontSize: '1.1rem' }}><span>Amount Payable Now</span><strong className="text-success">₹{feeBreakdown.amountNow.toLocaleString('en-IN')}</strong></div>
                </div>

                {paymentMode === 'installment' && feeBreakdown.installmentsSchedule.length > 1 && (
                  <div className="mt-3">
                    <p className="fw-bold small mb-2">Installment Schedule</p>
                    <div className="reg-course-summary">
                      {feeBreakdown.installmentsSchedule.map((inst, i) => (
                        <div className="reg-course-row" key={i}>
                          <span>
                            Installment {i + 1} {i === 0 ? '(pay now)' : `(due ${inst.daysAfter} days after registration)`}
                            {inst.feeAmount > 0 && <em className="d-block text-muted" style={{ fontStyle: 'normal', fontSize: '0.8rem' }}>+ ₹{inst.feeAmount.toLocaleString('en-IN')} installment fee</em>}
                          </span>
                          <strong>₹{(inst.amount + inst.feeAmount).toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="d-flex gap-2 mt-4">
              <button type="button" className="reg-back-btn" onClick={() => { setStep(3); window.scrollTo(0,0); }}>
                <i className="fa fa-arrow-left me-1"></i> Back
              </button>
              <button type="button" className="reg-submit-btn flex-grow-1" disabled={loading} onClick={handlePayNow}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</> : `Pay ₹${(feeBreakdown?.amountNow || 0).toLocaleString('en-IN')} Now`}
              </button>
            </div>
          </>
        )}

        {step === 5 && success && (
          <div className="text-center py-2">
            <div className="mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-theme-secondary text-white rounded-circle mb-3 shadow-sm" style={{ width: '72px', height: '72px' }}>
                <i className="fa fa-check fa-2x"></i>
              </div>
            </div>

            <div className="alert alert-success border-0 bg-light rounded-4 text-center p-4 mb-4 shadow-sm">
              <p className="mb-0 mt-1 text-muted small">Your payment has been successfully processed and your account is active.</p>
            </div>

            <div className="reg-course-summary text-start mb-4">
              {paymentSummary?.studentId && (
                <div className="reg-course-row"><span>Student ID</span><strong>{paymentSummary.studentId}</strong></div>
              )}
              <div className="reg-course-row"><span>Student Name</span><strong>{formData.full_name}</strong></div>
              <div className="reg-course-row"><span>Course</span><strong>{paymentSummary?.courseName || formData.course}</strong></div>
              <div className="reg-course-row"><span>Total Fees</span><strong>₹{(paymentSummary?.totalFees || 0).toLocaleString('en-IN')}</strong></div>
              <div className="reg-course-row"><span>Amount Paid</span><strong className="text-success">₹{(paymentSummary?.amountPaid || 0).toLocaleString('en-IN')}</strong></div>
              {paymentSummary?.remainingFees > 0 && (
                <div className="reg-course-row"><span>Remaining Balance</span><strong>₹{paymentSummary.remainingFees.toLocaleString('en-IN')}</strong></div>
              )}
            </div>

            {paymentSummary?.remainingInstallments?.length > 0 && (
              <div className="reg-course-summary text-start mb-4">
                <p className="fw-bold small mb-2 px-0">Upcoming Installments</p>
                {paymentSummary.remainingInstallments.map((inst) => (
                  <div className="reg-course-row" key={inst.installmentNo}>
                    <span>
                      Installment {inst.installmentNo} (due in {inst.daysAfter} days)
                      {inst.feeAmount > 0 && <em className="d-block text-muted" style={{ fontStyle: 'normal', fontSize: '0.8rem' }}>+ ₹{inst.feeAmount.toLocaleString('en-IN')} installment fee</em>}
                    </span>
                    <strong>₹{(inst.amount + (inst.feeAmount || 0)).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                const text = encodeURIComponent(`Hi Clinidea, I have successfully registered and paid! My name is ${formData.full_name}.`);
                window.open(`https://wa.me/918999213129?text=${text}`, '_blank');
                setTimeout(() => navigate('/login'), 500);
              }}
              className="btn w-100 py-3 fw-bold fs-5 mb-3"
              style={{ borderRadius: '12px', border: '2px solid #25D366', color: '#25D366', background: 'transparent', transition: 'all 0.3s ease' }}
            >
              Say Hi on WhatsApp <i className="fab fa-whatsapp ms-2"></i>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="reg-submit-btn"
            >
              Go to Login
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Register;
