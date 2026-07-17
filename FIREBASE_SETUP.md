# Star Light Public School — Firebase Login Setup

The website code is ready for Firebase Email/Password Authentication, Firestore profiles and a secure Admin Panel. Complete these one-time steps.

## 1. Create the Firebase project

1. Open <https://console.firebase.google.com/> and create a project.
2. Go to **Authentication → Sign-in method** and enable **Email/Password**.
3. In **Authentication → Settings → Authorized domains**, add `starlightpublicschool.netlify.app`.
4. Go to **Firestore Database** and create the default database.
5. In **Project settings → General**, add a Web App and copy its `firebaseConfig` object.

## 2. Deploy Firestore rules

Install/login to Firebase CLI and run from this repository:

```powershell
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only firestore:rules
```

The included `firestore.rules` lets a signed-in user read only their own profile. Browser writes are denied; student management is performed by the verified Admin Netlify Function.

## 3. Create the first administrator

1. In **Firebase Authentication → Users**, create an Email/Password user.
2. Copy that user's UID.
3. In Firestore create collection `users`, then a document whose ID is exactly the UID.
4. Add these fields:

| Field | Type | Example |
| --- | --- | --- |
| `name` | string | `Nirmal Tinker` |
| `email` | string | the same Firebase Auth email |
| `className` | string | `Staff` |
| `roll` | string | `ADMIN-01` |
| `role` | string | `admin` |
| `active` | boolean | `true` |

After setup, open `/admin.html`. This first admin can add, edit, disable and delete other accounts.

## 4. Add secure Netlify environment variables

In **Netlify → Site configuration → Environment variables**, add:

### `FIREBASE_PROJECT_ID`

Your Firebase project ID: `star-light-public-school`.

### `FIREBASE_SERVICE_ACCOUNT`

In Firebase **Project settings → Service accounts**, generate a new private key. Copy the complete downloaded JSON object into this Netlify variable. Never commit this key to GitHub.

## 5. Redeploy

Trigger a new Netlify deploy after adding the variables. Then test:

1. `/login.html` accepts Firebase email/password.
2. `/admin.html` opens only for the `admin` role.
3. A disabled student cannot log in.
4. Test pages redirect signed-out users to login.

## Security notes

- Keep `FIREBASE_SERVICE_ACCOUNT` only in Netlify environment variables.
- Enable a strong Firebase password policy and email-enumeration protection.
- Do not add public sign-up; accounts should be created only through the Admin Panel.
