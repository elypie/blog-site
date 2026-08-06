/* Ely's Blog - Public JS Script */

document.addEventListener('DOMContentLoaded', async () => {
  const data = (typeof getBlogDataAsync === 'function') 
    ? await getBlogDataAsync(false) 
    : getBlogData();

  // Dark Mode Toggle with SVG Icons
  const themeBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  if (themeBtn) {
    const isDark = localStorage.getItem('elys_dark_mode') === 'true';
    if (isDark) {
      document.body.classList.add('dark-theme');
      themeBtn.innerHTML = sunIcon;
    } else {
      themeBtn.innerHTML = moonIcon;
    }
    
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDarkNow = document.body.classList.contains('dark-theme');
      themeBtn.innerHTML = isDarkNow ? sunIcon : moonIcon;
      localStorage.setItem('elys_dark_mode', isDarkNow);
    });
  }

  // --- HOMEPAGE DYNAMIC RENDERING ---
  const latestPostRoot = document.getElementById('homepage-latest-post-root');
  const featuredPostsRoot = document.getElementById('homepage-featured-posts-root');

  function renderHomepagePosts() {
    const freshData = data;
    const publishedPosts = freshData.posts.filter(p => p.status === 'Published');

    // Sort published posts by newest first
    publishedPosts.sort((a, b) => (b.id - a.id));

    if (latestPostRoot) {
      if (publishedPosts.length === 0) {
        latestPostRoot.innerHTML = `
          <div style="padding: 60px 0; text-align: center; color: var(--text-muted);">
            <p style="font-size: 15px; font-weight: 600;">No published articles yet. Check back soon!</p>
          </div>
        `;
      } else {
        const latest = publishedPosts[0];
        latestPostRoot.innerHTML = `
          <div class="blog-item-card featured-card-responsive" onclick="window.location.href='blog-detail.html?id=${latest.id}'" style="display: flex; flex-direction: column; padding: 0;">
            <div class="featured-card-img-wrap" style="width: 100%; height: 240px; overflow: hidden; border-radius: 16px 16px 0 0;">
              <img src="${latest.coverImage}" alt="${latest.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div class="featured-card-body" style="padding: 28px; flex: 1; display: flex; flex-direction: column;">
              <div style="margin-bottom: 10px;">
                <span class="badge-category-subtle" style="display: inline-block; padding: 4px 12px; background: rgba(165, 21, 12, 0.08); color: var(--accent-coral); border-radius: 10px; font-size: 12px; font-weight: 700; border: 1px solid rgba(165, 21, 12, 0.15);">${latest.category}</span>
              </div>
              <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 10px; line-height: 1.35; color: var(--text-main);">${latest.title}</h3>
              <div style="display: flex; align-items: center; gap: 14px; color: var(--text-muted); font-size: 13px; font-weight: 500; margin-bottom: 14px; flex-wrap: wrap;">
                <span style="display: inline-flex; align-items: center;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  ${latest.date}
                </span>
                <span>•</span>
                <span style="display: inline-flex; align-items: center;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  ${latest.readTime}
                </span>
              </div>
              <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px; flex: 1; line-height: 1.6;">${latest.summary}</p>
              <a href="blog-detail.html?id=${latest.id}" class="btn-read-more" style="align-self: flex-start;">Continue Reading →</a>
            </div>
          </div>
        `;
      }
    }

    if (featuredPostsRoot) {
      const featured = publishedPosts.filter(p => p.featured);
      if (featured.length === 0) {
        featuredPostsRoot.innerHTML = `
          <div style="padding: 60px 0; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; width: 100%;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent-coral)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <p style="color: var(--text-muted); font-size: 15px; font-weight: 600; margin: 0; text-align: center;">
              No featured posts available for now. Check back soon!
            </p>
          </div>
        `;
      } else {
        featuredPostsRoot.innerHTML = `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
            ${featured.map(post => `
              <div class="blog-item-card featured-card-responsive" onclick="window.location.href='blog-detail.html?id=${post.id}'" style="display: flex; flex-direction: column; padding: 0;">
                <div class="featured-card-img-wrap" style="width: 100%; height: 220px; overflow: hidden; border-radius: 16px 16px 0 0;">
                  <img src="${post.coverImage}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div class="featured-card-body" style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                  <div style="margin-bottom: 10px;">
                    <span class="badge-category-subtle" style="display: inline-block; padding: 4px 12px; background: rgba(165, 21, 12, 0.08); color: var(--accent-coral); border-radius: 10px; font-size: 12px; font-weight: 700; border: 1px solid rgba(165, 21, 12, 0.15);">${post.category}</span>
                  </div>
                  <h4 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">${post.title}</h4>
                  <div style="display: flex; align-items: center; gap: 14px; color: var(--text-muted); font-size: 12px; font-weight: 500; margin-bottom: 12px;">
                    <span style="display: inline-flex; align-items: center;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 5px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      ${post.date}
                    </span>
                    <span style="display: inline-flex; align-items: center;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 5px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      ${post.readTime}
                    </span>
                  </div>
                  <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px; flex: 1; line-height: 1.6;">${post.summary}</p>
                  <a href="blog-detail.html?id=${post.id}" class="btn-read-more" style="align-self: flex-start;">Read Article →</a>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }
  }

  renderHomepagePosts();

  // --- BLOGS PAGE FILTER & SEARCH ---
  const blogsListContainer = document.getElementById('public-blogs-list');
  if (blogsListContainer) {
    const searchInput = document.getElementById('blog-search-input');
    const categoryPillsContainer = document.getElementById('category-pills-wrap');

    let currentCategory = 'All';
    let currentSearch = '';

    // Render category filter pills
    if (categoryPillsContainer) {
      let pillsHTML = `<button class="filter-pill active" data-cat="All">All</button>`;
      data.categories.forEach(cat => {
        pillsHTML += `<button class="filter-pill" data-cat="${cat.name}">${cat.name}</button>`;
      });
      categoryPillsContainer.innerHTML = pillsHTML;

      categoryPillsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-pill')) {
          document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          e.target.classList.add('active');
          currentCategory = e.target.getAttribute('data-cat');
          renderFilteredBlogs();
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderFilteredBlogs();
      });
    }

    function renderFilteredBlogs() {
      const published = data.posts.filter(p => p.status === 'Published');
      const filtered = published.filter(p => {
        const matchesCategory = currentCategory === 'All' || p.category === currentCategory;
        const matchesSearch = p.title.toLowerCase().includes(currentSearch) || p.summary.toLowerCase().includes(currentSearch);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        blogsListContainer.innerHTML = `<p style="padding: 40px; text-align: center; color: var(--text-muted);">No posts found matching your search.</p>`;
        return;
      }

      blogsListContainer.innerHTML = filtered.map(post => `
        <div class="blog-item-card reveal-on-scroll" onclick="window.location.href='blog-detail.html?id=${post.id}'">
          <div class="item-image-box">
            <img src="${post.coverImage}" alt="${post.title}" class="item-cover-img" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div class="item-content-box">
            <div style="margin-bottom: 10px;">
              <span style="display: inline-block; padding: 4px 12px; background: rgba(165, 21, 12, 0.08); color: var(--accent-coral); border-radius: 12px; font-size: 12px; font-weight: 700; border: 1px solid rgba(165, 21, 12, 0.15);">${post.category}</span>
            </div>
            <h3 class="item-title">${post.title}</h3>
            <p class="item-summary">${post.summary}</p>
            <div class="item-meta-row" style="display: flex; align-items: center; gap: 18px; color: var(--text-muted); font-size: 13px; font-weight: 500;">
              <span style="display: inline-flex; align-items: center;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${post.date}
              </span>
              <span style="display: inline-flex; align-items: center;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${post.readTime}
              </span>
            </div>
            <div class="item-action-row">
              <a href="blog-detail.html?id=${post.id}" class="btn-read-more">Read Article →</a>
            </div>
          </div>
        </div>
      `).join('');

      initScrollObserver();
    }

    renderFilteredBlogs();
  }

  // --- SINGLE ARTICLE DETAIL PAGE ---
  const articleDetailRoot = document.getElementById('article-detail-root');
  if (articleDetailRoot) {
    const freshData = getBlogData();
    const publishedPosts = freshData.posts.filter(p => p.status === 'Published');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'), 10) || 1;
    const post = publishedPosts.find(p => p.id === postId) || publishedPosts[0];

    if (!post) {
      articleDetailRoot.innerHTML = `
        <div style="padding: 80px 0; text-align: center; color: var(--text-muted);">
          <h2>Article Not Found</h2>
          <p>The requested article does not exist or has been removed.</p>
          <a href="blogs.html" class="btn-primary" style="margin-top: 16px;">Back to Blogs</a>
        </div>
      `;
      return;
    }

    // Dynamic Title & SEO Metadata Update
    document.title = `${post.title} - EL Journal`;
    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (!ogTitleMeta) {
      ogTitleMeta = document.createElement('meta');
      ogTitleMeta.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleMeta);
    }
    ogTitleMeta.setAttribute('content', post.title);

    const author = freshData.author;
    const currentIndex = publishedPosts.findIndex(p => p.id === post.id);
    const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;

    let relatedPosts = publishedPosts.filter(p => p.id !== post.id && p.category === post.category);
    if (relatedPosts.length < 3) {
      const remaining = publishedPosts.filter(p => p.id !== post.id && p.category !== post.category);
      relatedPosts = [...relatedPosts, ...remaining];
    }
    relatedPosts = relatedPosts.slice(0, 3);

    const relatedHTML = relatedPosts.map(rel => `
      <div class="related-post-item" onclick="window.location.href='blog-detail.html?id=${rel.id}'">
        <img src="${rel.coverImage}" alt="${rel.title}" class="related-post-thumb" />
        <div>
          <h5 class="related-post-title">${rel.title}</h5>
          <span class="related-post-date">${rel.date}</span>
        </div>
      </div>
    `).join('');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    const headingElements = tempDiv.querySelectorAll('h2, h3, h4');
    const tocGroups = [];
    let currentGroup = null;

    headingElements.forEach((h, idx) => {
      const tagName = h.tagName.toLowerCase();
      const id = h.id || `heading-${idx}`;
      const text = h.innerText.trim();

      if (tagName === 'h2') {
        currentGroup = {
          id,
          text,
          children: []
        };
        tocGroups.push(currentGroup);
      } else if (tagName === 'h3' || tagName === 'h4') {
        if (currentGroup) {
          currentGroup.children.push({ id, text });
        } else {
          currentGroup = { id, text, children: [] };
          tocGroups.push(currentGroup);
        }
      }
    });

    const generateTocHTML = (groups) => {
      if (groups.length === 0) return '';

      return groups.map((group) => {
        const hasChildren = group.children && group.children.length > 0;

        return `
          <li class="toc-group ${hasChildren ? 'has-children' : ''}" data-group-id="${group.id}">
            <div class="toc-group-header" onclick="window.handleTocHeaderClick(event, '${group.id}', ${hasChildren})">
              ${hasChildren ? `
                <button type="button" class="toc-chevron-btn" aria-label="Toggle section" onclick="event.stopPropagation(); window.toggleTocGroup('${group.id}');">
                  <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              ` : `<span class="toc-chevron-spacer"></span>`}
              <a href="#${group.id}" class="toc-link parent-link toc-link-target-${group.id}" onclick="event.preventDefault(); window.scrollToHeading('${group.id}', ${hasChildren});">
                ${group.text}
              </a>
            </div>
            ${hasChildren ? `
              <ul class="toc-sublist" id="toc-sublist-${group.id}">
                ${group.children.map(child => `
                  <li class="toc-subitem">
                    <a href="#${child.id}" class="toc-link child-link toc-link-target-${child.id}" onclick="event.preventDefault(); window.scrollToHeading('${child.id}', false);">
                      ${child.text}
                    </a>
                  </li>
                `).join('')}
              </ul>
            ` : ''}
          </li>
        `;
      }).join('');
    };

    window.scrollToHeading = function(id) {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        const yOffset = -90;
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    window.toggleTocGroup = function(groupId) {
      const allGroups = document.querySelectorAll(`.toc-group[data-group-id="${groupId}"]`);
      allGroups.forEach(g => {
        g.classList.toggle('expanded');
      });
    };

    window.handleTocHeaderClick = function(event, groupId, hasChildren) {
      if (event.target.tagName.toLowerCase() === 'a') return;
      if (hasChildren) {
        window.toggleTocGroup(groupId);
      } else {
        window.scrollToHeading(groupId);
      }
    };

    const tocHTML = generateTocHTML(tocGroups);

    articleDetailRoot.innerHTML = `
      <div class="article-reader-container fade-in-up">
        <button class="back-link-btn" onclick="window.location.href='blogs.html'">
          ← Back to Blogs
        </button>

        <!-- 1. Article Header -->
        <header class="article-header" style="margin-bottom: 32px;">
          <div class="category-badge-wrap" style="margin-bottom: 14px;">
            <span class="badge-category-subtle" style="padding: 5px 14px; background: var(--bg-card); color: var(--accent-coral); border-radius: 12px; font-size: 13px; font-weight: 700; border: 1px solid var(--border-light);">${post.category}</span>
          </div>
          <h1 class="article-title" style="font-size: 40px; font-weight: 800; margin-bottom: 12px; font-family: 'Playfair Display', serif; line-height: 1.25;">${post.title}</h1>
          <p class="article-subtitle" style="font-size: 16px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">${post.summary}</p>
          <div class="article-meta-row" style="display: flex; align-items: center; gap: 14px; color: var(--text-muted); font-size: 14px; font-weight: 500; flex-wrap: wrap;">
            <span style="display: inline-flex; align-items: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${post.date}
            </span>
            <span>•</span>
            <span style="display: inline-flex; align-items: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${post.readTime}
            </span>
            <span>•</span>
            <span style="display: inline-flex; align-items: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ${post.author || 'Ely'}
            </span>
          </div>
        </header>

        <!-- 2. Featured Image -->
        <div class="article-cover-wrapper" style="height: 440px; border-radius: 20px; overflow: hidden; margin-bottom: 36px; box-shadow: var(--shadow-sm); cursor: pointer;" onclick="openLightbox('${post.coverImage}')">
          <img src="${post.coverImage}" alt="${post.title}" class="article-cover-img" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>

        <!-- 3. On this page (Collapsible Accordion Card - Expanded by Default) -->
        ${tocGroups.length > 0 ? `
          <div class="toc-card is-accordion expanded" id="main-toc-accordion" style="margin-bottom: 32px; width: 100%; padding: 20px 24px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 20px; box-shadow: var(--shadow-sm); transition: all 0.3s ease;">
            <div class="toc-card-header" onclick="window.toggleMainTocAccordion()" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none;">
              <h3 class="toc-title" style="font-size: 16px; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
                <span>On this page</span>
              </h3>
              <button type="button" class="toc-accordion-btn" aria-label="Toggle Outline" style="background: transparent; border: none; padding: 4px; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; transition: transform 0.3s ease;">
                <svg id="main-toc-chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <div class="toc-card-body" id="main-toc-accordion-body" style="margin-top: 16px; max-height: 1500px; opacity: 1; overflow: hidden; transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin 0.25s ease;">
              <ul class="toc-list">
                ${tocHTML}
              </ul>
            </div>
          </div>
        ` : ''}

        <!-- 4. Blog Article Content -->
        <main class="article-body" id="main-article-content" style="text-align: justify; margin-bottom: 32px;">
          ${post.content}
        </main>

        <!-- 5. Share this Article -->
        <div class="info-card" style="padding: 20px 24px; margin-bottom: 20px; background: var(--bg-card); border-radius: 18px; border: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <div>
            <h4 style="font-size: 15px; font-weight: 800; margin-bottom: 2px;">Share this article</h4>
            <p style="font-size: 13px; color: var(--text-muted); margin: 0;">Enjoyed reading? Share it with your friends and colleagues!</p>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="social-share-btn" onclick="window.open('https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href), '_blank')" title="Share on Facebook" aria-label="Share on Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button class="social-share-btn" onclick="navigator.clipboard.writeText(location.href); alert('Article link copied to clipboard!');" title="Copy Link" aria-label="Copy Link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </button>
          </div>
        </div>

        <!-- 6. About the Author (Compact Card) -->
        <div class="author-card" style="padding: 20px 24px; margin-bottom: 24px; background: var(--bg-card); border-radius: 18px; border: 1px solid var(--border-light);">
          <h4 class="author-card-heading" style="font-size: 15px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 12px; border-bottom: none;">About the Author</h4>
          <div class="author-info-row" style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
            <img src="assets/images/profile-pfp.jpg" alt="Elyssa Contreras" class="author-avatar-img" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-light); flex-shrink: 0;" />
            <div class="author-details">
              <h4 class="author-name" style="font-size: 16px; font-weight: 800; margin: 0;">EL</h4>
              <p class="author-role" style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">IT Student</p>
            </div>
          </div>
          <p class="author-bio" style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0;">A BSIT student at Father Saturnino Urios University with a passion for designing and developing websites while expanding knowledge in cybersecurity. This blog shares knowledge, projects, and insights gained through exploring technology and building secure, reliable applications.</p>
        </div>

        <!-- 7. Article Navigation (Prev/Next) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-light);">
          ${prevPost ? `
            <div class="info-card" style="padding: 16px 20px; cursor: pointer;" onclick="window.location.href='blog-detail.html?id=${prevPost.id}'">
              <span style="font-size: 11px; color: var(--accent-coral); font-weight: 700;">← PREVIOUS ARTICLE</span>
              <h4 style="font-size: 14px; font-weight: 700; margin-top: 4px; color: var(--text-main); line-clamp: 2;">${prevPost.title}</h4>
            </div>
          ` : '<div></div>'}
          ${nextPost ? `
            <div class="info-card" style="padding: 16px 20px; cursor: pointer; text-align: right;" onclick="window.location.href='blog-detail.html?id=${nextPost.id}'">
              <span style="font-size: 11px; color: var(--accent-coral); font-weight: 700;">NEXT ARTICLE →</span>
              <h4 style="font-size: 14px; font-weight: 700; margin-top: 4px; color: var(--text-main); line-clamp: 2;">${nextPost.title}</h4>
            </div>
          ` : '<div></div>'}
        </div>
      </div>
    `;

    // Toggle Main Table of Contents Accordion
    window.toggleMainTocAccordion = function() {
      const card = document.getElementById('main-toc-accordion');
      const body = document.getElementById('main-toc-accordion-body');
      const chevron = document.getElementById('main-toc-chevron-icon');

      if (card && body) {
        const isExpanded = card.classList.contains('expanded');
        if (isExpanded) {
          card.classList.remove('expanded');
          body.style.maxHeight = '0px';
          body.style.opacity = '0';
          body.style.marginTop = '0px';
          if (chevron) chevron.style.transform = 'rotate(-90deg)';
        } else {
          card.classList.add('expanded');
          body.style.maxHeight = '1500px';
          body.style.opacity = '1';
          body.style.marginTop = '16px';
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      }
    };

    // Image Lightbox Helper Function
    window.openLightbox = function(src) {
      const modal = document.getElementById('image-lightbox-modal');
      const img = document.getElementById('lightbox-modal-img');
      if (modal && img) {
        img.src = src;
        modal.style.display = 'flex';
      }
    };

    // Attach Lightbox & IntersectionObserver for active TOC highlight + auto expand on scroll
    setTimeout(() => {
      document.querySelectorAll('#main-article-content img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.setAttribute('loading', 'lazy');
        img.addEventListener('click', () => window.openLightbox(img.src));
      });

      const articleHeadings = document.querySelectorAll('#main-article-content h2, #main-article-content h3');
      if (articleHeadings.length > 0) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              if (!id) return;

              document.querySelectorAll('.toc-link').forEach(link => link.classList.remove('active'));
              document.querySelectorAll('.toc-group-header').forEach(hdr => hdr.classList.remove('active-header'));

              const activeLinks = document.querySelectorAll(`.toc-link-target-${id}`);
              activeLinks.forEach(link => {
                link.classList.add('active');
                const parentHeader = link.closest('.toc-group-header');
                if (parentHeader) {
                  parentHeader.classList.add('active-header');
                }
              });
            }
          });
        }, { rootMargin: '-80px 0px -55% 0px' });

        articleHeadings.forEach(h => observer.observe(h));
      }
    }, 100);
  }

  // --- Scroll Reveal Animations & Back to Top Observer ---
  function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.blog-item-card, .info-card, .metric-card, .toc-card, .author-card, section').forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }

  initScrollObserver();

  // Floating Back to Top Button Scroll Listener
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });
  }
});
