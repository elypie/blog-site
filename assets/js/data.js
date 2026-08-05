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
    { id: 1, name: "Information Assurance", count: 0, color: "#E55B44" },
    { id: 2, name: "Organizational Context", count: 0, color: "#F59E0B" },
    { id: 3, name: "Computing Ethics", count: 0, color: "#8B5CF6" },
    { id: 4, name: "Data Privacy", count: 0, color: "#3B82F6" },
    { id: 5, name: "Security Principles", count: 0, color: "#10B981" },
    { id: 6, name: "Others", count: 0, color: "#6B7280" }
  ],
  posts: []
};

// LocalStorage Persistence Helper
function getBlogData() {
  const saved = localStorage.getItem('elys_blog_data');
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      // Sync empty posts if initialData posts is empty
      parsed.posts = initialData.posts;
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
localStorage.setItem('elys_blog_data', JSON.stringify(initialData));

