# Netra Rakshak

Create a functional MVP web application for "Drishti.AI", a Diabetic Retinopathy screening tool, using React (Next.js App Router) and Tailwind CSS. 

### Constraints & Tech Stack

- Framework: React (Next.js App Router preferred)

- Styling: Tailwind CSS

- Icons: lucide-react

- Data: Use local React state to mock a Supabase database flow. No real backend is needed for this UI generation.

- Theme: Clean medical aesthetic. Pure white backgrounds (`#FFFFFF`), light pink/blush containers (`bg-pink-50`), and deep rose/magenta primary buttons (`bg-rose-600` hover `bg-rose-700`).

### App Architecture (3 Routes)

**1. Login Page (`/`)**

- No marketing landing page. The root URL should render a clean, centered login card.

- Two large, selectable role buttons: "Enter as PHC Kiosk" and "Enter as Ophthalmologist".

- Clicking "Enter as PHC Kiosk" routes directly to `/kiosk`.

- Clicking "Enter as Ophthalmologist" routes directly to `/doctor`.

**2. Kiosk Intake Dashboard (`/kiosk`)**

- A clean, centered interface for frontline health workers.

- **Initial State:** A large drag-and-drop zone with a dashed border to upload a fundus image (.jpg/.png). 

- **Processing State:** When an image is selected, show a loading spinner with the text: "Uploading to Database & Running AI Analysis...".

- **Result State:** After a 2-second mock delay, display a result card containing:

  - Quality Check: "Pass (Image saved to DB)" in green.

  - AI Diagnosis: "Grade 2: Moderate NPDR" (make the text prominent).

  - Next Steps: "Added to Specialist Queue. ETA for doctor verification: 14 minutes."

  - A button to "Scan Next Patient" which resets the state.

**3. Doctor Validation Dashboard (`/doctor`)**

- A high-density diagnostic portal mapping to database rows.

- **Left Panel (The Queue):** A table or vertical list of pending patients. 

  - Mock data rows should include: Patient ID (e.g., P-1042), AI Grade (e.g., Grade 2), and Wait Time (e.g., 14 mins).

  - Highlighting or clicking a row selects the patient.

- **Right Panel (The XAI Console):**

  - A large image viewer showing the selected patient's eye scan (use placeholder images).

  - A clear toggle switch labeled "Overlay Grad-CAM Heatmap". When toggled, overlay a semi-transparent, colored heatmap onto the image to explain the AI's decision.

  - An "Action Bar" at the bottom with a dropdown to select the final Grade (0-4) and two primary buttons: "Confirm AI Diagnosis" (Green) and "Override Diagnosis" (Red/Rose). 

  - Clicking either button should remove the patient from the pending queue to simulate database update completion.

Ensure the code is fully responsive, modular, and ready to be connected to a real Supabase backend later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b2a6b7a7-38ab-4905-a916-13d939b737d0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
