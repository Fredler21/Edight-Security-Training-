import { TrainingModule } from "@/types";

export const modules: TrainingModule[] = [
  {
    id: "module-1",
    title: "Password Security",
    slug: "password-security",
    description:
      "Learn how to create strong passwords, manage credentials safely, and protect your accounts from unauthorized access.",
    order: 1,
    estimatedMinutes: 12,
    isActive: true,
    icon: "🔐",
    color: "teal",
    image: "/images/modules/password-security.png",
    lectureContent: `
## Why Password Security Matters

Passwords are the first line of defense for every account, system, and piece of data you have access to. A compromised password can give an attacker full access to your email, company files, financial accounts, and more, without any technical hacking required.

### What Makes a Password Weak?

Weak passwords are the most common cause of data breaches. Here's what to avoid:

- Short passwords (fewer than 12 characters)
- Simple words like "password" or "welcome"
- Personal information like your name, birthday, or pet's name
- Reusing the same password across multiple accounts
- Common substitutions like "p@ssw0rd"

### What Makes a Password Strong?

A strong password should be:

- **At least 14 characters long**
- A mix of uppercase and lowercase letters, numbers, and symbols
- Completely random or a long passphrase (e.g., "BlueMountain!River42")
- Unique, never used anywhere else

### Password Managers

You should never try to memorize every unique password. Use a trusted password manager instead:

- Password managers generate and store strong, unique passwords for every account
- You only need to remember one strong master password
- EdLight-approved options include 1Password and Bitwarden
- Never store passwords in a browser that is not managed by IT

### Multi-Factor Authentication (MFA)

Even the strongest password can be stolen. That's why MFA adds a second verification step, like a code sent to your phone, so that even if someone has your password, they still can't get in.

**MFA is required for all EdLight systems.** Enable it immediately on any account that offers it.

### Password Sharing Policy

- Never share your password with anyone, including IT staff
- EdLight IT will never ask for your password
- If you need to give someone access, use permission settings in the relevant system
    `,
    keyTakeaways: [
      "Use passwords that are at least 14 characters long and fully unique.",
      "Never reuse a password across different accounts.",
      "Use an IT-approved password manager for all credentials.",
      "Enable Multi-Factor Authentication (MFA) on every account.",
      "Never share your password with anyone, including IT.",
    ],
    realLifeExample: {
      title: "The Reused Password Breach",
      scenario:
        "An employee at a tech company used the same password for their work email, a shopping website, and a gaming account. When the gaming site was breached, attackers used that password to access the employee's work email, and then used that email to reset passwords for company financial tools.",
      lesson:
        "One reused password exposed the entire company. If each account had a unique password, the breach would have been contained to one low-risk site.",
    },
    questions: [
      {
        id: "q1-1",
        moduleId: "module-1",
        question: "What is the minimum recommended password length at EdLight?",
        type: "multiple_choice",
        options: ["6 characters", "8 characters", "12 characters", "14 characters"],
        correctAnswer: "14 characters",
        explanation:
          "EdLight requires passwords to be at least 14 characters to ensure they are resistant to brute-force attacks.",
      },
      {
        id: "q1-2",
        moduleId: "module-1",
        question: "It is acceptable to reuse a strong password across multiple work accounts.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation:
          "Even a strong password becomes dangerous when reused. If one account is breached, all others with the same password are at risk.",
      },
      {
        id: "q1-3",
        moduleId: "module-1",
        question: "What should you do if someone claiming to be IT asks for your password?",
        type: "multiple_choice",
        options: [
          "Share it if they have a ticket number",
          "Refuse, IT will never ask for your password",
          "Share it only over a secure call",
          "Reset it first, then share the new one",
        ],
        correctAnswer: "Refuse, IT will never ask for your password",
        explanation:
          "Legitimate IT staff will never ask for your password. This is a classic social engineering tactic.",
      },
      {
        id: "q1-4",
        moduleId: "module-1",
        question: "Which of the following is the safest way to manage your work passwords?",
        type: "multiple_choice",
        options: [
          "Save them in a notes file on your desktop",
          "Memorize all of them",
          "Use an IT-approved password manager",
          "Write them in a notebook",
        ],
        correctAnswer: "Use an IT-approved password manager",
        explanation:
          "An IT-approved password manager is the safest, most reliable way to store and generate unique passwords for every account.",
      },
      {
        id: "q1-5",
        moduleId: "module-1",
        question: "What does multi-factor authentication (MFA) add to your login?",
        type: "multiple_choice",
        options: [
          "A second password",
          "A second proof of identity, like a code or app prompt",
          "Faster login speed",
          "A backup email address",
        ],
        correctAnswer: "A second proof of identity, like a code or app prompt",
        explanation:
          "MFA adds a second factor (something you have, like a phone) so a stolen password alone is not enough to break in.",
      },
      {
        id: "q1-6",
        moduleId: "module-1",
        question: "Which of the following passwords is the strongest?",
        type: "multiple_choice",
        options: [
          "Password123!",
          "Edlight2026",
          "Purple-Tiger-Coffee-River-42",
          "qwerty1234",
        ],
        correctAnswer: "Purple-Tiger-Coffee-River-42",
        explanation:
          "A long passphrase made of unrelated words is much harder to crack than a short password with substitutions.",
      },
      {
        id: "q1-7",
        moduleId: "module-1",
        question: "You can safely share your password with a trusted coworker if they need urgent access.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation:
          "Passwords should never be shared. If a coworker needs access, request proper permissions through IT.",
      },
      {
        id: "q1-8",
        moduleId: "module-1",
        question: "How often should you change a strong password that has not been compromised?",
        type: "multiple_choice",
        options: [
          "Every week",
          "Only when there is a sign of compromise",
          "Every 30 days, no exceptions",
          "Never",
        ],
        correctAnswer: "Only when there is a sign of compromise",
        explanation:
          "Modern guidance favors strong, unique passwords plus MFA over forced rotations. Change immediately on any sign of compromise.",
      },
      {
        id: "q1-9",
        moduleId: "module-1",
        question: "You receive an email saying your password has expired with a link to reset it. What is the safest action?",
        type: "multiple_choice",
        options: [
          "Click the link and reset right away",
          "Reply to confirm the request",
          "Go to the login page directly through your browser and reset there",
          "Forward the email to your team",
        ],
        correctAnswer: "Go to the login page directly through your browser and reset there",
        explanation:
          "Never reset a password from a link in an email. Always navigate to the login page yourself.",
      },
      {
        id: "q1-10",
        moduleId: "module-1",
        question: "A password manager helps you avoid reusing the same password across sites.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Password managers generate and remember a unique password for every site, so you never have to reuse one.",
      },
    ],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  {
    id: "module-2",
    title: "Phishing Awareness",
    slug: "phishing-awareness",
    description:
      "Recognize and avoid phishing attacks, suspicious emails, and social engineering tactics used by attackers.",
    order: 2,
    estimatedMinutes: 15,
    isActive: true,
    icon: "🎣",
    color: "red",
    image: "/images/modules/phishing-awareness.png",
    lectureContent: `
## What Is Phishing?

Phishing is one of the most common and dangerous cyber threats today. It happens when an attacker disguises themselves as a trusted person or organization to trick you into revealing sensitive information, clicking a malicious link, or downloading harmful software.

### Types of Phishing

**Email Phishing**
The attacker sends a fake email that looks like it's from a legitimate source, your bank, Google, a coworker, or even your CEO. The email urges you to act quickly.

**Spear Phishing**
A targeted attack where the attacker researches you specifically. They might mention your name, your team, or a recent project to appear more convincing.

**Smishing (SMS Phishing)**
Phishing attacks sent via text message. Common tactics include fake delivery notifications or "your account has been locked" messages.

**Vishing (Voice Phishing)**
An attacker calls you pretending to be IT support, a bank, or even a government agency.

### How to Recognize a Phishing Email

Be suspicious if an email:

- Creates urgency: "Act now!" or "Your account will be suspended in 24 hours"
- Asks for sensitive information like passwords, credit cards, or Social Security numbers
- Has a sender address that doesn't match the official domain (e.g., support@edlight-help.net instead of @edlight.org)
- Contains typos, odd formatting, or generic greetings like "Dear User"
- Includes unexpected attachments or unfamiliar links
- Asks you to bypass a normal process

### How to Verify Before Clicking

- **Hover over links** before clicking to preview the actual URL
- When in doubt, go directly to the website by typing the URL yourself
- Call the sender through a known phone number to verify
- Forward suspicious emails to security@edlight.org immediately

### What to Do If You Clicked Something

If you accidentally clicked a suspicious link or entered credentials:

1. Disconnect from the network immediately if possible
2. Report it to IT at security@edlight.org
3. Change the password for any account you entered credentials into
4. Do not try to "fix it yourself", report it right away
    `,
    keyTakeaways: [
      "Phishing attacks impersonate trusted sources to steal information.",
      "Look for urgency, mismatched sender domains, and suspicious links.",
      "Hover over links before clicking to preview the real URL.",
      "Report all suspicious emails to security@edlight.org.",
      "If you clicked something suspicious, report it to IT immediately, do not wait.",
    ],
    realLifeExample: {
      title: "The CEO Email Scam",
      scenario:
        "An employee received an urgent email appearing to come from the company CEO asking them to wire $15,000 to a vendor immediately and keep it confidential. The email domain was slightly misspelled: 'ceo@edl1ght.org'. The employee transferred the funds before verifying.",
      lesson:
        "Always verify unusual requests, especially involving money or sensitive data, through a separate channel. A quick phone call to the actual CEO would have prevented the loss.",
    },
    questions: [
      {
        id: "q2-1",
        moduleId: "module-2",
        question: "What is spear phishing?",
        type: "multiple_choice",
        options: [
          "A generic email sent to thousands of people",
          "A targeted phishing attack that uses personal details about the victim",
          "Phishing done through text messages",
          "A type of malware installed via USB",
        ],
        correctAnswer: "A targeted phishing attack that uses personal details about the victim",
        explanation:
          "Spear phishing is a targeted attack where the attacker researches the victim to make the message more convincing.",
      },
      {
        id: "q2-2",
        moduleId: "module-2",
        question:
          "You receive an email saying your account will be locked in 2 hours and you must click a link to verify. What should you do?",
        type: "multiple_choice",
        options: [
          "Click the link immediately to avoid being locked out",
          "Reply to the email asking for more information",
          "Do not click, go directly to the website by typing the URL, or contact IT",
          "Forward the email to your team",
        ],
        correctAnswer:
          "Do not click, go directly to the website by typing the URL, or contact IT",
        explanation:
          "Urgency is a classic phishing tactic. Always verify by going directly to the site or contacting IT rather than clicking email links.",
      },
      {
        id: "q2-3",
        moduleId: "module-2",
        question: "Hovering over a link in an email shows 'http://edlight.verify-secure.net'. This is safe to click.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation:
          "The domain 'verify-secure.net' is not an official EdLight domain. Attackers use subdomains with company names to appear legitimate. Always check the root domain.",
      },
      {
        id: "q2-4",
        moduleId: "module-2",
        question: "Where should you report a suspicious email at EdLight?",
        type: "multiple_choice",
        options: [
          "Delete it and ignore it",
          "Forward it to your manager",
          "Send it to security@edlight.org",
          "Reply to the sender asking if it's real",
        ],
        correctAnswer: "Send it to security@edlight.org",
        explanation:
          "Always forward phishing emails to security@edlight.org so the security team can investigate and protect others.",
      },
      {
        id: "q2-5",
        moduleId: "module-2",
        question: "Which of these is the strongest sign that an email is a phishing attempt?",
        type: "multiple_choice",
        options: [
          "It comes from a coworker",
          "It includes urgency, a strange request, and an unfamiliar link",
          "It has a company logo",
          "It is sent on a weekend",
        ],
        correctAnswer: "It includes urgency, a strange request, and an unfamiliar link",
        explanation:
          "Phishing emails almost always combine pressure, an unusual ask, and a link or attachment you weren't expecting.",
      },
      {
        id: "q2-6",
        moduleId: "module-2",
        question: "Hovering over a link in an email shows you the real destination URL.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Hovering reveals the actual URL. If the displayed text and the real link don't match, treat it as suspicious.",
      },
      {
        id: "q2-7",
        moduleId: "module-2",
        question: "Which of these is a common red flag in a phishing email's sender address?",
        type: "multiple_choice",
        options: [
          "It uses your company domain exactly",
          "It is a slight misspelling like 'edlght.org' instead of 'edlight.org'",
          "It comes from a Gmail address you recognize",
          "It includes the sender's full name",
        ],
        correctAnswer: "It is a slight misspelling like 'edlght.org' instead of 'edlight.org'",
        explanation:
          "Attackers register lookalike domains that are off by one or two characters to trick busy readers.",
      },
      {
        id: "q2-8",
        moduleId: "module-2",
        question: "You receive a text message asking you to click a link to verify a delivery. What's the safest action?",
        type: "multiple_choice",
        options: [
          "Click the link to be sure",
          "Reply STOP to opt out",
          "Ignore the link and check the carrier's app or website directly",
          "Forward the text to friends",
        ],
        correctAnswer: "Ignore the link and check the carrier's app or website directly",
        explanation:
          "Smishing (SMS phishing) uses fake delivery notices to trick you. Always verify through the official app or website.",
      },
      {
        id: "q2-9",
        moduleId: "module-2",
        question: "Vishing is a phishing attempt that happens over a phone call.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Vishing is voice phishing. Attackers impersonate IT, a bank, or an executive over the phone to steal information.",
      },
      {
        id: "q2-10",
        moduleId: "module-2",
        question: "An attachment in an unexpected email is generally:",
        type: "multiple_choice",
        options: [
          "Safe to open if the sender looks familiar",
          "Safe to open if it's a PDF",
          "Risky and should be verified before opening",
          "Always safe in webmail",
        ],
        correctAnswer: "Risky and should be verified before opening",
        explanation:
          "Even familiar-looking attachments can carry malware. Verify with the sender through a separate channel before opening.",
      },
    ],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  {
    id: "module-3",
    title: "Safe Browsing",
    slug: "safe-browsing",
    description:
      "Understand safe internet habits, how to identify malicious websites, and how to protect company data while browsing.",
    order: 3,
    estimatedMinutes: 10,
    isActive: true,
    icon: "🌐",
    color: "blue",
    image: "/images/modules/safe-browsing.png",
    lectureContent: `
## Browsing Safely at Work

Every website you visit on a company device can be a potential entry point for risk. Safe browsing means being intentional about which sites you visit, how you interact with web content, and how you protect your data online.

### HTTPS vs HTTP

Always look for **HTTPS** (the padlock icon) in the address bar before entering any information on a website.

- HTTPS encrypts communication between you and the site
- HTTP is unencrypted, anyone on the same network can intercept your data
- A padlock does NOT guarantee a site is trustworthy, it only means the connection is encrypted

### Dangerous Website Indicators

Treat a website with caution if:

- The URL looks unusual (extra characters, misspellings, or added words)
- Your browser shows a security warning, do not ignore it
- It asks you to download software or browser extensions unexpectedly
- It requests sensitive information that seems unnecessary
- Pop-ups appear aggressively or try to prevent you from leaving

### Downloading Files

- Only download files from trusted, verified sources
- Never open unexpected email attachments without verification
- Be cautious of compressed files (.zip, .rar) from unknown sources
- Always run company-approved antivirus scans on downloaded files

### Public Wi-Fi and Corporate Data

**Never access company systems on public Wi-Fi without a VPN.**

Public Wi-Fi networks (hotels, coffee shops, airports) are unencrypted and easily monitored. An attacker on the same network can intercept your traffic, including login credentials and email content.

- Always use the EdLight VPN when working remotely
- Avoid making sensitive transactions (banking, HR, access changes) on public Wi-Fi
- Use your phone's hotspot as an alternative to public Wi-Fi when a VPN is unavailable

### Browser Extensions

Browser extensions can be powerful, but they can also be malicious.

- Only install browser extensions that are approved by IT
- Remove any extensions you no longer use
- Do not install extensions from unofficial sources or pop-up prompts
    `,
    keyTakeaways: [
      "Always look for HTTPS before entering any data on a website.",
      "Do not ignore browser security warnings, they exist for a reason.",
      "Never download files from unknown or unexpected sources.",
      "Use the EdLight VPN whenever you're on public Wi-Fi.",
      "Only install IT-approved browser extensions.",
    ],
    realLifeExample: {
      title: "The Fake Software Update",
      scenario:
        "While browsing a news site, an employee saw a pop-up saying 'Your browser is out of date, click here to update.' They clicked and downloaded what appeared to be a browser update. It was actually malware that silently logged keystrokes, including their work credentials, for weeks.",
      lesson:
        "Legitimate browser updates come from the browser or your IT department, not from websites. Never download software from a pop-up prompt.",
    },
    questions: [
      {
        id: "q3-1",
        moduleId: "module-3",
        question: "A website shows a green padlock. This means it is safe to enter your work credentials.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation:
          "A padlock only means the connection is encrypted, not that the site is legitimate. Phishing sites can also use HTTPS.",
      },
      {
        id: "q3-2",
        moduleId: "module-3",
        question: "You're working from a hotel and need to access a company tool. What should you do?",
        type: "multiple_choice",
        options: [
          "Use the hotel Wi-Fi, it's password protected so it's safe",
          "Connect to EdLight VPN before accessing any company systems",
          "Use Incognito mode for extra protection",
          "Wait until you're back in the office",
        ],
        correctAnswer: "Connect to EdLight VPN before accessing any company systems",
        explanation:
          "Public Wi-Fi, even password-protected hotel Wi-Fi, is not secure. Always use the VPN to encrypt your traffic.",
      },
      {
        id: "q3-3",
        moduleId: "module-3",
        question: "A website you're visiting shows a browser security warning. What should you do?",
        type: "multiple_choice",
        options: [
          "Click 'Proceed anyway', it's probably a false alarm",
          "Close the page and do not continue",
          "Refresh the page once",
          "Disable the warning in browser settings",
        ],
        correctAnswer: "Close the page and do not continue",
        explanation:
          "Browser security warnings indicate a real risk, the site may have an invalid certificate or be known for malicious activity. Do not proceed.",
      },
      {
        id: "q3-4",
        moduleId: "module-3",
        question: "Which of these is the safest source for downloading a browser extension?",
        type: "multiple_choice",
        options: [
          "A pop-up on a news website",
          "A link shared in a group chat",
          "The IT-approved software list",
          "The extension's own official website",
        ],
        correctAnswer: "The IT-approved software list",
        explanation:
          "Only IT-approved extensions should be installed on company devices, regardless of the source.",
      },
      {
        id: "q3-5",
        moduleId: "module-3",
        question: "What does the padlock icon next to a website URL mean?",
        type: "multiple_choice",
        options: [
          "The site is verified safe",
          "The connection is encrypted with HTTPS",
          "The site has no malware",
          "The site is owned by a real company",
        ],
        correctAnswer: "The connection is encrypted with HTTPS",
        explanation:
          "The padlock only confirms that traffic is encrypted. The site itself can still be malicious, so always check the domain.",
      },
      {
        id: "q3-6",
        moduleId: "module-3",
        question: "Public Wi-Fi at a coffee shop is safe for accessing work systems as long as you trust the venue.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation:
          "Public Wi-Fi is shared and easy to spoof. Always use the company VPN before accessing work systems.",
      },
      {
        id: "q3-7",
        moduleId: "module-3",
        question: "A pop-up tells you your computer is infected and asks you to call a number. What should you do?",
        type: "multiple_choice",
        options: [
          "Call the number for help",
          "Close the browser and report it to IT",
          "Click the pop-up to scan your computer",
          "Restart your computer to fix it",
        ],
        correctAnswer: "Close the browser and report it to IT",
        explanation:
          "Scareware pop-ups are scams. Close the browser, don't call any number, and let IT take a look.",
      },
      {
        id: "q3-8",
        moduleId: "module-3",
        question: "Which of these is the safest way to download a file you need for work?",
        type: "multiple_choice",
        options: [
          "From the first search result",
          "From the official vendor website or company-approved source",
          "From a file-sharing forum",
          "From an email attachment",
        ],
        correctAnswer: "From the official vendor website or company-approved source",
        explanation:
          "Always download software from the official vendor or an IT-approved source to avoid malware-laced installers.",
      },
      {
        id: "q3-9",
        moduleId: "module-3",
        question: "Browser auto-fill can leak personal information to malicious websites.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Hidden form fields on attacker-controlled sites can capture saved auto-fill data without your knowledge.",
      },
      {
        id: "q3-10",
        moduleId: "module-3",
        question: "Which of these URLs is most likely safe to visit?",
        type: "multiple_choice",
        options: [
          "http://edlight-secure-login.ru",
          "https://edlight.org",
          "http://edlight.org.login-portal.xyz",
          "https://192.168.4.21/login",
        ],
        correctAnswer: "https://edlight.org",
        explanation:
          "The legitimate domain uses HTTPS and matches the company's exact domain. The others use lookalikes or raw IPs.",
      },
    ],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  {
    id: "module-4",
    title: "Company Access Policy",
    slug: "company-access-policy",
    description:
      "Understand EdLight's access control policies, how permissions work, and your responsibilities for safeguarding company systems.",
    order: 4,
    estimatedMinutes: 11,
    isActive: true,
    icon: "🏢",
    color: "purple",
    image: "/images/modules/company-access-policy.png",
    lectureContent: `
## EdLight Access Policy

Access control is one of the most important pillars of company security. Knowing what access you have, how to use it responsibly, and what to do when something feels wrong will significantly reduce the risk of a breach.

### The Principle of Least Privilege

EdLight follows the **principle of least privilege**, every employee should only have access to the tools, systems, and data they need to do their job. Nothing more.

This limits the damage that can occur if an account is compromised and reduces the risk of accidental data exposure.

### Your Access Responsibilities

- You are responsible for all activity performed under your account
- Never share your login credentials with teammates, even for convenience
- Do not use a colleague's account to access something you don't have permission for
- If you believe you need additional access, request it through the IT helpdesk

### Offboarding and Role Changes

When an employee leaves or changes roles:

- Access should be revoked or adjusted immediately
- Administrators are required to report departures or role changes to IT on the same day
- If you notice a former colleague still has active access, report it to IT

### Physical Access

Digital security extends to physical spaces:

- Do not let visitors, contractors, or unauthorized individuals follow you through secured doors (tailgating)
- Lock your workstation whenever you step away, even briefly
- Do not allow others to view your screen in sensitive areas
- Report any physical security concerns to facility management or IT

### Data Classification

EdLight classifies data into three levels:

**Public**, Information that can be shared externally (marketing materials, published announcements)

**Internal**, Information meant for employees only (internal policies, general communications)

**Confidential**, Sensitive information with restricted access (financial data, personal employee data, security configurations)

Never share Confidential data outside of authorized channels. When in doubt, treat it as Confidential.

### Device Management

- Only use company-approved devices to access company systems
- Personal devices may be used only if enrolled in Mobile Device Management (MDM) and approved by IT
- Do not install unauthorized software on company devices
    `,
    keyTakeaways: [
      "You should only have access to systems you need for your job, nothing more.",
      "Never share your credentials or use someone else's account.",
      "Report role changes and departures to IT immediately so access can be adjusted.",
      "Lock your workstation whenever you step away.",
      "Treat all EdLight data as Confidential unless explicitly classified otherwise.",
    ],
    realLifeExample: {
      title: "The Shared Login",
      scenario:
        "Two teammates shared login credentials to a shared reporting tool because requesting individual access 'took too long.' One employee left the company, but the account, still shared, remained active. A third party used those credentials months later to export sensitive company data.",
      lesson:
        "Shared accounts make accountability impossible. Each person must have individual credentials, and access must be revoked as soon as someone leaves.",
    },
    questions: [
      {
        id: "q4-1",
        moduleId: "module-4",
        question: "What does the 'principle of least privilege' mean?",
        type: "multiple_choice",
        options: [
          "Employees should have as much access as possible to work freely",
          "Employees should only have access to what they need for their role",
          "Only admins should have access to any company system",
          "Privileges should be shared to improve team efficiency",
        ],
        correctAnswer: "Employees should only have access to what they need for their role",
        explanation:
          "Least privilege limits exposure, if an account is compromised, attackers can only access a limited set of resources.",
      },
      {
        id: "q4-2",
        moduleId: "module-4",
        question: "A colleague is on vacation and asks you to log in to their account to complete an urgent task. What do you do?",
        type: "multiple_choice",
        options: [
          "Log in, it's an emergency and your colleague gave consent",
          "Refuse and escalate through proper IT or management channels",
          "Log in but only briefly",
          "Use your credentials but access their files directly",
        ],
        correctAnswer: "Refuse and escalate through proper IT or management channels",
        explanation:
          "Using someone else's account is a policy violation regardless of consent. Escalate through IT or a manager so the task can be handled legitimately.",
      },
      {
        id: "q4-3",
        moduleId: "module-4",
        question: "An employee resigned today. When should their system access be removed?",
        type: "multiple_choice",
        options: [
          "Within a week",
          "At the end of their notice period",
          "The same day, immediately",
          "After IT runs its monthly access review",
        ],
        correctAnswer: "The same day, immediately",
        explanation:
          "Access for departing employees must be revoked immediately to prevent unauthorized access after they leave.",
      },
      {
        id: "q4-4",
        moduleId: "module-4",
        question: "You step away from your desk for 5 minutes. What should you do?",
        type: "true_false",
        options: ["Lock your workstation", "Leave it, it's only 5 minutes"],
        correctAnswer: "Lock your workstation",
        explanation:
          "Even a brief absence is enough for someone to access sensitive information. Always lock your screen when stepping away.",
      },
      {
        id: "q4-5",
        moduleId: "module-4",
        question: "What is the principle of least privilege?",
        type: "multiple_choice",
        options: [
          "Give every employee admin rights for convenience",
          "Give people only the access they need to do their job",
          "Restrict all access until requested",
          "Share access with the entire team",
        ],
        correctAnswer: "Give people only the access they need to do their job",
        explanation:
          "Least privilege limits the damage of a compromised account by giving each person only the access required for their role.",
      },
      {
        id: "q4-6",
        moduleId: "module-4",
        question: "A coworker leaves the company. Their account access should be removed immediately.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Former employees should lose access on their last day to prevent unauthorized use of credentials.",
      },
      {
        id: "q4-7",
        moduleId: "module-4",
        question: "You need temporary access to a system you don't normally use. What's the right step?",
        type: "multiple_choice",
        options: [
          "Borrow a teammate's login",
          "Submit a formal access request to IT",
          "Ask a manager for their password",
          "Use a shared service account",
        ],
        correctAnswer: "Submit a formal access request to IT",
        explanation:
          "All access changes must go through IT so they can be audited and reversed if needed.",
      },
      {
        id: "q4-8",
        moduleId: "module-4",
        question: "A visitor in the office asks to use your computer for 'just one minute'. What should you do?",
        type: "multiple_choice",
        options: [
          "Let them, you'll watch over their shoulder",
          "Politely refuse and offer to help them another way",
          "Log them in with your credentials",
          "Step away and let them do it quickly",
        ],
        correctAnswer: "Politely refuse and offer to help them another way",
        explanation:
          "Anyone using your account can do anything you can. Never let someone else use your active session.",
      },
      {
        id: "q4-9",
        moduleId: "module-4",
        question: "Tailgating is when someone follows you through a secure door without using their own badge.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Tailgating is a physical security threat. Politely ask the person to badge in themselves or alert reception.",
      },
      {
        id: "q4-10",
        moduleId: "module-4",
        question: "You discover you have access to a system you don't actually need for your role. What should you do?",
        type: "multiple_choice",
        options: [
          "Keep it in case you need it later",
          "Report it to IT so the access can be removed",
          "Use it occasionally to stay familiar",
          "Share it with your team",
        ],
        correctAnswer: "Report it to IT so the access can be removed",
        explanation:
          "Excess access is a risk. Reporting it helps maintain least privilege and reduces your personal exposure.",
      },
    ],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  {
    id: "module-5",
    title: "Device and Network Security",
    slug: "device-and-network-security",
    description:
      "Learn how to secure your work devices, understand network threats, and follow best practices for keeping company equipment safe.",
    order: 5,
    estimatedMinutes: 13,
    isActive: true,
    icon: "🛡️",
    color: "green",
    image: "/images/modules/device-and-network-security.png",
    lectureContent: `
## Securing Your Devices and Networks

Your work devices, laptop, phone, tablet, are gateways to all of EdLight's systems and data. Keeping them secure is one of the most important things you can do as an employee.

### Keep Software Updated

Software updates often contain critical security patches that fix known vulnerabilities. Attackers actively exploit systems that haven't been updated.

- Always install operating system and application updates promptly
- Enable automatic updates where possible
- Do not delay or dismiss security updates
- Contact IT if an update causes issues instead of ignoring it

### Disk Encryption

Every company device must have disk encryption enabled (e.g., FileVault on Mac, BitLocker on Windows). Encryption ensures that if a device is lost or stolen, the data on it cannot be read.

- Verify your device has encryption enabled in system settings
- Report lost or stolen devices to IT within 1 hour
- IT can remotely wipe a lost device if encryption and MDM are active

### Physical Device Security

- Never leave your laptop unattended in a public place
- Use a laptop lock when working in shared spaces
- Do not leave a device in a visible location inside your car
- If you must travel with a device, keep it in carry-on luggage, never in checked bags
- Use a privacy screen in public spaces to prevent shoulder surfing

### Network Security

**Company Network**
The office network is managed and monitored by IT. It's the safest place to work from.

**Home Network**
- Use a strong, unique Wi-Fi password, not the default from the router
- Keep your router firmware updated
- Use WPA3 or WPA2 encryption on your home network
- Consider a separate network for smart home devices

**Public Wi-Fi**
- Treat all public networks as untrusted
- Always use the EdLight VPN on public networks
- Avoid accessing sensitive systems unless absolutely necessary

### USB and External Devices

- Never plug an unknown USB drive into a company device
- Attackers plant USB drives in parking lots and public spaces knowing curious people will plug them in
- Only use company-approved external storage devices
- Report any found USB drives to IT, do not plug them in to check what's on them

### Antivirus and Endpoint Protection

- Company devices must have IT-managed endpoint protection installed
- Do not disable or bypass security software for any reason
- Report unusual device behavior (slowness, unexpected activity) to IT immediately
    `,
    keyTakeaways: [
      "Always install software and OS updates promptly, they fix critical security vulnerabilities.",
      "Ensure your work device has disk encryption enabled.",
      "Report lost or stolen devices to IT within 1 hour.",
      "Use the EdLight VPN on any non-office network.",
      "Never plug an unknown USB device into a company computer.",
    ],
    realLifeExample: {
      title: "The Airport USB Drive",
      scenario:
        "An employee found a USB drive in an airport lounge with a 'Confidential Salary Data' label. Curious, they plugged it into their work laptop to see what it contained. The drive automatically installed malware that gave attackers remote access to the laptop, and through it, the company's internal systems.",
      lesson:
        "Attackers deliberately label USB drives with enticing labels and leave them in high-traffic areas. Never plug in a device you didn't prepare yourself.",
    },
    questions: [
      {
        id: "q5-1",
        moduleId: "module-5",
        question: "You find a USB drive labeled 'Q4 Financials' in the office parking lot. What do you do?",
        type: "multiple_choice",
        options: [
          "Plug it into your laptop to find the owner",
          "Leave it where it is",
          "Hand it to IT without plugging it in",
          "Plug it into a personal device instead",
        ],
        correctAnswer: "Hand it to IT without plugging it in",
        explanation:
          "Found USB drives should be turned over to IT. They may contain malware designed to run as soon as they're plugged in.",
      },
      {
        id: "q5-2",
        moduleId: "module-5",
        question: "Your laptop shows a software update is available. When should you install it?",
        type: "multiple_choice",
        options: [
          "Next time you have a free week",
          "Only if IT tells you to",
          "As soon as possible, updates often contain critical security patches",
          "Never, updates can break things",
        ],
        correctAnswer: "As soon as possible, updates often contain critical security patches",
        explanation:
          "Updates fix known vulnerabilities. Delayed updates leave your device exposed to attacks that exploit those vulnerabilities.",
      },
      {
        id: "q5-3",
        moduleId: "module-5",
        question: "Your company laptop is stolen. How long do you have to report it to IT?",
        type: "multiple_choice",
        options: ["24 hours", "1 week", "1 hour", "The next business day"],
        correctAnswer: "1 hour",
        explanation:
          "Stolen devices must be reported within 1 hour so IT can remotely wipe the device before data is accessed.",
      },
      {
        id: "q5-4",
        moduleId: "module-5",
        question: "Disk encryption protects data on a lost or stolen device.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Disk encryption ensures that even if a device is physically stolen, the data cannot be read without the decryption key.",
      },
      {
        id: "q5-5",
        moduleId: "module-5",
        question: "You find a USB drive in the office parking lot. What should you do?",
        type: "multiple_choice",
        options: [
          "Plug it in to find the owner",
          "Take it home to check it on your personal laptop",
          "Hand it to IT or security without plugging it in",
          "Leave it where you found it",
        ],
        correctAnswer: "Hand it to IT or security without plugging it in",
        explanation:
          "Dropped USB drives are a common attack technique. Never plug an unknown drive into any computer.",
      },
      {
        id: "q5-6",
        moduleId: "module-5",
        question: "A VPN protects your traffic from being read on an untrusted network.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "A VPN encrypts your traffic between your device and the company network, even on hostile Wi-Fi.",
      },
      {
        id: "q5-7",
        moduleId: "module-5",
        question: "Your work laptop offers a system update. What's the right thing to do?",
        type: "multiple_choice",
        options: [
          "Postpone it indefinitely",
          "Install it during a convenient time, ideally that day",
          "Wait until IT installs it for you",
          "Ignore the prompt",
        ],
        correctAnswer: "Install it during a convenient time, ideally that day",
        explanation:
          "Security patches close active vulnerabilities. Install updates promptly to keep your device protected.",
      },
      {
        id: "q5-8",
        moduleId: "module-5",
        question: "Bluetooth should be turned off when you don't need it on a work device.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Open Bluetooth radios can be probed and exploited. Disable wireless services you don't actively use.",
      },
      {
        id: "q5-9",
        moduleId: "module-5",
        question: "You're on a video call in a coffee shop. What's the most important precaution?",
        type: "multiple_choice",
        options: [
          "Use noise-cancelling headphones",
          "Turn on the company VPN and use a privacy screen",
          "Speak quietly",
          "Avoid sharing your screen",
        ],
        correctAnswer: "Turn on the company VPN and use a privacy screen",
        explanation:
          "VPN protects the network, and a privacy screen prevents shoulder-surfing of sensitive information.",
      },
      {
        id: "q5-10",
        moduleId: "module-5",
        question: "Personal apps installed on a work device can introduce security risks.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation:
          "Untrusted apps can include trackers, malware, or vulnerabilities. Stick to the IT-approved software list.",
      },
    ],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

export function getModuleBySlug(slug: string): TrainingModule | undefined {
  return modules.find((m) => m.slug === slug);
}

export const totalModules = modules.length;
