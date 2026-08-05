const initialData = {
  author: {
    name: "Elyssa Contreras",
    nickname: "EL",
    title: "IT Student",
    school: "Father Saturnino Urios University",
    yearLevel: "3rd Year",
    email: "ely.admin@elysblog.com",
    bio: "Hi! I'm a 3rd-year BSIT student at Father Saturnino Urios University who is passionate about designing and developing websites. Alongside web development, I aim to expand my knowledge of cybersecurity to better understand how to build secure and reliable applications. Through this blog, I share my knowledge, projects, experiences, and reflections as I continue exploring the ever-evolving world of technology, web development, and cybersecurity.",
    facebook: "facebook.com/elycontz",
    github: "github.com/elypie",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  },
  categories: [
    { id: 1, name: "Information Assurance", count: 8, color: "#E55B44" },
    { id: 2, name: "Organizational Context", count: 6, color: "#F59E0B" },
    { id: 3, name: "Computing Ethics", count: 5, color: "#8B5CF6" },
    { id: 4, name: "Data Privacy", count: 3, color: "#3B82F6" },
    { id: 5, name: "Security Principles", count: 1, color: "#10B981" },
    { id: 6, name: "Others", count: 1, color: "#6B7280" }
  ],
  posts: [
    {
      id: 1,
      title: "Built in 72 Hours, Broken in One Click: A Security Post-Mortem",
      slug: "built-in-72-hours-broken-in-one-click-a-security-post-mortem",
      category: "Information Assurance",
      status: "Published",
      date: "Aug 5, 2026",
      readTime: "8 min read",
      author: "Ely",
      featured: true,
      isLatest: true,
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
      summary: "A technical blog post on secure design principles, AI-generated code, and developer obligations under Republic Act No. 10173.",
      toc: [
        { id: "intro", text: "I. Introduction" },
        { id: "vulnerabilities", text: "II. What Went Wrong: The Vulnerabilities" },
        { id: "immediate-steps", text: "III. Immediate Steps: What To Do First" },
        { id: "long-term-solutions", text: "IV. Rebuilding It Right: Long-Term Solutions" },
        { id: "ai-code-problem", text: "V. The Problem with AI-Generated Code" },
        { id: "conclusion", text: "VI. Conclusion" },
        { id: "references", text: "References" }
      ],
      content: `
        <p style="font-style: italic; color: var(--text-muted); margin-bottom: 24px; font-size: 16px;">A technical blog post on secure design principles, AI-generated code, and developer obligations under Republic Act No. 10173.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="intro">I. Introduction</h3>
        <p>Artificial Intelligence has changed the way software is developed. Today, developers can build working applications in hours instead of weeks using AI coding tools such as Copilot, ChatGPT, Cursor, and other code generation tools. While this makes application development faster and more efficient, speed comes with risks that many developers tend to overlook. When developers focus primarily on making an application work, security is often left out of the development process.</p>

        <p>The university case demonstrates exactly why this mindset is risky. Three students successfully created a web and mobile platform for managing student organizations in less than 72 hours using AI coding tools. The platform handled real, sensitive data such as the full names, student numbers, phone numbers, payment screenshots, and uploaded ID photos of hundreds of students. It won a hackathon prize and was quickly adopted by more than a dozen organizations.</p>

        <p>Then, a student discovered something alarming. By simply changing the number at the end of a URL—from <code>/profile/1048</code> to <code>/profile/1049</code>—they could view a complete stranger's profile, including their ID photo. No technical skills were required. Shortly afterward, the project's public GitHub repository was found to contain the database password and payment API key in plain text. The application was taken offline that same afternoon.</p>

        <p>This article examines what went wrong, how the incident should have been handled, and how the system could have been designed more securely from the beginning, based on Secure Design Principles and developers' responsibilities under Republic Act No. 10173.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="vulnerabilities">II. What Went Wrong: The Vulnerabilities</h3>
        <p>To understand how to fix the problem, it is important to first identify what the actual vulnerabilities were.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">1. Insecure Direct Object Reference (IDOR)</h4>
        <p>The app used sequential numbers in the URL to identify user profiles. The server never verified whether the person making the request was actually authorized to view that record. Anyone could access any profile just by changing that number.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">2. Credentials Exposed in a Public Repository</h4>
        <p>The database password and payment API key were committed directly into the source code and pushed to a public GitHub repository. Even if deleted later, Git preserves its full commit history — meaning those credentials remained accessible to anyone who looked.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">3. Overprivileged Database Access</h4>
        <p>Every user account had broad read access to the database. There was no segmentation based on role or record ownership, which meant one compromised account could expose everyone's data.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">4. Verbose Error Messages</h4>
        <p>When errors occurred, the app returned full stack traces to any user who triggered them. Stack traces expose internal application details that attackers can use to find further vulnerabilities.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">5. No HTTPS</h4>
        <p>The application ran on plain HTTP, meaning all data sent between users and the server was transmitted without encryption and could be intercepted.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">6. Security Through Obscurity</h4>
        <p>The team assumed that since most users would not know the internal URL structure, no one would look for vulnerabilities. This is not a security strategy — it is simply the absence of one.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="immediate-steps">III. Immediate Steps: What To Do First</h3>
        <p>When a security issue of this scale is discovered, the first priority is damage control. The following actions should be taken right away, along with the Secure Design Principle each one restores.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">A. Take the Application Offline</h4>
        <p>The moment an active vulnerability is confirmed, the system should be shut down. Running an application that is actively exposing user data — even temporarily — is not an acceptable risk.</p>
        <p><strong>Principle Restored: Fail Securely.</strong> When a system can no longer protect its users, it should default to being inaccessible rather than staying open. The safer outcome must always be the default.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">B. Rotate All Exposed Credentials</h4>
        <p>Every compromised secret — database passwords, API keys, session tokens — must be invalidated and replaced immediately. Even without confirmed evidence of exploitation, it is safest to assume the worst.</p>
        <p><strong>Principles Restored: Least Privilege and Defense in Depth.</strong> Revoking exposed credentials limits the potential damage and ensures that one leaked secret does not cascade into a full system compromise.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">C. Remove Secrets from Git History</h4>
        <p>Deleting a file from the current version of a repository does not remove it from Git's history. Tools such as <code>git filter-repo</code> or BFG Repo Cleaner can permanently rewrite the history to remove sensitive values. After doing so, the repository must be force-pushed and all collaborators must re-clone it.</p>
        <p><strong>Principle Restored: Reduction of Attack Surface.</strong> Historical commits are a persistent and often overlooked source of credential leaks. Cleaning the history eliminates that exposure entirely.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">D. Notify Affected Users and the National Privacy Commission</h4>
        <p>Under Section 20(f) of Republic Act No. 10173 (the Data Privacy Act of 2012), personal information controllers are legally required to notify both the National Privacy Commission and affected data subjects within 72 hours of discovering a breach likely to result in serious harm. The unauthorized exposure of student ID photos, numbers, and contact details through an open URL clearly meets this threshold.</p>
        <p>Notifications must be honest and specific — explaining what data was exposed, the timeframe of exposure, and the steps being taken to address the situation. Failing to notify is not only a legal violation under RA 10173 but also a serious breach of the trust that users placed in the platform.</p>
        <p><strong>Principle Restored: Accountability.</strong> As developers and data handlers, we are answerable to the people whose data we manage. Transparency after an incident is both a legal requirement and an ethical obligation.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">E. Audit Access Logs</h4>
        <p>Before going fully offline, all available server logs should be preserved and reviewed. The audit should check for signs that the IDOR vulnerability was exploited beyond the one incident that was observed — such as rapid sequential requests or access from unrecognized sources.</p>
        <p><strong>Principle Restored: Auditability.</strong> A secure system must be capable of answering what happened, when, and to whom. Without logs, the true scope of an incident cannot be determined.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="long-term-solutions">IV. Rebuilding It Right: Long-Term Solutions</h3>
        <p>Containment stops the immediate harm. Rebuilding the system with proper security in place prevents it from happening again.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">A. Enforce Authorization on Every Request</h4>
        <p>The root fix for IDOR is to verify, on every server request, whether the authenticated user is actually authorized to access the specific record being requested. This must happen at the server level — not just at login, and not just in the front end.</p>
        <p>A good additional measure is to replace sequential integer IDs with non-guessable identifiers such as UUIDs, making unauthorized access harder even if an authorization check is missed.</p>
        <p><strong>Principle Restored: Complete Mediation.</strong> Every access to every resource must pass through an authorization check, without exception.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">B. Implement Role-Based Access Control (RBAC)</h4>
        <p>Different users need different levels of access. Regular members should not be able to view other members' payment records. Officers should only manage the groups they are assigned to. These distinctions need to be enforced at the data layer, not just visually in the interface.</p>
        <p><strong>Principle Restored: Least Privilege.</strong> Each user should only have access to what their role genuinely requires — nothing beyond that.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">C. Keep Secrets Outside the Codebase</h4>
        <p>Passwords, API keys, and other sensitive configuration values must never live inside source code. They should be stored in environment variables or a dedicated secret management service, and version control must exclude them from the start using a <code>.gitignore</code> file.</p>
        <p><strong>Principle Restored: Separation of Concerns.</strong> Configuration and code serve different purposes and must be managed separately to avoid exposing sensitive values through the repository.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">D. Enforce HTTPS</h4>
        <p>Any application that processes personal data must encrypt data in transit. HTTPS prevents interception at the network level and is a basic requirement for any production system. Free SSL certificates are available through services like Let's Encrypt, so there is no reasonable excuse for running a user-facing platform over plain HTTP.</p>
        <p><strong>Principle Restored: Defense in Depth.</strong> Transport layer encryption is one of several independent layers of protection that together make a system significantly more difficult to attack.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">E. Handle Errors Safely in Production</h4>
        <p>In a live environment, detailed error messages such as stack traces should never be visible to users. Instead, a generic message should be shown to the user while the full technical details are logged privately for the development team.</p>
        <p><strong>Principle Restored: Fail Securely.</strong> When something goes wrong, the system should disclose as little as possible externally while preserving full diagnostic detail internally.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">F. Apply Data Minimization</h4>
        <p>Republic Act No. 10173 requires developers to collect only the personal data that is truly necessary for the platform's stated purpose, and to retain it only for as long as needed. If uploaded ID photos are used only for initial verification, they should not be stored indefinitely. If phone numbers serve no functional purpose, they should not be collected at all. These decisions should be made before building the feature — not after a breach has already occurred.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="ai-code-problem">V. The Problem with AI-Generated Code</h3>
        <p>The AI coding assistant used in this case produced functional, working code — which is exactly what it was designed to do. However, working code and secure code are not the same thing. AI tools are optimized to generate code that runs correctly under expected conditions. They do not consistently enforce authorization checks, validate user inputs, or handle errors in a secure way.</p>
        <p>This means that developers who rely on AI-generated code still carry full responsibility for reviewing it. Under Republic Act No. 10173, the developers who deployed this system are the personal information controllers. "The AI wrote it" is not a recognized legal defense. The responsibility for protecting user data belongs to whoever made the decision to deploy the system.</p>
        <p>AI tools are useful, but they should never be treated as a substitute for security awareness and code review.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="conclusion">VI. Conclusion</h3>
        <p>Speed in software development is a genuine advantage. Shipping quickly, gathering user feedback, and improving through iteration are all legitimate and effective strategies. The students who built this platform had good intentions, and building a working prototype in 72 hours was an impressive achievement.</p>
        <p>But the moment real people began uploading their personal data to the platform, the situation changed. Those users became data subjects with rights under Republic Act No. 10173, and the developers became personal information controllers with legal obligations to protect them.</p>
        <p>When security is treated as something to deal with later, it is not the developers who bear the consequences — it is the users. In this case, hundreds of students never agreed to have their personal information stored in an unsecured system. They trusted the platform, and that trust was not upheld.</p>
        <p>Security is not a feature to be added after launch. It is a responsibility that begins the moment a system is designed to hold someone else's data. Building fast is a choice. Building responsibly is an obligation.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="references">References</h3>
        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6;">Republic Act No. 10173 — Data Privacy Act of 2012 (Philippines); OWASP Top 10 (2021); OWASP Secure Design Principles; NIST Special Publication 800-53.</p>
      `
    }
  ]
};

// LocalStorage Persistence Helper
function getBlogData() {
  const saved = localStorage.getItem('elys_blog_data');
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      // Ensure categories exist but allow empty posts array
      if (!parsed.posts) parsed.posts = [];
      return parsed;
    } catch(e) {}
  }
  localStorage.setItem('elys_blog_data', JSON.stringify(initialData));
  return initialData;
}

function saveBlogData(data) {
  localStorage.setItem('elys_blog_data', JSON.stringify(data));
}

// Auto-reset helper for clean slate
localStorage.setItem('elys_blog_data', JSON.stringify(initialData));
