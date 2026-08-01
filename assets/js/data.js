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
    github: "github.com/elybuilds",
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
      title: "When Fast Becomes Fragile: Rebuilding a Student Platform with Secure Design Principles",
      slug: "when-fast-becomes-fragile-rebuilding-a-student-platform-with-secure-design-principles",
      category: "Information Assurance",
      status: "Published",
      date: "Aug 1, 2026",
      readTime: "8 min read",
      author: "Ely",
      featured: true,
      isLatest: true,
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
      summary: "An in-depth analysis of secure design principles, rapid AI development risks, and Republic Act No. 10173 compliance in student platform architectures.",
      toc: [
        { id: "intro", text: "1. Introduction" },
        { id: "what-went-wrong", text: "2. What Went Wrong" },
        { id: "short-term", text: "3. Short-Term Containment" },
        { id: "long-term", text: "4. Long-Term Improvements" },
        { id: "ai-coding", text: "5. AI Coding & Security" },
        { id: "ra-10173", text: "6. Connecting to RA No. 10173" },
        { id: "conclusion", text: "7. Conclusion" }
      ],
      content: `
        <h3 id="intro">1. Introduction</h3>
        <p>Artificial Intelligence (AI) has changed the way software is developed. Today, developers can generate working applications in hours instead of weeks using AI coding assistants such as GitHub Copilot, ChatGPT, and other code generation tools. While this dramatically improves productivity, it also introduces a dangerous misconception: <strong>if the application works, then it is ready to use.</strong></p>

        <p>The university case demonstrates exactly why this mindset is risky. Three students successfully created a web and mobile platform for managing student organizations in less than 72 hours. Their application quickly became popular because it solved real problems—membership management, event fee collection, and file sharing. However, the project crossed an invisible boundary. It evolved from being a hackathon prototype into a production system containing highly sensitive personal information without adopting the security practices required for real-world software.</p>

        <p>The consequences became clear when another student simply changed the profile number in the URL and gained access to another person's records. Even worse, the application's public GitHub repository exposed database credentials and payment API keys. These mistakes required very little technical knowledge to exploit. Although no confirmed attack had occurred, the possibility of identity theft, financial fraud, and privacy violations was already present.</p>

        <p>This incident highlights that software security is not merely about preventing hackers. It is about protecting the people who trust developers with their personal information. As developers, our responsibility extends beyond writing functional code. We are also responsible for building systems that respect privacy, prevent misuse, and comply with legal obligations such as the <strong>Philippine Data Privacy Act of 2012 (Republic Act No. 10173).</strong></p>

        <p>This article reflects on what went wrong, explains which <strong>Secure Design Principles</strong> were violated, and discusses how I would rebuild the platform through both immediate containment actions and long-term architectural improvements.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="what-went-wrong">2. What Went Wrong</h3>
        <p>The application failed because security was treated as something optional rather than a fundamental design requirement. Every major issue in the case represents a violation of well-established secure design principles.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">2.1 Broken Access Control (Violation of Complete Mediation)</h4>
        <p>The most obvious vulnerability was the ability to change the URL from <code>/profile/1048</code> to <code>/profile/1049</code> and immediately view another student's profile.</p>
        <p>This happened because the application authenticated users only during login but never checked authorization when individual resources were accessed. The server simply assumed that if a user knew the URL, they were allowed to view the information.</p>
        <p>This violates the <strong>Complete Mediation</strong> principle, which requires that <strong>every request to a protected resource must be verified every time it is accessed.</strong></p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">2.2 Database Credentials Stored in GitHub (Violation of Fail-Safe Defaults)</h4>
        <p>The developers accidentally committed database passwords and payment API keys into a public GitHub repository. Once secrets become public, attackers no longer need to hack the application—they already possess the keys.</p>
        <p>This violates <strong>Fail-Safe Defaults</strong>, which states that systems should deny access by default and only explicitly grant what is necessary.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">2.3 Broad Database Permissions (Violation of Least Privilege)</h4>
        <p>Every application account was granted broad read access to the database. This means that even a minor vulnerability could expose the entire database rather than only the records needed for one operation.</p>
        <p>This violates the <strong>Least Privilege</strong> principle. Applications should receive only the minimum permissions required.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">2.4 Detailed Error Messages (Violation of Economy of Mechanism)</h4>
        <p>The application displayed complete stack traces whenever an error occurred. Stack traces expose file locations, framework versions, SQL queries, and internal code structure.</p>

        <h4 style="font-size: 18px; margin: 20px 0 10px 0;">2.5 Using Plain HTTP (Violation of Open Design)</h4>
        <p>The platform transmitted sensitive information through ordinary HTTP instead of HTTPS. This allowed anyone on the same network to potentially intercept login credentials, uploaded IDs, phone numbers, and GCash screenshots.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="short-term">3. Short-Term Containment: First Hours and Days</h3>
        <p>If I were responsible for responding to this incident, my immediate priority would be reducing further exposure:</p>
        <ul style="margin-left: 20px; line-height: 1.8;">
          <li><strong>Take the System Offline:</strong> Disable public access to restore Fail-Safe Defaults.</li>
          <li><strong>Rotate Every Credential:</strong> Replace database passwords and API keys immediately.</li>
          <li><strong>Remove Secrets from Git History:</strong> Use <code>git filter-repo</code> or BFG Repo Cleaner to purge commit history.</li>
          <li><strong>Force Authorization Checks:</strong> Ensure every API endpoint validates resource ownership.</li>
          <li><strong>Disable Debug Mode:</strong> Replace stack traces with generic user-friendly messages.</li>
          <li><strong>Notify Stakeholders:</strong> Inform faculty advisers, organization officers, and affected students under RA No. 10173 guidelines.</li>
        </ul>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="long-term">4. Long-Term Secure Design Improvements</h3>
        <p>Short-term fixes reduce immediate risk, but lasting security requires redesigning the system architecture:</p>
        <ul style="margin-left: 20px; line-height: 1.8;">
          <li><strong>Adopt Secure Authentication:</strong> Multi-factor authentication, session expiration, and role-based access control.</li>
          <li><strong>Apply Least Privilege Everywhere:</strong> Enforce minimal access at database, API, and cloud service layers.</li>
          <li><strong>Encrypt Data:</strong> Implement TLS/HTTPS during transmission and AES-256 encryption at rest.</li>
          <li><strong>Secure SDLC:</strong> Integrate threat modeling, dependency scanning, and static analysis into development.</li>
          <li><strong>Protect Secrets Properly:</strong> Use environment variables and cloud secret managers instead of hardcoded secrets.</li>
          <li><strong>Continuous Monitoring:</strong> Audit login attempts, failed authorization requests, and administrative actions.</li>
          <li><strong>Privacy by Design:</strong> Practice data minimization by collecting and retaining only necessary data.</li>
        </ul>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="ai-coding">5. AI Coding Assistants Are Powerful—but Not Security Experts</h3>
        <p>AI optimizes for producing code that compiles and functions. Unless developers deliberately request secure implementations, generated code may include missing authorization checks, weak authentication, hardcoded credentials, and unsafe defaults.</p>
        <blockquote style="padding: 16px 24px; border-left: 4px solid var(--accent-coral); background: rgba(165,21,12,0.05); font-style: italic; margin: 20px 0; border-radius: 0 12px 12px 0;">
          AI can accelerate development, but it cannot replace secure engineering judgment. Security remains a human responsibility.
        </blockquote>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="ra-10173">6. Connecting the Case to Republic Act No. 10173</h3>
        <p>The <strong>Data Privacy Act of 2012 (RA No. 10173)</strong> requires organizations processing personal data to implement appropriate organizational, physical, and technical security measures. Poor security design can result in legal consequences, reputational damage, and loss of public trust regardless of intent.</p>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

        <h3 id="conclusion">7. Conclusion</h3>
        <p>Shipping software quickly is exciting, but speed should never come at the expense of security and privacy. Building trustworthy software means balancing innovation with responsibility, ensuring that every system we create respects the privacy and confidence of the people who rely on it.</p>
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
