# Lemonade Stand Website

This project is a simple web application for a virtual Lemonade Stand. It allows users to place orders for lemonade and an admin to view these orders. The website is designed with a modern, dark-mode interface using Tailwind CSS and uses Google Firestore as a backend to store order data.

## Features

*   **Home Page (`index.html`)**: Welcome page with navigation to order and admin sections.
*   **Order Page (`order.html`)**: A form for customers to place orders for lemonade, specifying their name, email, quantity, and payment preference (Prepay Online or Pay with Cash).
*   **Payment Page (`pay.html`)**: Instructions for customers who choose to "Prepay Online" to make a payment via a Venmo link.
*   **Admin Portal (`admin.html`)**: A password-protected page for the stand owner to view all submitted orders. Orders are fetched from Firestore.
*   **Firebase Integration**: Orders are stored in and retrieved from Google Firestore.
*   **Responsive Design**: Styled with Tailwind CSS for responsiveness across different screen sizes.
*   **Dark Mode**: Consistent dark theme across all pages.

## Tech Stack

*   HTML
*   CSS (Tailwind CSS)
*   JavaScript (Vanilla)
*   Google Firestore (NoSQL Database)
*   GitHub Pages (for deployment)

## Setup Instructions

Follow these steps to set up and run your own instance of the Lemonade Stand website:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Configure Firebase:**
    *   **Create a Firebase Project**:
        1.  Go to the [Firebase Console](https://console.firebase.google.com/).
        2.  Click "Add project" and follow the on-screen instructions.
        3.  Once your project is created, navigate to Project Settings (click the gear icon).
        4.  Under the "General" tab, scroll down to "Your apps".
        5.  Click the web icon (`</>`) to add a new web app.
        6.  Register your app (give it a nickname) and Firebase will provide you with a `firebaseConfig` object.
    *   **Update `firebase.js`**:
        Open the `firebase.js` file in the project. You will see a placeholder `firebaseConfig` object at the top:
        ```javascript
        // TODO: Replace with your Firebase project's configuration object
        // const firebaseConfig = {
        //   apiKey: "YOUR_API_KEY",
        //   authDomain: "YOUR_AUTH_DOMAIN",
        //   projectId: "YOUR_PROJECT_ID",
        //   storageBucket: "YOUR_STORAGE_BUCKET",
        //   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        //   appId: "YOUR_APP_ID"
        // };
        ```
        Replace the placeholder values with the actual values from your Firebase project's `firebaseConfig` object. Uncomment the object by removing the `//` at the beginning of each line.
    *   **Set up Firestore Database**:
        1.  In the Firebase Console, go to "Firestore Database" from the left-hand menu.
        2.  Click "Create database".
        3.  Choose "Start in **production mode**" or "Start in **test mode**". For initial setup and development, test mode is fine, but remember to secure your rules before wide deployment.
        4.  Select a Firestore location (choose one close to your users).
    *   **Update Firestore Security Rules**:
        1.  In the Firestore Database section of the Firebase Console, go to the "Rules" tab.
        2.  Replace the existing rules with the following, **making sure to update `YOUR_GITHUB_PAGES_DOMAIN_HERE` with your actual GitHub Pages domain (e.g., `your-username.github.io`) once deployed**:
            ```
            rules_version = '2';
            service cloud.firestore {
              match /databases/{database}/documents {
                // Allow read/write access to the 'orders' collection
                // if the request originates from your GitHub Pages domain
                match /orders/{orderId} {
                  allow read, write: if request.auth == null && request.origin == 'YOUR_GITHUB_PAGES_DOMAIN_HERE';
                }
              }
            }
            ```
            **Note**: For local testing before deployment, you might need to temporarily use more open rules like `allow read, write: if true;` but **this is not secure for production**. Always restrict access to your domain. The `request.origin` rule works best if your app is served via HTTPS, which GitHub Pages provides.

3.  **Configure Venmo Link (in `pay.html`):**
    Open `pay.html`. You'll find placeholder comments for your Venmo handle and link:
    ```html
    <!-- TODO: Replace with your actual Venmo link and handle -->
    <strong class="text-yellow-300">[Your Venmo Handle]</strong>
    ```
    and
    ```html
    <!-- TODO: Replace with your actual Venmo link and handle -->
    <a href="https://venmo.com/yourhandle" ...>
        Pay with Venmo
    </a>
    ```
    Update `[Your Venmo Handle]` and `https://venmo.com/yourhandle` with your actual Venmo information.

## Deployment

This project is designed to be easily deployable on GitHub Pages:

1.  **Push to GitHub**: Ensure your local repository is pushed to a GitHub repository.
2.  **Enable GitHub Pages**:
    *   In your GitHub repository, go to "Settings".
    *   Navigate to the "Pages" section from the left sidebar.
    *   Under "Build and deployment", select "Deploy from a branch" as the source.
    *   Choose the branch you want to deploy (usually `main` or `master`).
    *   Select the `/ (root)` folder.
    *   Click "Save". GitHub will build and deploy your site, providing you with a URL (e.g., `https://your-username.github.io/your-repository-name/`).
3.  **Update Firestore Rules with GitHub Pages Domain**:
    *   Once your GitHub Pages site is live and you have the URL, go back to your Firebase project's Firestore "Rules" tab.
    *   Update the placeholder `YOUR_GITHUB_PAGES_DOMAIN_HERE` in your security rules with your actual GitHub Pages domain (e.g., `your-username.github.io`). **Do not include subdirectories if your site is deployed to `username.github.io/repo-name/`, just the base domain `username.github.io` might be sufficient for `request.origin` or you might need to adjust based on Firebase behavior.** Test thoroughly.

## Admin Access

*   The admin portal is located at `admin.html`.
*   The default password for admin access is **`lemonadee`**.
*   This password is hardcoded in `admin.html`. If you wish to change it, you can modify it directly in the JavaScript code within that file.
    *   **Security Note**: This client-side password check is **not secure** for a production system handling sensitive data. It's implemented as per the project specifications for simplicity. For a real-world application, proper server-side authentication would be required.

---
Enjoy your Lemonade Stand website! 🍋
