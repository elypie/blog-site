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
