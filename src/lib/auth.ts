import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const ALLOWED_DOMAIN = "edlight.org";

const provider = new GoogleAuthProvider();
// Request access to the user's Google Workspace profile (org, department, title)
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

interface WorkspaceProfile {
  jobTitle: string;
  department: string;
  organization: string;
}

async function fetchWorkspaceProfile(accessToken: string): Promise<WorkspaceProfile> {
  const res = await fetch(
    "https://people.googleapis.com/v1/people/me?personFields=organizations,phoneNumbers",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return { jobTitle: "", department: "", organization: "" };

  const data = await res.json();
  const org = data?.organizations?.[0] ?? {};

  return {
    jobTitle: org.title ?? "",
    department: org.department ?? "",
    organization: org.name ?? "",
  };
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const email = user.email ?? "";

  // Domain restriction — @edlight.org only, always enforced
  if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
    await firebaseSignOut(auth);
    throw new Error(`Access restricted to @${ALLOWED_DOMAIN} accounts only.`);
  }

  // Fetch Google Workspace profile (department, title) using the OAuth access token
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const workspaceProfile = credential?.accessToken
    ? await fetchWorkspaceProfile(credential.accessToken)
    : { jobTitle: "", department: "", organization: "" };

  // Upsert user profile in Firestore — preserve role if already set
  const existingSnap = await getDoc(doc(db, "users", user.uid));
  const existingRole = existingSnap.exists() ? existingSnap.data().role : "employee";

  await setDoc(
    doc(db, "users", user.uid),
    {
      id: user.uid,
      name: user.displayName ?? "",
      email: user.email ?? "",
      profileImage: user.photoURL ?? "",
      jobTitle: workspaceProfile.jobTitle,
      department: workspaceProfile.department,
      organization: workspaceProfile.organization,
      role: existingRole ?? "employee",
      status: "active",
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
