/* Ely's Blog - Admin JS Script */

// Auth Guard: check if admin is logged in
if (localStorage.getItem('elys_admin_logged_in') !== 'true') {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  initAdminTheme();

  // Async data fetch from Supabase (with fallback)
  const data = (typeof getBlogDataAsync === 'function') 
    ? await getBlogDataAsync(true) 
    : getBlogData();

  // Setup Logout action for sidebar exit links
  const sidebarExitLink = document.querySelector('.sidebar-footer .sidebar-link');
  if (sidebarExitLink) {
    sidebarExitLink.addEventListener('click', async (e) => {
      e.preventDefault();
      if (typeof signOutAdminWithSupabase === 'function') {
        await signOutAdminWithSupabase();
      }
      localStorage.removeItem('elys_admin_logged_in');
      localStorage.removeItem('elys_admin_user');
      window.location.href = 'login.html';
    });
  }

  // Dashboard Overview Metrics
  const totalPostsEl = document.getElementById('metric-total-posts');
  const totalCatsEl = document.getElementById('metric-total-cats');
  const publishedEl = document.getElementById('metric-published');
  const draftsEl = document.getElementById('metric-drafts');

  if (totalPostsEl) totalPostsEl.textContent = data.posts.length;
  if (totalCatsEl) totalCatsEl.textContent = data.categories.length;
  if (publishedEl) publishedEl.textContent = data.posts.filter(p => p.status === 'Published').length;
  if (draftsEl) draftsEl.textContent = data.posts.filter(p => p.status === 'Draft').length;

  // Admin Posts Table Rendering
  const postsTableBody = document.getElementById('admin-posts-table-body');
  if (postsTableBody) {
    let currentTab = 'all';
    const categoryParam = new URLSearchParams(window.location.search).get('category');

    function renderPostsTable() {
      const filtered = data.posts.filter(p => {
        if (categoryParam && p.category.toLowerCase() !== categoryParam.toLowerCase()) {
          return false;
        }
        if (currentTab === 'published') return p.status === 'Published';
        if (currentTab === 'draft') return p.status === 'Draft';
        return true;
      });

      if (filtered.length === 0) {
        postsTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
              No blog posts found in database.
            </td>
          </tr>
        `;
        return;
      }

      postsTableBody.innerHTML = filtered.map(post => {
        const viewCount = Number(post.views) || 0;
        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${post.coverImage}" alt="" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover;" />
                <strong style="max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${post.title}</strong>
              </div>
            </td>
            <td><span class="badge-category-subtle" style="padding: 4px 10px; background: rgba(165,21,12,0.08); color: var(--accent-coral); border-radius: 12px; font-size: 12px; font-weight: 600;">${post.category}</span></td>
            <td>
              <span class="badge-status ${post.status === 'Published' ? 'published' : 'draft'}" onclick="toggleStatus(${post.id})" style="cursor: pointer;">
                ● ${post.status}
              </span>
            </td>
            <td><strong>👁️ ${viewCount.toLocaleString()}</strong></td>
            <td>${post.date}</td>
            <td style="text-align: right;">
              <button onclick="editPost(${post.id})" class="btn-action-edit">Edit</button>
              <button onclick="deletePost(${post.id})" class="btn-action-delete">Delete</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Tab button events
    document.querySelectorAll('.table-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.table-tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTab = e.target.getAttribute('data-tab');
        renderPostsTable();
      });
    });

    renderPostsTable();
  }

  // Global functions for inline table events
  window.toggleStatus = async function (id) {
    const post = data.posts.find(p => p.id === id);
    if (post) {
      post.status = post.status === 'Published' ? 'Draft' : 'Published';
      if (typeof savePostAsync === 'function') {
        await savePostAsync(post, true);
      } else {
        saveBlogData(data);
      }
      window.location.reload();
    }
  };

  window.deletePost = async function (id) {
    if (confirm("Delete this blog post?")) {
      if (typeof deletePostAsync === 'function') {
        await deletePostAsync(id);
      } else {
        data.posts = data.posts.filter(p => p.id !== id);
        saveBlogData(data);
      }
      window.location.reload();
    }
  };

  window.editPost = function (id) {
    window.location.href = `post-editor.html?id=${id}`;
  };
});

function initAdminTheme() {
  const savedTheme = localStorage.getItem('elys_admin_theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  const themeToggleBtn = document.getElementById('admin-theme-toggle');
  if (themeToggleBtn) {
    updateThemeIcon(themeToggleBtn, savedTheme === 'dark');
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      const newTheme = isDark ? 'dark' : 'light';
      localStorage.setItem('elys_admin_theme', newTheme);
      updateThemeIcon(themeToggleBtn, isDark);
    });
  }
}

function updateThemeIcon(btn, isDark) {
  if (isDark) {
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      <span>Light Mode</span>
    `;
  } else {
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      <span>Dark Mode</span>
    `;
  }
}
