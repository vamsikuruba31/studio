# CampusConnect: Smart Event Platform

## Abstract

CampusConnect is a full-stack Next.js application designed to revolutionize how university communities engage with campus events. It serves as a centralized, intelligent platform that bridges the gap between event organizers and the student body, fostering a more vibrant and connected campus life.

Our primary goal is to simplify event management for university staff while creating an engaging and accessible discovery experience for students. By leveraging modern web technologies and artificial intelligence, CampusConnect aims to be the go-to digital destination for all campus happenings, from academic workshops to social gatherings.

The platform empowers university administrators with a secure and intuitive dashboard. Authorized users can effortlessly create new event listings, providing essential details like title, description, and sponsoring department.

A key innovation is the integrated AI assistant, powered by Google's Gemini models through Genkit. This tool automatically generates compelling social media captions, significantly reducing the marketing overhead for event promotion. Image uploads for event posters are handled seamlessly through Firebase Storage, ensuring that each event is visually appealing.

The application's frontend is built with React and ShadCN UI, offering a clean, responsive, and accessible user interface for both organizers and attendees.


## Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** React, ShadCN UI, Tailwind CSS
- **Backend & Database:** Firebase (Authentication, Firestore, Storage)
- **Generative AI:** Google AI & Genkit
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Running Locally

To run the project on your local machine, follow these steps:

1.  **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your system.

2.  **Clone the Repository**:
    If you have the project as a zip file, unzip it.

3.  **Open in VS Code**:
    Open the project folder in Visual Studio Code.

4.  **Install Dependencies**:
    Open the integrated terminal in VS Code (you can use `Ctrl+\``) and run the following command to install all the necessary packages:
    ```bash
    npm install
    ```

5.  **Run the Development Server**:
    After the installation is complete, start the Next.js development server with this command:
    ```bash
    npm run dev
    ```

6.  **View the Application**:
    Open your web browser and navigate to [http://localhost:3000](http://localhost:3000). You should now see the application running!

The Firebase configuration is already set up in the `.env.local` file, so it will connect to your Firebase project automatically.
