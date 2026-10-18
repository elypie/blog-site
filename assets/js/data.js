const initialData = {
  author: {
    name: "Elyssa Contreras",
    fullName: "Ma. Elyssa Beda D. Contreras",
    nickname: "EL",
    role: "BSIT 3rd Year Student",
    course: "BS Information Technology",
    school: "Father Saturnino Urios University",
    yearLevel: "3rd Year",
    motto: "Code. Create. Protect.",
    email: "ma.contreras@urios.edu.ph",
    bio: "Hi! I'm a 3rd-year BSIT student at Father Saturnino Urios University who is passionate about designing and developing websites. Alongside web development, I aim to expand my knowledge of cybersecurity to better understand how to build secure and reliable applications. Through this blog, I share my knowledge, projects, experiences, and reflections as I continue exploring the ever-evolving world of technology, web development, and cybersecurity.",
    facebook: "https://facebook.com/elycontz",
    github: "https://github.com/elypie",
    instagram: "https://instagram.com/_beymm",
    avatarUrl: "assets/images/profile/profile-pfp.jpg",
    coverUrl: "assets/images/profile/profile-cover.png"
  },
  categories: [
    { id: 1, name: "Information Assurance", count: 3, color: "#E55B44" },
    { id: 2, name: "Organizational Context", count: 0, color: "#F59E0B" },
    { id: 3, name: "Computing Ethics", count: 0, color: "#8B5CF6" },
    { id: 4, name: "Data Privacy", count: 0, color: "#3B82F6" },
    { id: 5, name: "Security Principles", count: 1, color: "#10B981" },
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
      publishedAt: "2026-08-05",
      readTime: "6 min read",
      author: "Elyssa",
      featured: false,
      tags: ["AI Security", "Secure Design", "Data Privacy"],
      isLatest: false,
      likes: 128,
      views: "1.2K",
      coverImage: "assets/images/posts/post1-cover.png",
      summary: "Exploring the security risks, ethical concerns, and lessons learned from building an application with AI in just 72 hours.",
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

        <h2 id="references">VII. References</h2>
        <ol class="references-list">
          <li>National Privacy Commission. (2012). <em>Republic Act No. 10173: Data Privacy Act of 2012</em>. <a href="https://privacy.gov.ph/data-privacy-act/" target="_blank" rel="noopener noreferrer">National Privacy Commission</a>.</li>
          <li>OWASP Foundation. (2021). <em>OWASP Top 10: The ten most critical web application security risks</em>. <a href="https://owasp.org/Top10/" target="_blank" rel="noopener noreferrer">OWASP</a>.</li>
          <li>National Institute of Standards and Technology. (2020). <em>Security and Privacy Controls for Information Systems and Organizations (SP 800-53 Rev. 5)</em>. <a href="https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" target="_blank" rel="noopener noreferrer">NIST</a>.</li>
        </ol>
      `
    },
    {
      id: 2,
      title: "Seeing Security in Everyday Operations: Insights from Our Risk Assessment Fieldwork",
      slug: "seeing-security-in-everyday-operations-insights-from-our-risk-assessment-fieldwork",
      category: "Information Assurance",
      status: "Published",
      date: "Sep 4, 2026",
      publishedAt: "2026-09-04",
      readTime: "8 min read",
      author: "Elyssa",
      featured: false,
      tags: ["Risk Assessment", "Information Security", "Asset Management"],
      isLatest: false,
      likes: 0,
      views: "0",
      coverImage: "assets/images/posts/post2.jpg",
      summary: "Reflecting on how our group's risk assessment experience revealed the role of people, processes, and physical assets in protecting information, not just technology.",
      content: `
        <p>Before conducting our risk assessment fieldwork, information security felt like a topic that mostly existed in textbooks, lectures, and case studies. We learned about threats, vulnerabilities, controls, and risk treatments in class, but it was difficult to fully appreciate how these concepts worked in a real environment. Our group's experience conducting a risk assessment for a student publication organization changed that perspective. It allowed us to move beyond theory and see how information security challenges appear in everyday operations.</p>

        <p>As part of our fieldwork, we used a Risk Assessment Form to evaluate the organization's assets, identify risks that could affect those assets, and recommend treatments to reduce potential harm. To protect the organization's confidentiality, we discuss our observations in general terms and avoid disclosing specific vulnerabilities or identifying individuals. Although the organization was relatively small, the experience showed us that many of the information security principles discussed in class apply regardless of an organization's size. We learned that security is not just about technology but also about people, processes, physical assets, and day-to-day decision-making.</p>

        <h2 id="realizing-that-information-security-is-everywhere">I. Realizing That Information Security Is Everywhere</h2>
        <p>One of the biggest lessons we learned was that information security is much broader than cybersecurity alone. Before the assessment, many of us immediately associated information security with hackers, malware, or data breaches. However, when we began examining the organization's operations, we realized that many risks were connected to physical equipment, workplace practices, and human behavior rather than technical systems.</p>

        <p>Our risk assessment involved assets such as media equipment, workstations, publication archives, communication platforms, storage areas, and contributor information. Looking at these assets helped us understand that information security applies to anything that supports the organization's mission. If any of these assets became unavailable, damaged, stolen, or misused, the organization's ability to operate could be affected.</p>

        <p>This experience reminded us that protecting information requires much more than installing software or configuring security settings. It requires understanding how people interact with assets and how those assets contribute to everyday operations.</p>

        <h2 id="learning-the-importance-of-knowing-what-an-organization-owns">II. Learning the Importance of Knowing What an Organization Owns</h2>
        <p>One of the first steps in our assessment was identifying organizational assets. At first, this seemed like a simple task. However, as we worked through the process, we realized that asset identification is one of the most important parts of risk management.</p>

        <p>Our group discovered that organizations depend on many assets that are easy to overlook during normal operations. Some assets were physical, while others were digital or informational. We also realized that not all assets have the same level of importance. Certain resources were essential to daily activities, while others could be replaced with minimal disruption.</p>

        <p>This exercise taught us why asset inventories are emphasized in security frameworks. According to the National Institute of Standards and Technology (NIST), effective IT asset management improves visibility into organizational resources and strengthens security management (National Institute of Standards and Technology [NIST], 2018). <a href="https://csrc.nist.gov/pubs/sp/1800/5/final" target="_blank" rel="noopener noreferrer">NIST CSRC</a>, <a href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.1800-5.pdf" target="_blank" rel="noopener noreferrer">NIST publication PDF</a>.</p>

        <p>As a group, we learned that organizations cannot protect what they do not know they have. Asset awareness is the foundation of effective risk management.</p>

        <h2 id="discovering-how-much-security-depends-on-people">III. Discovering How Much Security Depends on People</h2>
        <p>Perhaps the most eye-opening lesson from the fieldwork was how strongly security depends on human behavior.</p>

        <p>Many of the risks we identified did not result from advanced technical attacks. Instead, they were connected to everyday practices, convenience, and informal procedures. Some risks emerged because people naturally try to make their work easier and more efficient. While these decisions often make sense from an operational perspective, they can unintentionally create security concerns.</p>

        <p>This experience helped us understand the challenge organizations face when balancing productivity and security. We learned that the strongest security controls are often the ones that people can consistently follow without disrupting their work.</p>

        <p>As students, we sometimes focus heavily on technical safeguards, but our fieldwork showed us that security awareness, accountability, and clear procedures may be equally important.</p>

        <h2 id="applying-risk-assessment-concepts-in-a-real-environment">IV. Applying Risk Assessment Concepts in a Real Environment</h2>
        <p>One aspect of the fieldwork that challenged our group was assigning risk ratings. During class exercises, determining whether a risk was high, medium, or low often seemed straightforward. In practice, reaching those decisions required thoughtful discussion.</p>

        <p>When evaluating risks, our group had to consider questions such as:</p>
        <ul class="article-bullet-list">
          <li>How severe would the consequences be if the risk occurred?</li>
          <li>How likely is the event to happen?</li>
          <li>What controls already exist?</li>
          <li>Are those controls effective enough?</li>
        </ul>

        <p>There were times when group members viewed the same risk differently. Through discussion, we learned that risk assessment is not only about following a formula but also about applying professional judgment.</p>

        <p>The Risk Assessment Form provided a structured framework, but our evaluation still required us to think critically about real-world consequences. This process helped us appreciate why risk management is both an analytical and decision-making activity.</p>

        <h2 id="understanding-that-controls-must-be-effective-not-just-present">V. Understanding That Controls Must Be Effective, Not Just Present</h2>
        <p>Another important lesson involved evaluating existing controls. When we identified risks, we also reviewed safeguards that were already in place.</p>

        <p>What surprised us was that many controls existed informally. Certain practices were followed because they had become part of the organization's routine rather than because they were formally documented.</p>

        <p>This led us to an important realization: having a control is not the same as knowing that it works.</p>

        <p>Throughout the assessment, we repeatedly asked ourselves whether a particular control actually reduced risk or simply gave the appearance of protection. This mindset closely aligns with the principles discussed by ISACA, which emphasizes evaluating the design, implementation, and ongoing effectiveness of controls (ISACA, 2022). <a href="https://www.isaca.org/resources/news-and-trends/newsletters/atisaca/2022/volume-6/tips-for-effective-control-design" target="_blank" rel="noopener noreferrer">Tips for effective control design</a>.</p>

        <p>As a result, our recommendations focused not only on introducing new safeguards but also on strengthening consistency, accountability, and verification.</p>

        <h2 id="what-we-learned-about-risk-treatment">VI. What We Learned About Risk Treatment</h2>
        <p>One of the most rewarding parts of the assessment was developing risk treatment recommendations. Initially, we assumed that effective security improvements would require major investments or sophisticated technologies.</p>

        <p>Instead, we found that many practical improvements involved:</p>
        <ul class="article-bullet-list">
          <li>Improving documentation</li>
          <li>Clarifying responsibilities</li>
          <li>Strengthening procedures</li>
          <li>Enhancing physical safeguards</li>
          <li>Formalizing existing practices</li>
          <li>Establishing clearer accountability</li>
        </ul>

        <p>This taught us that effective risk management is often less about expensive technology and more about creating reliable processes.</p>

        <p>Many of our recommended treatments focused on reducing risk through better management practices rather than complex technical solutions. This experience helped us understand that security should be practical, realistic, and aligned with organizational needs.</p>

        <h2 id="reflecting-on-the-overall-experience">VII. Reflecting on the Overall Experience</h2>
        <p>Looking back, our group's fieldwork was one of the most valuable learning experiences in the course. It allowed us to apply classroom concepts in a real environment and see how information security functions outside academic examples.</p>

        <p>The assessment showed us that:</p>
        <ul class="article-bullet-list">
          <li>Security involves people, processes, physical assets, and technology.</li>
          <li>Asset identification is the foundation of risk management.</li>
          <li>Human behavior significantly influences security outcomes.</li>
          <li>Controls must be evaluated for effectiveness, not just existence.</li>
          <li>Documentation and accountability are essential for long-term security.</li>
          <li>Risk management is a continuous process rather than a one-time activity.</li>
        </ul>

        <p>Most importantly, we learned that information security is not solely the responsibility of technical personnel. Everyone within an organization contributes to maintaining a secure environment through their daily actions and decisions.</p>

        <h2 id="conclusion">VIII. Conclusion</h2>
        <p>Conducting the risk assessment fieldwork transformed our understanding of information security. What began as a classroom assignment became an opportunity to observe how security principles are applied in a real organizational setting. The experience reinforced concepts from the module while also showing us the practical challenges organizations face when managing risk.</p>

        <p>Our group learned that successful information security depends on understanding assets, identifying realistic risks, implementing effective controls, and continually reviewing those controls over time. We also discovered that many security improvements can be achieved through better procedures, clearer responsibilities, and stronger awareness rather than technology alone.</p>

        <p>Ultimately, this fieldwork helped us connect theory with practice and gave us a deeper appreciation for the role of risk management in protecting organizational assets and supporting operational success.</p>

        <h2 id="references">IX. References</h2>
        <p>ISACA. (2022, February 9). <em>Tips for effective control design</em>. <a href="https://www.isaca.org/resources/news-and-trends/newsletters/atisaca/2022/volume-6/tips-for-effective-control-design" target="_blank" rel="noopener noreferrer">https://www.isaca.org/resources/news-and-trends/newsletters/atisaca/2022/volume-6/tips-for-effective-control-design</a></p>
        <p>National Institute of Standards and Technology. (2018). <em>NIST Special Publication 1800-5: IT asset management</em>. U.S. Department of Commerce. <a href="https://doi.org/10.6028/NIST.SP.1800-5" target="_blank" rel="noopener noreferrer">https://doi.org/10.6028/NIST.SP.1800-5</a></p>
      `
    },
    {
      id: 3,
      title: "Beyond the Risk Register: Viewing Our Assessment Through an Auditor's Lens",
      slug: "beyond-the-risk-register-viewing-our-assessment-through-an-auditors-lens",
      category: "Information Assurance",
      status: "Published",
      date: "Oct 18, 2026",
      publishedAt: "2026-10-18",
      readTime: "9 min read",
      author: "Elyssa",
      featured: true,
      tags: ["IT Audit", "Risk Assessment", "Governance"],
      isLatest: false,
      likes: 0,
      views: "0",
      coverImage: "assets/images/posts/post3.jpg",
      summary: "Reflecting on asset ownership, accountability, and control effectiveness to understand whether an organization can truly demonstrate that its security measures work.",
      content: `
        <h2 id="introduction">I. Introduction</h2>
        <p>When our group completed the Risk Assessment Form, we focused on identifying risks and recommending controls that could reduce their likelihood or impact. Looking back at the assessment through the eyes of an auditor, however, shifts the focus from risk identification to accountability and evidence. An auditor is less concerned with whether risks have been recognized and more interested in whether the organization understands what it owns, who is responsible for protecting those assets, and whether it can prove that its controls actually work.</p>

        <p>Revisiting our assessment from this perspective provided valuable insight into the relationship between risk management and assurance. While the organization demonstrated awareness of several operational and information security risks, an audit would focus on whether those risks are supported by formal processes, ownership structures, and documented evidence. This reflection examines the organization's asset awareness, ownership practices, control effectiveness, and the ways an asset inventory and audit checklist could strengthen the treatments our group recommended.</p>

        <h2 id="does-the-organization-know-what-it-owns">II. Does the Organization Know What It Owns?</h2>
        <p>One of the first questions an auditor would ask is whether the organization has a complete understanding of its assets. Based on our assessment, it was clear that the organization recognized many of the resources essential to its operations. The risks we identified involved production equipment, shared workstations, online accounts, communication channels, publication archives, physical facilities, and contributor information. Because these assets appeared repeatedly throughout the assessment, it was evident that the organization understood their importance and recognized how their loss or compromise could affect day-to-day activities.</p>

        <p>However, understanding that certain assets are important is different from maintaining a formal asset inventory. During our fieldwork, many assets were identified because they were visible and actively used by members. An auditor would likely ask whether there is a centralized inventory documenting where assets are located, who owns them, what their classification is, and how they are managed throughout their lifecycle. Without such documentation, organizations often rely on institutional knowledge rather than formal records. While this approach may work in smaller environments, it creates risks when responsibilities change or when critical information is no longer available.</p>

        <h2 id="which-assets-matter-most">III. Which Assets Matter Most?</h2>
        <p>Looking at the Risk Assessment Form, several assets stood out as especially important because they directly support the organization's mission. Production equipment was among the most critical assets because it enabled content creation and publication activities. If those resources became unavailable due to loss, damage, or theft, the organization's ability to operate would be immediately affected.</p>

        <p>Digital assets were also highly significant. Shared computers, online accounts, cloud storage platforms, and communication systems serve as gateways to information, collaboration, and content management. Unauthorized access to these systems could affect both operational continuity and information security. Contributor information represented another valuable asset category because it may contain personal data that requires protection. Finally, publication archives were important because they preserve historical content and institutional knowledge accumulated over time.</p>

        <p>From an auditor's perspective, these assets should not only be identified but also formally classified according to their importance and sensitivity. Classification helps determine the level of protection required for each asset and ensures that security resources are directed toward areas of greatest business impact.</p>

        <h2 id="who-is-responsible-for-each-asset">IV. Who Is Responsible for Each Asset?</h2>
        <p>One positive aspect of our assessment was that every recommended treatment included a responsible role. This demonstrated that our group recognized the importance of accountability when implementing risk treatments. Nevertheless, an auditor would likely distinguish between responsibility for carrying out a control and ownership of the asset itself.</p>

        <p>Asset ownership implies long-term accountability for the asset's protection, maintenance, and use. An auditor would want to know who has authority over important resources, who approves access, and who is responsible for ensuring that controls remain effective. While the assessment assigned responsibility for implementing mitigation measures, it did not always define formal asset ownership structures.</p>

        <p>This distinction matters because ownership provides clarity when decisions need to be made. If an incident occurs or a security investment is required, clearly defined asset owners help ensure that action is taken promptly and that accountability remains visible. Without documented ownership, responsibilities can become ambiguous and governance becomes more difficult to maintain.</p>

        <h2 id="can-the-organization-prove-its-controls-actually-work">V. Can the Organization Prove Its Controls Actually Work?</h2>
        <p>One of the most important lessons from viewing the assessment as an auditor is realizing that identifying controls is not enough. Auditors focus on evidence. A control may appear effective on paper, but an organization must be able to demonstrate that it is functioning as intended.</p>

        <p>Our Risk Assessment Form identified existing controls and proposed additional measures addressing physical security, authentication, visitor management, equipment handling, communication practices, and data protection. From a risk management standpoint, these recommendations were practical and appropriate. However, an auditor would ask what evidence exists to verify that these controls are consistently followed.</p>

        <p>For example, a policy may require passwords or visitor logging procedures, but auditors will want documentation proving that these requirements are enforced. Backup procedures may exist, but proof is needed that backups are completed successfully and periodically tested. The auditor's perspective therefore shifts the conversation from policy intentions to measurable performance.</p>

        <h2 id="what-evidence-would-an-auditor-require">VI. What Evidence Would an Auditor Require?</h2>
        <p>To determine whether controls are effective, auditors rely on documentation rather than assumptions. Asset management controls would likely require evidence such as asset inventories, equipment registers, ownership records, and borrowing logs. Access management controls could be supported by user account reviews, access authorization documentation, and authentication policies. Physical security controls might be validated through visitor sign-in records, key management logs, and facility inspection reports.</p>

        <p>Similarly, data protection controls would require evidence that backups are performed, archives are maintained, and recovery processes are tested. Governance-related controls would be supported through policies, training records, meeting minutes, and periodic security reviews. The specific evidence may vary depending on the control being examined, but the underlying principle remains the same: organizations must be able to demonstrate that controls are operating consistently rather than simply stating that they exist.</p>

        <h2 id="what-gaps-would-an-auditor-likely-find">VII. What Gaps Would an Auditor Likely Find?</h2>
        <p>While the assessment identified risks and recommended reasonable treatments, an auditor would likely uncover several common gaps. One potential finding would be the absence of a comprehensive asset inventory that formally documents ownership, classification, and lifecycle information. Although critical assets were recognized, there was limited evidence of a centralized process for managing them.</p>

        <p>Another likely observation would involve the use of informal procedures. Several risks stemmed from operating practices based on convenience or habit rather than documented processes. While these practices may function adequately in daily operations, they can be difficult to verify and maintain over time. An auditor may also note that the assessment focused heavily on implementing controls but provided limited detail regarding how those controls would be monitored or tested after deployment.</p>

        <p>Finally, ownership and governance structures could potentially be strengthened. Although responsibilities were assigned for risk treatments, an auditor would likely encourage more formal documentation of asset ownership and accountability to ensure long-term consistency.</p>

        <h2 id="how-asset-inventories-and-audit-checklists-could-strengthen-our-recommendations">VIII. How Asset Inventories and Audit Checklists Could Strengthen Our Recommendations</h2>
        <p>Reflecting on the assessment, one of the most valuable improvements would be the implementation of a formal asset inventory. An asset inventory would provide a clear record of organizational resources, their owners, their classifications, and their locations. This would improve visibility and make future risk assessments more accurate because decisions would be based on documented information rather than assumptions or institutional memory.</p>

        <p>An audit checklist would provide additional benefits by ensuring that controls are reviewed regularly. Rather than assuming controls remain effective after implementation, management could periodically verify that ownership assignments remain current, access controls are functioning correctly, records are maintained, and policies continue to support organizational needs. These reviews would not only improve security but also generate evidence demonstrating that management is actively overseeing risk treatment efforts.</p>

        <p>Together, asset inventories and audit checklists would transform risk management from a periodic exercise into a continuous process of monitoring and improvement.</p>

        <h2 id="conclusion">IX. Conclusion</h2>
        <p>Viewing our Risk Assessment Form through an auditor's lens provided a broader understanding of what effective security management requires. The assessment demonstrated awareness of important assets and identified practical treatments for reducing risk. However, auditors are concerned with more than awareness. They seek evidence that assets are properly managed, responsibilities are clearly assigned, and controls are operating effectively.</p>

        <p>The experience showed us that strong information security depends not only on identifying and addressing risks but also on maintaining accountability and documentation. Asset inventories, ownership records, control reviews, and audit evidence help transform recommendations into measurable actions that can be verified over time. Ultimately, effective security is not simply about implementing controls. It is about being able to demonstrate that those controls continue to work, support organizational objectives, and protect the assets that matter most.</p>

        <h2 id="references">X. References</h2>
        <p>ISACA. (2020). <em>Standards, guidelines, tools and techniques</em>. <a href="https://www.isaca.org/resources/isaca-journal/issues/2020/volume-1/standards-guidelines-tools-and-techniques" target="_blank" rel="noopener noreferrer">https://www.isaca.org/resources/isaca-journal/issues/2020/volume-1/standards-guidelines-tools-and-techniques</a></p>
        <p>ISACA. (2022, February 9). <em>Tips for effective control design</em>. <a href="https://www.isaca.org/resources/news-and-trends/newsletters/atisaca/2022/volume-6/tips-for-effective-control-design" target="_blank" rel="noopener noreferrer">https://www.isaca.org/resources/news-and-trends/newsletters/atisaca/2022/volume-6/tips-for-effective-control-design</a></p>
        <p>National Institute of Standards and Technology. (2018). <em>NIST Special Publication 1800-5: IT asset management</em>. U.S. Department of Commerce. <a href="https://doi.org/10.6028/NIST.SP.1800-5" target="_blank" rel="noopener noreferrer">https://doi.org/10.6028/NIST.SP.1800-5</a></p>
        <p>National Institute of Standards and Technology. (2025). <em>Assessment &amp; auditing resources</em>. <a href="https://www.nist.gov/cyberframework/assessment-auditing-resources" target="_blank" rel="noopener noreferrer">https://www.nist.gov/cyberframework/assessment-auditing-resources</a></p>
      `
    },
    {
      id: 4,
      title: "Autopilot for Cybersecurity? Evaluating the Rise of the SOC Pilot",
      slug: "autopilot-for-cybersecurity-evaluating-the-rise-of-the-soc-pilot",
      category: "Security Principles",
      status: "Published",
      date: "Oct 18, 2026",
      publishedAt: "2026-10-18",
      readTime: "8 min read",
      author: "Elyssa",
      featured: true,
      tags: ["AI Security", "SOC", "Automation"],
      isLatest: true,
      likes: 0,
      views: "0",
      coverImage: "assets/images/posts/post4.jpg",
      summary: "Exploring whether AI can safely operate modern Security Operations Centers autonomously, where human judgment remains essential, and what skills future cybersecurity professionals will need to stay in the cockpit.",
      content: `
        <p>Artificial intelligence is rapidly reshaping cybersecurity, and one of the most ambitious visions of that future is the autonomous Security Operations Center (SOC). In the article <em>How agentic AI enables an autonomous SOC with minimal human involvement</em>, John Velisaris compares the future SOC to a modern airliner, where AI handles routine operations while human analysts act as "SOC pilots," stepping in only when unusual situations appear. He argues that cybersecurity must evolve beyond simple automation toward true autonomy.</p>

        <p>The idea is appealing. Security teams face overwhelming alert volumes, talent shortages, and constant pressure to respond quickly. If AI can reliably handle routine detection and response activities, organizations could operate more efficiently while allowing analysts to focus on higher-value work. However, while I believe the SOC pilot model is realistic, I am less convinced that a fully autonomous SOC is always responsible. AI can manage many routine tasks, but human judgment remains essential when context is unclear, risks are high, or asset information is inaccurate.</p>

        <h2 id="why-the-soc-pilot-model-is-realistic">I. Why the SOC Pilot Model Is Realistic</h2>
        <p>Many SOC activities already follow repetitive and structured workflows. Analysts spend a large portion of their time reviewing alerts, gathering logs, correlating threat intelligence, and investigating events that ultimately turn out to be harmless.</p>

        <p>This is where AI excels. Agentic systems can process large volumes of data faster than humans, identify patterns across multiple sources, and respond to known threats within seconds. Tasks such as alert prioritization, routine investigations, account lockouts, and malware containment can often be performed consistently without human involvement.</p>

        <p>There is also a strong argument that humans can become the bottleneck. Analysts get tired, experience alert fatigue, and may make inconsistent decisions. An AI system can operate continuously and apply the same logic every time. Supporters of autonomous SOCs therefore argue that requiring human approval for every security event creates inefficiency rather than security.</p>

        <p>Viewed this way, the SOC pilot model seems like a natural evolution of current cybersecurity operations rather than a radical departure from them.</p>

        <h2 id="the-strongest-argument-against-the-model">II. The Strongest Argument Against the Model</h2>
        <p>Despite these advantages, I think the comparison between cybersecurity and aviation has limitations.</p>

        <p>Modern aircraft operate in highly predictable environments governed by the laws of physics. Cybersecurity operates in an environment shaped by intelligent adversaries who constantly adapt their tactics. Attackers deliberately change techniques, manipulate systems, and exploit weaknesses specifically designed to bypass automated defenses.</p>

        <p>This means cybersecurity contains far more uncertainty than aviation.</p>

        <p>An AI system may perform exceptionally well against known threats but struggle when faced with entirely new attack methods. Attackers may even attempt to manipulate AI systems themselves through deceptive inputs or techniques designed to evade automated detection.</p>

        <p>Velisaris points out that humans would still be needed when novel threats such as zero-day attacks emerge. However, this raises an important question. If cybersecurity is filled with uncertainty and constantly evolving threats, how often will human intervention actually be required? The answer may be more often than advocates of complete autonomy expect.</p>

        <h2 id="why-human-judgment-still-matters">III. Why Human Judgment Still Matters</h2>
        <p>Even if AI becomes highly effective at operational tasks, cybersecurity decisions often involve more than technical analysis.</p>

        <p>For example, an AI system may determine that isolating a server is the fastest way to contain suspicious activity. Technically, that response could be correct. However, what if that server supports critical business operations? The decision is no longer purely technical because it requires balancing security with operational impact.</p>

        <p>Humans provide something AI cannot fully replicate: judgment. They can evaluate competing priorities, understand organizational context, and make decisions when information is incomplete.</p>

        <p>Human oversight is also important for accountability. If an automated response causes significant disruption, organizations must explain and justify that decision to stakeholders, customers, or regulators. Responsibility ultimately rests with people, not algorithms.</p>

        <p>For these reasons, I believe future cybersecurity professionals will spend less time handling alerts and more time making strategic decisions that require context and experience.</p>

        <h2 id="the-asset-context-problem">IV. The Asset Context Problem</h2>
        <p>One of the most convincing points in the IBM article is that autonomous decision-making depends on context. AI cannot determine the appropriate response to an alert without understanding the importance of the affected asset.</p>

        <p>This creates a significant challenge.</p>

        <p>Imagine a critical production server is mistakenly classified as a low-priority workstation in the organization's asset inventory. If suspicious activity is detected, an AI agent may follow established procedures and automatically isolate the device. The response may be technically correct according to policy, yet operationally disastrous.</p>

        <p>In this case, the AI is not malfunctioning. It is acting on inaccurate information.</p>

        <p>According to <em>NIST Special Publication 1800-5: IT Asset Management</em>, effective asset management improves visibility into organizational hardware and software assets, helping organizations make better security decisions. If the underlying asset data is incomplete or incorrect, autonomous systems can make poor decisions with complete confidence.</p>

        <p>This highlights a major weakness of the SOC pilot model. AI is only as good as the information it receives. Without accurate asset inventories and asset classification, autonomous decision-making becomes significantly less reliable.</p>

        <h2 id="becoming-a-soc-pilot">V. Becoming a SOC Pilot</h2>
        <p>Reading about the SOC pilot concept made me think about the future of cybersecurity careers. If AI increasingly handles routine security tasks, analysts will need to focus on skills that are difficult to automate.</p>

        <p>Technical expertise will remain important, but critical thinking, communication, and risk management may become even more valuable. Security professionals will need to understand business priorities, evaluate complex situations, and explain risks to non-technical stakeholders.</p>

        <p>Continuous learning will also become essential. Attackers evolve constantly, and cybersecurity professionals will need to adapt alongside both emerging threats and advancing AI capabilities. Rather than competing against AI, future analysts will need to learn how to supervise, guide, and challenge it when necessary.</p>

        <h2 id="conclusion">VI. Conclusion</h2>
        <p>The autonomous SOC envisioned by John Velisaris is both realistic and promising. AI has already demonstrated its ability to automate routine security operations, making the transition toward SOC pilots increasingly plausible.</p>

        <p>However, autonomy should not be confused with independence. Cybersecurity remains a field defined by uncertainty, changing threats, and decisions that extend beyond technical considerations. AI can handle repetitive work efficiently, but it still depends on accurate data, organizational context, and human oversight when the unexpected occurs.</p>

        <p>I therefore believe the future SOC will be a partnership rather than a replacement. AI will handle routine operations, while human analysts focus on judgment, strategy, and accountability. The professionals most likely to succeed will not be those competing against AI, but those capable of acting as effective SOC pilots when automation reaches its limits.</p>

        <h2 id="references">VII. References</h2>
        <p>IBM. (2025). <em>How agentic AI enables an autonomous SOC with minimal human involvement</em>. IBM Think. <a href="https://www.ibm.com/think/insights/agentic-ai-enables-autonomous-soc" target="_blank" rel="noopener noreferrer">IBM Think article</a>.</p>
        <p>National Institute of Standards and Technology. (2018). <em>NIST Special Publication 1800-5: IT asset management</em>. U.S. Department of Commerce. <a href="https://doi.org/10.6028/NIST.SP.1800-5" target="_blank" rel="noopener noreferrer">NIST</a>.</p>
      `
    }
  ]
};

function dedupeExactPosts(posts) {
  const seenPosts = new Set();
  return posts.filter(post => {
    const fingerprint = [
      post.slug,
      post.title,
      post.category,
    ].map(value => String(value || '').trim().toLowerCase()).join('\u001F');
    if (seenPosts.has(fingerprint)) return false;
    seenPosts.add(fingerprint);
    return true;
  });
}

function getBlogNumber(post, posts) {
  const orderedPosts = [...posts].sort((first, second) => Number(first.id) - Number(second.id));
  const postIndex = orderedPosts.findIndex(candidate => String(candidate.id) === String(post.id));
  return postIndex === -1 ? '' : postIndex + 1;
}

// Blog posts are static source files deployed with the site.
function getBlogData() {
  return JSON.parse(JSON.stringify(initialData));
}

function getBlogDataAsync() {
  return getBlogData();
}

async function savePostAsync() {
  throw new Error('Posts are static files. Update assets/js/data.js and redeploy the site.');
}

async function deletePostAsync(id) {
  throw new Error(`Post ${id} is static. Remove it from assets/js/data.js and redeploy the site.`);
}



