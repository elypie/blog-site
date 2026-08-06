const initialData = {
  author: {
    name: "Elyssa Contreras",
    fullName: "Ma. Elyssa Beda D. Contreras",
    nickname: "EL",
    role: "BSIT 3rd Year Student",
    course: "BS Information Technology",
    school: "Father Saturnino Urios University",
    yearLevel: "3rd Year",
    motto: "instructor by name, self-study by experience",
    email: "ely.admin@elysblog.com",
    bio: "Hi! I'm a 3rd-year BSIT student at Father Saturnino Urios University who is passionate about designing and developing websites. Alongside web development, I aim to expand my knowledge of cybersecurity to better understand how to build secure and reliable applications. Through this blog, I share my knowledge, projects, experiences, and reflections as I continue exploring the ever-evolving world of technology, web development, and cybersecurity.",
    facebook: "https://facebook.com/elycontz",
    github: "https://github.com/elypie",
    instagram: "https://instagram.com/_beymm",
    avatarUrl: "assets/images/profile/profile-pfp.jpg",
    coverUrl: "assets/images/profile/profile-cover.png"
  },
  categories: [
    { id: 1, name: "Information Assurance", count: 1, color: "#E55B44" },
    { id: 2, name: "Organizational Context", count: 0, color: "#F59E0B" },
    { id: 3, name: "Computing Ethics", count: 0, color: "#8B5CF6" },
    { id: 4, name: "Data Privacy", count: 0, color: "#3B82F6" },
    { id: 5, name: "Security Principles", count: 0, color: "#10B981" },
    { id: 6, name: "Others", count: 0, color: "#6B7280" }
  ],
  posts: [
    {
      id: 1,
      title: "Fast, But at What Cost? A Security Post-Mortem of an AI-Generated Application",
      slug: "built-in-72-hours-broken-in-one-click-a-security-post-mortem",
      category: "Information Assurance",
      status: "Published",
      date: "Aug 5, 2026",
      readTime: "6 min read",
      author: "Elyssa",
      featured: true,
      isLatest: true,
      coverImage: "assets/images/posts/post1-cover.png",
      summary: "A technical blog post on secure design principles, AI-generated code, and developer obligations under Republic Act No. 10173.",
      toc: [
        { id: "intro", text: "I. Introduction" },
        { 
          id: "what-went-wrong", 
          text: "II. What Went Wrong: The Vulnerabilities",
          children: [
            { id: "vuln-1", text: "1. Insecure Direct Object Reference (IDOR)" },
            { id: "vuln-2", text: "2. Credentials Exposed in Public Repo" },
            { id: "vuln-3", text: "3. Overprivileged Database Access" },
            { id: "vuln-4", text: "4. Verbose Error Messages" },
            { id: "vuln-5", text: "5. No HTTPS" },
            { id: "vuln-6", text: "6. Security Through Obscurity" }
          ]
        },
        { 
          id: "immediate-steps", 
          text: "III. Immediate Steps: What To Do First",
          children: [
            { id: "step-a", text: "A. Take Application Offline" },
            { id: "step-b", text: "B. Rotate Exposed Credentials" },
            { id: "step-c", text: "C. Remove Secrets from Git" },
            { id: "step-d", text: "D. Notify Affected Users & NPC" },
            { id: "step-e", text: "E. Audit Access Logs" }
          ]
        },
        { 
          id: "rebuilding-it-right", 
          text: "IV. Rebuilding It Right: Long-Term Solutions",
          children: [
            { id: "long-1", text: "1. Enforce Authorization on Every Request" },
            { id: "long-2", text: "2. Implement Role-Based Access Control" },
            { id: "long-3", text: "3. Keep Secrets Outside Codebase" },
            { id: "long-4", text: "4. Enforce HTTPS" },
            { id: "long-5", text: "5. Handle Errors Safely" },
            { id: "long-6", text: "6. Apply Data Minimization" }
          ]
        },
        { id: "ai-generated-code", text: "V. The Problem with AI-Generated Code" },
        { id: "conclusion", text: "VI. Conclusion" },
        { id: "references", text: "References" }
      ],
      content: `
        <h2 id="intro">I. Introduction</h2>
        <p>Artificial Intelligence has changed the way software is developed. Today, developers can build working applications in hours instead of weeks using AI coding tools such as Copilot, ChatGPT, Cursor, and other code generation tools. While this makes application development faster and more efficient, speed comes with risks that many developers tend to overlook. When developers focus primarily on making an application work, security is often left out of the development process.</p>

        <p>The university case demonstrates exactly why this mindset is risky. Three students successfully created a web and mobile platform for managing student organizations in less than 72 hours using AI coding tools. The platform handled real, sensitive data such as the full names, student numbers, phone numbers, payment screenshots, and uploaded ID photos of hundreds of students. It won a hackathon prize and was quickly adopted by more than a dozen organizations.</p>

        <p>Then, a student discovered something alarming. By simply changing the number at the end of a URL—from <code>/profile/1048</code> to <code>/profile/1049</code>—they could view a complete stranger's profile, including their ID photo. No technical skills were required. Shortly afterward, the project's public GitHub repository was found to contain the database password and payment API key in plain text. The application was taken offline that same afternoon.</p>

        <p>This article examines what went wrong, how the incident should have been handled, and how the system could have been designed more securely from the beginning, based on Secure Design Principles and developers' responsibilities under Republic Act No. 10173.</p>

        <hr style="margin: 36px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h2 id="what-went-wrong">II. What Went Wrong: The Vulnerabilities</h2>
        <p>To understand how to fix the problem, it is important to first identify what the actual vulnerabilities were.</p>

        <h4 id="vuln-1">1. Insecure Direct Object Reference (IDOR)</h4>
        <p>The app used sequential numbers in the URL to identify user profiles. The server never verified whether the person making the request was actually authorized to view that record. Anyone could access any profile just by changing that number.</p>

        <h4 id="vuln-2">2. Credentials Exposed in a Public Repository</h4>
        <p>The database password and payment API key were committed directly into the source code and pushed to a public GitHub repository. Even if deleted later, Git preserves its full commit history—meaning those credentials remained accessible to anyone who looked.</p>

        <h4 id="vuln-3">3. Overprivileged Database Access</h4>
        <p>Every user account had broad read access to the database. There was no segmentation based on role or record ownership, which meant one compromised account could expose everyone's data.</p>

        <h4 id="vuln-4">4. Verbose Error Messages</h4>
        <p>When errors occurred, the app returned full stack traces to any user who triggered them. Stack traces expose internal application details that attackers can use to find further vulnerabilities.</p>

        <h4 id="vuln-5">5. No HTTPS</h4>
        <p>The application ran on plain HTTP, meaning all data sent between users and the server was transmitted without encryption and could be intercepted.</p>

        <h4 id="vuln-6">6. Security Through Obscurity</h4>
        <p>The team assumed that since most users would not know the internal URL structure, no one would look for vulnerabilities. This is not a security strategy—it is simply the absence of one.</p>

        <hr style="margin: 36px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h2 id="immediate-steps">III. Immediate Steps: What To Do First</h2>
        <p>When a security issue of this scale is discovered, the first priority is damage control. The following actions should be taken right away, along with the Secure Design Principle each one restores.</p>

        <h3 id="step-a">A. Take the Application Offline</h3>
        <p>The moment an active vulnerability is confirmed, the system should be shut down. Running an application that is actively exposing user data—even temporarily—is not an acceptable risk.</p>
        <blockquote style="padding: 14px 20px; border-left: 4px solid var(--accent-coral); background: rgba(165, 21, 12, 0.05); margin: 16px 0 24px 0; border-radius: 0 10px 10px 0; color: var(--text-main);">
          <strong style="color: var(--accent-coral);">Principle Restored:</strong> <strong>Fail Securely.</strong> When a system can no longer protect its users, it should default to being inaccessible rather than staying open. The safer outcome must always be the default.
        </blockquote>

        <h3 id="step-b">B. Rotate All Exposed Credentials</h3>
        <p>Every compromised secret—database passwords, API keys, session tokens—must be invalidated and replaced immediately. Even without confirmed evidence of exploitation, it is safest to assume the worst.</p>
        <blockquote style="padding: 14px 20px; border-left: 4px solid var(--accent-coral); background: rgba(165, 21, 12, 0.05); margin: 16px 0 24px 0; border-radius: 0 10px 10px 0; color: var(--text-main);">
          <strong style="color: var(--accent-coral);">Principles Restored:</strong> <strong>Least Privilege</strong> and <strong>Defense in Depth.</strong>
        </blockquote>

        <h3 id="step-c">C. Remove Secrets from Git History</h3>
        <p>Deleting a file from the current version of a repository does not remove it from Git's history. Tools such as <code>git filter-repo</code> or BFG Repo Cleaner can permanently rewrite the history to remove sensitive values. After doing so, the repository must be force-pushed and all collaborators must re-clone it.</p>
        <blockquote style="padding: 14px 20px; border-left: 4px solid var(--accent-coral); background: rgba(165, 21, 12, 0.05); margin: 16px 0 24px 0; border-radius: 0 10px 10px 0; color: var(--text-main);">
          <strong style="color: var(--accent-coral);">Principle Restored:</strong> <strong>Reduction of Attack Surface.</strong>
        </blockquote>

        <h3 id="step-d">D. Notify Affected Users and the National Privacy Commission</h3>
        <p>Under Section 20(f) of Republic Act No. 10173 (the Data Privacy Act of 2012), personal information controllers are legally required to notify both the National Privacy Commission and affected data subjects within 72 hours of discovering a breach likely to result in serious harm. The unauthorized exposure of student ID photos, numbers, and contact details through an open URL clearly meets this threshold.</p>
        <p>Notifications must be honest and specific—explaining what data was exposed, the timeframe of exposure, and the steps being taken to address the situation. Failing to notify is not only a legal violation under RA 10173 but also a serious breach of the trust that users placed in the platform.</p>
        <blockquote style="padding: 14px 20px; border-left: 4px solid var(--accent-coral); background: rgba(165, 21, 12, 0.05); margin: 16px 0 24px 0; border-radius: 0 10px 10px 0; color: var(--text-main);">
          <strong style="color: var(--accent-coral);">Principle Restored:</strong> <strong>Accountability.</strong>
        </blockquote>

        <h3 id="step-e">E. Audit Access Logs</h3>
        <p>Before going fully offline, all available server logs should be preserved and reviewed. The audit should check for signs that the IDOR vulnerability was exploited beyond the one incident that was observed, such as rapid sequential requests or access from unrecognized sources.</p>
        <blockquote style="padding: 14px 20px; border-left: 4px solid var(--accent-coral); background: rgba(165, 21, 12, 0.05); margin: 16px 0 24px 0; border-radius: 0 10px 10px 0; color: var(--text-main);">
          <strong style="color: var(--accent-coral);">Principle Restored:</strong> <strong>Auditability.</strong>
        </blockquote>

        <hr style="margin: 36px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h2 id="rebuilding-it-right">IV. Rebuilding It Right: Long-Term Solutions</h2>

        <h4 id="long-1">1. Enforce Authorization on Every Request</h4>
        <p>Instead of relying on URL obscurity or client-side validation, every backend API endpoint must verify that the authenticated user has explicit permission to access the requested resource. UUIDs or non-sequential identifiers should replace sequential database IDs, and session tokens must be validated against resource ownership before returning any sensitive records.</p>

        <h4 id="long-2">2. Implement Role-Based Access Control (RBAC)</h4>
        <p>Access permissions must be structured around explicit user roles (e.g., student, organization officer, administrator). Database queries and API permissions should strictly enforce the Principle of Least Privilege so that normal users cannot execute administrative actions or inspect records belonging to other users.</p>

        <h4 id="long-3">3. Keep Secrets Outside the Codebase</h4>
        <p>Sensitive credentials, API keys, and database passwords must never be stored directly in source code or committed to repository tracking. Use environment variables (managed via <code>.gitignore</code>) and dedicated secrets management solutions (such as HashiCorp Vault or cloud secret managers) to inject credentials dynamically at runtime.</p>

        <h4 id="long-4">4. Enforce HTTPS</h4>
        <p>All communication between clients and servers must be encrypted using Transport Layer Security (TLS/HTTPS). Plain HTTP requests should automatically redirect to HTTPS with HTTP Strict Transport Security (HSTS) enabled, preventing attackers on public networks from eavesdropping on session tokens, credentials, or personal data.</p>

        <h4 id="long-5">5. Handle Errors Safely in Production</h4>
        <p>Detailed stack traces, raw SQL queries, and internal system file paths must never be exposed to end users. In production, applications must catch runtime exceptions gracefully, log technical details securely to internal log management systems, and present generic, user-friendly error messages to the client (Economy of Mechanism).</p>

        <h4 id="long-6">6. Apply Data Minimization</h4>
        <p>Collect, process, and retain only the minimum amount of personal data strictly necessary for the platform's functionality. Unnecessary ID photos or excessive payment details should not be stored longer than required, minimizing overall impact and vulnerability exposure in the event of a system breach.</p>

        <hr style="margin: 36px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h2 id="ai-generated-code">V. The Problem with AI-Generated Code</h2>
        <p>AI coding tools excel at generating functional boilerplate code rapidly, but they do not automatically audit for security. Code assistants prioritize solving the immediate syntax and logical task specified in a prompt, often omitting authorization checks, input sanitization, or secure credential handling unless explicitly commanded to include them.</p>
        <p>Developers who rely uncritically on AI-generated code risk deploying vulnerable patterns into production. AI tools must be treated as productivity assistants, not as substitutes for secure software engineering, rigorous peer review, and continuous security testing.</p>

        <hr style="margin: 36px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h2 id="conclusion">VI. Conclusion</h2>
        <p>Developing applications at high speed with modern AI tools opens incredible opportunities for innovation, but rapid deployment can never justify compromising user privacy or application security. A secure-by-design mindset, proactive risk mitigation, and compliance with privacy frameworks like Republic Act No. 10173 must be integrated into every stage of software development.</p>
        <div class="concluding-quote-card">
          <div class="quote-icon-wrap">
            <svg viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          </div>
          <p class="concluding-quote-text">
            "Building fast is a choice. Building responsibly is an obligation."
          </p>
        </div>

        <hr style="margin: 36px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h4 id="references" style="font-size: 16px; font-weight: 800; font-family: var(--font-heading); margin-top: 32px; margin-bottom: 8px; border-bottom: none;">References</h4>
        <p class="references-text" style="font-size: 13.5px; color: var(--text-muted); line-height: 1.6; margin-top: 0;">Republic Act No. 10173 — Data Privacy Act of 2012 (Philippines), OWASP Top 10 (2021), OWASP Secure Design Principles, NIST Special Publication 800-53.</p>
      `
    }
  ]
};

// LocalStorage Persistence Helper (Fallback)
function getBlogData() {
  const saved = localStorage.getItem('elys_blog_data');
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      if (!parsed.posts || parsed.posts.length === 0) {
        parsed.posts = initialData.posts;
      } else {
        // Sync post #1 if updated in initialData
        initialData.posts.forEach(initPost => {
          const idx = parsed.posts.findIndex(p => p.id === initPost.id);
          if (idx !== -1) {
            parsed.posts[idx] = initPost;
          } else {
            parsed.posts.push(initPost);
          }
        });
      }
      localStorage.setItem('elys_blog_data', JSON.stringify(parsed));
      return parsed;
    } catch(e) {}
  }
  localStorage.setItem('elys_blog_data', JSON.stringify(initialData));
  return initialData;
}

function saveBlogData(data) {
  localStorage.setItem('elys_blog_data', JSON.stringify(data));
}

// Sync default initialData to localStorage on script load
localStorage.setItem('elys_blog_data', JSON.stringify(getBlogData()));

// --- ASYNCHRONOUS SUPABASE DATA ADAPTER ---

async function getBlogDataAsync(forAdmin = false) {
  if (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
    const posts = forAdmin 
      ? await fetchAllPostsFromSupabase() 
      : await fetchPublishedPostsFromSupabase();
    
    const categories = await fetchCategoriesFromSupabase();

    if (posts !== null) {
      const data = {
        author: initialData.author,
        categories: (categories && categories.length > 0) ? categories : initialData.categories,
        posts: posts
      };

      // Seed initial posts to Supabase DB if database table is completely empty
      if (posts.length === 0 && initialData.posts.length > 0 && forAdmin) {
        for (const post of initialData.posts) {
          try {
            await createPostInSupabase(post);
          } catch(e) {}
        }
        const seededPosts = await fetchAllPostsFromSupabase();
        if (seededPosts) data.posts = seededPosts;
      }

      saveBlogData(data);
      return data;
    }
  }

  // Fallback to local storage if Supabase is not configured or offline
  return getBlogData();
}

async function savePostAsync(post, isEdit = false) {
  if (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
    if (isEdit && post.id) {
      return await updatePostInSupabase(post.id, post);
    } else {
      return await createPostInSupabase(post);
    }
  }

  // Fallback to local storage
  const data = getBlogData();
  if (isEdit && post.id) {
    const idx = data.posts.findIndex(p => String(p.id) === String(post.id));
    if (idx !== -1) {
      data.posts[idx] = { ...data.posts[idx], ...post };
    } else {
      data.posts.unshift(post);
    }
  } else {
    post.id = Date.now();
    data.posts.unshift(post);
  }
  saveBlogData(data);
  return post;
}

async function deletePostAsync(id) {
  if (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
    const success = await deletePostFromSupabase(id);
    if (success) return true;
  }

  const data = getBlogData();
  data.posts = data.posts.filter(p => String(p.id) !== String(id));
  saveBlogData(data);
  return true;
}



