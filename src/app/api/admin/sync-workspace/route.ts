import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// POST /api/admin/sync-workspace
// Called by admin UI with the admin user's Google OAuth access token.
// Fetches the Google Workspace Directory and upserts all users into Firestore.
// The token must have the 'https://www.googleapis.com/auth/admin.directory.user.readonly' scope.

export async function POST(req: NextRequest) {
  const { accessToken } = await req.json();

  if (!accessToken || typeof accessToken !== "string") {
    return NextResponse.json({ error: "Missing accessToken" }, { status: 400 });
  }

  let pageToken: string | undefined;
  let synced = 0;
  const errors: string[] = [];

  do {
    const url = new URL("https://admin.googleapis.com/admin/directory/v1/users");
    url.searchParams.set("customer", "my_customer");
    url.searchParams.set("maxResults", "200");
    url.searchParams.set("orderBy", "email");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Google Directory API error", details: err },
        { status: res.status }
      );
    }

    const data = await res.json();
    const users: GoogleDirectoryUser[] = data.users ?? [];
    pageToken = data.nextPageToken;

    for (const u of users) {
      try {
        const email: string = u.primaryEmail ?? "";
        const name = `${u.name?.givenName ?? ""} ${u.name?.familyName ?? ""}`.trim();
        const orgUnit = u.orgUnitPath ?? "";
        const department = u.organizations?.[0]?.department ?? "";
        const jobTitle = u.organizations?.[0]?.title ?? "";
        const isActive = !u.suspended;

        // Only sync @edlight.org accounts
        if (!email.endsWith("@edlight.org")) continue;

        // Use email as the document ID key for directory users
        // (they may not have logged in yet, so no Firebase UID)
        await setDoc(
          doc(db, "workspaceUsers", email),
          {
            email,
            name,
            orgUnit,
            department,
            jobTitle,
            status: isActive ? "active" : "inactive",
            syncedAt: serverTimestamp(),
          },
          { merge: true }
        );
        synced++;
      } catch (e) {
        errors.push(String(e));
      }
    }
  } while (pageToken);

  return NextResponse.json({ synced, errors });
}

interface GoogleDirectoryUser {
  primaryEmail?: string;
  name?: { givenName?: string; familyName?: string };
  orgUnitPath?: string;
  suspended?: boolean;
  organizations?: { department?: string; title?: string }[];
}
