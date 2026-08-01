/* Ely's Blog - Public JS Script */

document.addEventListener('DOMContentLoaded', () => {
  const data = getBlogData();

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
    const freshData = getBlogData();
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

      if (tagName === 'h2' || (tagName === 'h3' && !text.match(/^\d+\.\d+/))) {
        currentGroup = {
          id,
          text,
          children: []
        };
        tocGroups.push(currentGroup);
      } else {
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

      return groups.map((group, groupIdx) => {
        const hasChildren = group.children && group.children.length > 0;
        const groupId = `toc-group-${groupIdx}`;

        if (!hasChildren) {
          return `
            <li class="toc-item parent-item">
              <div class="toc-parent-row" style="display: flex; align-items: center; gap: 8px;">
                <span style="color: var(--accent-coral); font-weight: 800; font-size: 14px;">•</span>
                <a href="#${group.id}" class="toc-item-link parent-link" onclick="event.preventDefault(); document.getElementById('${group.id}')?.scrollIntoView({behavior:'smooth'});">${group.text}</a>
              </div>
            </li>
          `;
        }

        return `
          <li class="toc-item parent-item has-children">
            <div class="toc-parent-row" style="display: flex; align-items: center; gap: 8px;">
              <button type="button" class="toc-toggle-btn" aria-expanded="false" aria-controls="${groupId}" aria-label="Toggle sub-sections for ${group.text}" onclick="toggleTocGroup(this)">
                <svg class="toc-arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.25s ease; color: var(--accent-coral);">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <a href="#${group.id}" class="toc-item-link parent-link" style="font-weight: 700; color: var(--text-main);" onclick="event.preventDefault(); toggleTocGroupLink(this, '${group.id}');">${group.text}</a>
            </div>
            <ul id="${groupId}" class="toc-nested-list" style="display: none; padding-left: 28px; margin-top: 10px; flex-direction: column; gap: 8px; list-style: none;">
              ${group.children.map(child => `
                <li class="toc-item child-item">
                  <a href="#${child.id}" class="toc-item-link child-link" style="font-size: 13.5px; font-weight: 500; color: var(--text-muted);" onclick="event.preventDefault(); document.getElementById('${child.id}')?.scrollIntoView({behavior:'smooth'});">${child.text}</a>
                </li>
              `).join('')}
            </ul>
          </li>
        `;
      }).join('');
    };

    window.toggleTocGroup = function(btn) {
      const parentRow = btn.closest('.toc-parent-row');
      const nestedList = parentRow.nextElementSibling;
      const arrow = btn.querySelector('.toc-arrow-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        nestedList.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        nestedList.style.display = 'flex';
        if (arrow) arrow.style.transform = 'rotate(90deg)';
      }
    };

    window.toggleTocGroupLink = function(link, targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }

      const parentRow = link.closest('.toc-parent-row');
      if (parentRow) {
        const btn = parentRow.querySelector('.toc-toggle-btn');
        if (btn && btn.getAttribute('aria-expanded') !== 'true') {
          window.toggleTocGroup(btn);
        }
      }
    };

    const tocHTML = generateTocHTML(tocGroups);

    articleDetailRoot.innerHTML = `
      <div class="container fade-in-up">
        <button class="back-link-btn" onclick="window.location.href='blogs.html'">
          ← Back to Blogs
        </button>

        <header class="article-header" style="margin-bottom: 32px;">
          <div class="category-badge-wrap" style="margin-bottom: 14px;">
            <span class="badge-category-subtle" style="padding: 5px 14px; background: rgba(165, 21, 12, 0.08); color: var(--accent-coral); border-radius: 12px; font-size: 13px; font-weight: 700; border: 1px solid rgba(165, 21, 12, 0.15);">${post.category}</span>
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

        <div class="article-cover-wrapper" style="height: 460px; border-radius: 20px; overflow: hidden; margin-bottom: 32px; box-shadow: var(--shadow-sm); cursor: pointer;" onclick="openLightbox('${post.coverImage}')">
          <img src="${post.coverImage}" alt="${post.title}" class="article-cover-img" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>

        ${tocGroups.length > 0 ? `
          <div class="toc-card mobile-toc-only" style="margin-bottom: 28px;">
            <h3 class="toc-title" style="font-size: 16px; font-weight: 800; margin-bottom: 16px;">On this page</h3>
            <ul class="toc-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
              ${tocHTML}
            </ul>
          </div>
        ` : ''}

        <div class="article-content-grid" style="display: grid; grid-template-columns: 1fr 340px; gap: 48px;">
          <main class="article-body" id="main-article-content" style="text-align: justify;">
            ${post.content}

            <div class="author-card mobile-author-only" style="margin-top: 36px; margin-bottom: 24px;">
              <h3 class="author-card-heading" style="font-size: 16px; font-weight: 800; margin-bottom: 16px;">About the Author</h3>
              <div class="author-info-row" style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
                <div class="author-avatar-circle" style="width: 48px; height: 48px; border-radius: 50%; background: #FDE8E3; color: var(--accent-coral); font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 16px;">EL</div>
                <div class="author-details">
                  <h4 class="author-name" style="font-size: 16px; font-weight: 800; margin: 0;">EL</h4>
                  <p class="author-role" style="font-size: 12px; color: var(--text-muted); margin: 0;">IT Student</p>
                </div>
              </div>
              <p class="author-bio" style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">Passionate about technology, learning, and sharing insights through educational writing.</p>
            </div>

            <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-light);" />

            <div class="info-card" style="padding: 24px 28px; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-light);">
              <div>
                <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">Share this article</h4>
                <p style="font-size: 13px; color: var(--text-muted); margin: 0;">Enjoyed reading? Share it with your friends and colleagues!</p>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <button class="social-share-btn" onclick="window.open('https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href), '_blank')" title="Share on Facebook">f</button>
                <button class="social-share-btn" onclick="navigator.clipboard.writeText(location.href); alert('Article link copied to clipboard!');" title="Copy Link">🔗</button>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              ${prevPost ? `
                <div class="info-card" style="padding: 20px; cursor: pointer;" onclick="window.location.href='blog-detail.html?id=${prevPost.id}'">
                  <span style="font-size: 12px; color: var(--accent-coral); font-weight: 700;">← PREVIOUS ARTICLE</span>
                  <h4 style="font-size: 15px; font-weight: 700; margin-top: 6px; color: var(--text-main); line-clamp: 2;">${prevPost.title}</h4>
                </div>
              ` : '<div></div>'}
              ${nextPost ? `
                <div class="info-card" style="padding: 20px; cursor: pointer; text-align: right;" onclick="window.location.href='blog-detail.html?id=${nextPost.id}'">
                  <span style="font-size: 12px; color: var(--accent-coral); font-weight: 700;">NEXT ARTICLE →</span>
                  <h4 style="font-size: 15px; font-weight: 700; margin-top: 6px; color: var(--text-main); line-clamp: 2;">${nextPost.title}</h4>
                </div>
              ` : '<div></div>'}
            </div>
          </main>

          <aside class="article-sidebar desktop-sidebar-only">
            <div class="sticky-sidebar-content" style="position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px;">
              ${tocGroups.length > 0 ? `
                <div class="toc-card">
                  <h3 class="toc-title" style="font-size: 16px; font-weight: 800; margin-bottom: 16px;">On this page</h3>
                  <ul class="toc-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
                    ${tocHTML}
                  </ul>
                </div>
              ` : ''}

              <div class="author-card">
                <h3 class="author-card-heading" style="font-size: 16px; font-weight: 800; margin-bottom: 16px;">About the Author</h3>
                <div class="author-info-row" style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
                  <div class="author-avatar-circle" style="width: 48px; height: 48px; border-radius: 50%; background: #FDE8E3; color: var(--accent-coral); font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 16px;">EL</div>
                  <div class="author-details">
                    <h4 class="author-name" style="font-size: 16px; font-weight: 800; margin: 0;">EL</h4>
                    <p class="author-role" style="font-size: 12px; color: var(--text-muted); margin: 0;">IT Student</p>
                  </div>
                </div>
                <p class="author-bio" style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">Passionate about technology, learning, and sharing insights through educational writing.</p>
              </div>

              ${relatedPosts.length > 0 ? `
                <div class="info-card" style="padding: 24px;">
                  <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 16px;">Related Posts</h3>
                  <div style="display: flex; flex-direction: column; gap: 14px;">
                    ${relatedHTML}
                  </div>
                </div>
              ` : ''}
            </div>
          </aside>
        </div>
      </div>
    `;

    // Image Lightbox Helper Function
    window.openLightbox = function(src) {
      const modal = document.getElementById('image-lightbox-modal');
      const img = document.getElementById('lightbox-modal-img');
      if (modal && img) {
        img.src = src;
        modal.style.display = 'flex';
      }
    };

    // Attach Lightbox click listener to all article content images
    setTimeout(() => {
      document.querySelectorAll('#main-article-content img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.setAttribute('loading', 'lazy');
        img.addEventListener('click', () => window.openLightbox(img.src));
      });

      // Highlight active TOC item on scroll
      const articleHeadings = document.querySelectorAll('#main-article-content h1, #main-article-content h2, #main-article-content h3, #main-article-content h4');
      if (articleHeadings.length > 0) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              document.querySelectorAll('.toc-item-link').forEach(link => {
                link.style.color = 'var(--text-muted)';
                link.style.fontWeight = '400';
              });
              document.querySelectorAll('.toc-bullet').forEach(b => b.style.visibility = 'hidden');

              const activeLink = document.getElementById(`toc-link-${id}`);
              const activeBullet = document.getElementById(`toc-bullet-${id}`);
              if (activeLink) {
                activeLink.style.color = 'var(--accent-coral)';
                activeLink.style.fontWeight = '700';
              }
              if (activeBullet) {
                activeBullet.style.visibility = 'visible';
              }
            }
          });
        }, { rootMargin: '-100px 0px -60% 0px' });

        articleHeadings.forEach(h => observer.observe(h));
      }
    }, 100);
  }

  // --- Scroll Reveal Animations ---
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
});
