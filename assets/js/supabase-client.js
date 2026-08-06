/* Ely's Blog - Supabase API Client & Data Adapter */

let _supabaseClient = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;

  if (isSupabaseConfigured() && window.supabase) {
    try {
      _supabaseClient = window.supabase.createClient(
        window.ENV.SUPABASE_URL,
        window.ENV.SUPABASE_ANON_KEY
      );
      return _supabaseClient;
    } catch (err) {
      console.warn('Supabase initialization failed, falling back to local mode:', err);
    }
  }
  return null;
}

// Map database post fields (snake_case) to app post fields (camelCase)
function mapPostFromDb(dbPost) {
  if (!dbPost) return null;
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    category: dbPost.category || 'Information Assurance',
    status: dbPost.status || 'Published',
    date: dbPost.created_at ? new Date(dbPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 5, 2026',
    readTime: dbPost.read_time || '5 min read',
    author: dbPost.author || 'Elyssa',
    views: Number(dbPost.views || 0),
    featured: Boolean(dbPost.featured),
    isLatest: Boolean(dbPost.is_latest),
    coverImage: dbPost.cover_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    summary: dbPost.summary || '',
    content: dbPost.content || ''
  };
}

// Map app post fields to database fields
function mapPostToDb(appPost) {
  return {
    title: appPost.title,
    slug: appPost.slug || appPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    summary: appPost.summary || '',
    content: appPost.content || '',
    cover_image: appPost.coverImage,
    category: appPost.category,
    author: appPost.author || 'Elyssa',
    read_time: appPost.readTime || '5 min read',
    status: appPost.status || 'Published',
    featured: appPost.featured || false,
    is_latest: appPost.isLatest || false
  };
}

// --- SUPABASE API CALLS ---

// Fetch published posts for public site
async function fetchPublishedPostsFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('status', 'Published')
      .order('id', { ascending: false });

    if (error) throw error;
    return data ? data.map(mapPostFromDb) : [];
  } catch (err) {
    console.error('Error fetching published posts from Supabase:', err);
    return null;
  }
}

// Fetch all posts (published & draft) for admin panel
async function fetchAllPostsFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data ? data.map(mapPostFromDb) : [];
  } catch (err) {
    console.error('Error fetching all posts from Supabase:', err);
    return null;
  }
}

// Fetch single post by ID or Slug
async function fetchPostBySlugOrIdFromSupabase(identifier) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const query = client.from('posts').select('*');
    if (!isNaN(identifier)) {
      query.eq('id', parseInt(identifier, 10));
    } else {
      query.eq('slug', identifier);
    }
    const { data, error } = await query.single();
    if (error) throw error;
    return mapPostFromDb(data);
  } catch (err) {
    console.error('Error fetching post from Supabase:', err);
    return null;
  }
}

// Create new post in Supabase
async function createPostInSupabase(appPost) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const dbPayload = mapPostToDb(appPost);
    const { data, error } = await client
      .from('posts')
      .insert([dbPayload])
      .select()
      .single();

    if (error) throw error;
    return mapPostFromDb(data);
  } catch (err) {
    console.error('Error creating post in Supabase:', err);
    throw err;
  }
}

// Update existing post in Supabase
async function updatePostInSupabase(id, appPost) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const dbPayload = mapPostToDb(appPost);
    const { data, error } = await client
      .from('posts')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapPostFromDb(data);
  } catch (err) {
    console.error('Error updating post in Supabase:', err);
    throw err;
  }
}

// Delete post from Supabase
async function deletePostFromSupabase(id) {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting post from Supabase:', err);
    return false;
  }
}

// Fetch categories from Supabase
async function fetchCategoriesFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching categories from Supabase:', err);
    return null;
  }
}

// --- SUPABASE AUTHENTICATION HELPERS ---

async function signInAdminWithSupabase(email, password) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase authentication failed:', err);
    throw err;
  }
}

async function signOutAdminWithSupabase() {
  const client = getSupabaseClient();
  if (!client) return;
  await client.auth.signOut();
}

async function getAdminSessionFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data } = await client.auth.getSession();
  return data ? data.session : null;
}

// --- VIEWS TRACKER, COMMENTS API & REALTIME SUBSCRIPTIONS ---

// Increment view count for a specific post
async function incrementPostViewsFromSupabase(postId) {
  const client = getSupabaseClient();
  if (!client || !postId) return null;

  try {
    const { data: postData } = await client.from('posts').select('views').eq('id', postId).single();
    const currentViews = postData ? (postData.views || 0) : 0;
    const newViews = currentViews + 1;
    const { error } = await client.from('posts').update({ views: newViews }).eq('id', postId);
    if (error) console.warn('Could not update views in Supabase:', error);
    return newViews;
  } catch (err) {
    console.warn('Error incrementing post views:', err);
    return null;
  }
}

// Fetch comments for a specific post
async function fetchPostCommentsFromSupabase(postId) {
  const client = getSupabaseClient();
  if (!client || !postId) return null;

  try {
    const { data, error } = await client
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(c => ({
      id: c.id,
      postId: c.post_id,
      authorName: c.author_name,
      authorEmail: c.author_email,
      content: c.content,
      likes: c.likes || 0,
      parentId: c.parent_id || null,
      createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'
    }));
  } catch (err) {
    console.warn('Error fetching comments from Supabase:', err);
    return null;
  }
}

// Add a new comment or reply
async function addPostCommentToSupabase(commentObj) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let targetPostId = commentObj.postId;

    // Verify post exists in Supabase posts table
    if (targetPostId) {
      const { data: existingPost } = await client.from('posts').select('id').eq('id', targetPostId).single();
      if (!existingPost) {
        const { data: allPosts } = await client.from('posts').select('id').limit(1);
        if (allPosts && allPosts.length > 0) {
          targetPostId = allPosts[0].id;
        } else if (typeof initialData !== 'undefined' && initialData.posts && initialData.posts[0]) {
          const firstPost = initialData.posts[0];
          const { data: newPost } = await client.from('posts').insert([mapPostToDb(firstPost)]).select();
          if (newPost && newPost[0]) targetPostId = newPost[0].id;
        }
      }
    }

    const dbPayload = {
      post_id: targetPostId || 1,
      author_name: commentObj.authorName,
      author_email: commentObj.authorEmail || '',
      content: commentObj.content,
      parent_id: commentObj.parentId || null,
      likes: 0
    };
    const { data, error } = await client.from('comments').insert([dbPayload]).select();
    if (error) throw error;
    if (data && data[0]) {
      const c = data[0];
      return {
        id: c.id,
        postId: c.post_id,
        authorName: c.author_name,
        authorEmail: c.author_email,
        content: c.content,
        likes: c.likes || 0,
        parentId: c.parent_id || null,
        createdAt: 'Just now'
      };
    }
    return null;
  } catch (err) {
    console.warn('Error adding comment to Supabase:', err);
    return null;
  }
}

// Delete a comment (Admin operation)
async function deleteCommentFromSupabase(commentId) {
  const client = getSupabaseClient();
  if (!client || !commentId) return false;

  try {
    const { error } = await client.from('comments').delete().eq('id', commentId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Error deleting comment in Supabase:', err);
    return false;
  }
}

// Toggle comment like count
async function toggleCommentLikeInSupabase(commentId, currentLikes) {
  const client = getSupabaseClient();
  if (!client) return currentLikes + 1;

  try {
    const newLikes = (currentLikes || 0) + 1;
    const { error } = await client.from('comments').update({ likes: newLikes }).eq('id', commentId);
    if (error) console.warn('Could not update comment likes in Supabase:', error);
    return newLikes;
  } catch (err) {
    console.warn('Error liking comment:', err);
    return currentLikes + 1;
  }
}

// Supabase Realtime Subscription for Comments
function subscribeToPostComments(postId, callback) {
  const client = getSupabaseClient();
  if (!client || !postId) return null;

  try {
    const channel = client.channel(`comments-realtime-post-${postId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          if (typeof callback === 'function') callback(payload);
        }
      )
      .subscribe();

    return channel;
  } catch (err) {
    console.warn('Could not subscribe to Supabase Realtime comments:', err);
    return null;
  }
}

