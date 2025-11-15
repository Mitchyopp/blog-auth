const API_BASE = '';

let authToken = localStorage.getItem('token') || null;
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

const authSection = document.getElementById('auth-section');
const userSection = document.getElementById('user-section');
const currentUserSpan = document.getElementById('current-user');
const authMessage = document.getElementById('auth-message');

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

const postForm = document.getElementById('post-form');
const postCategorySelect = document.getElementById('post-category');
const filterCategorySelect = document.getElementById('filter-category');
const postsSection = document.getElementById('posts-section');

function setAuthState(token, user) {
  authToken = token;
  currentUser = user;

  if (token && user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    currentUserSpan.textContent = user.username;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authSection.classList.remove('hidden');
    userSection.classList.add('hidden');
    currentUserSpan.textContent = '';
  }
  loadPosts();
}

async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authMessage.textContent = '';
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  try {
    await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    authMessage.textContent = 'Registered! please log in.';
  } catch (err) {
    authMessage.textContent = err.message;
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authMessage.textContent = '';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  try {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthState(data.token, data.user);
  } catch (err) {
    authMessage.textContent = err.message;
  }
});

logoutBtn.addEventListener('click', () => {
  setAuthState(null, null);
});

async function loadCategories() {
  try {
    const categories = await apiFetch('/api/categories');
    postCategorySelect.innerHTML = '<option value="">Select category</option>';
    filterCategorySelect.innerHTML = '<option value="">All</option>';
    for (const c of categories) {
      const opt1 = document.createElement('option');
      opt1.value = c.id;
      opt1.textContent = c.name;
      postCategorySelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = c.name;
      opt2.textContent = c.name;
      filterCategorySelect.appendChild(opt2);
    }
  } catch (err) {
    console.error('Categories failed to load..', err);
  }
}

filterCategorySelect.addEventListener('change', () => {
  loadPosts();
});

async function loadPosts() {
  postsSection.innerHTML = 'Loading posts...';
  const categoryName = filterCategorySelect.value;
  const query = categoryName ? `?category=${encodeURIComponent(categoryName)}` : '';
  try {
    const posts = await apiFetch('/api/posts' + query);
    renderPosts(posts);
  } catch (err) {
    postsSection.textContent = 'Failed to load posts: ' + err.message;
  }
}

function renderPosts(posts) {
  if (!posts.length) {
    postsSection.textContent = 'There are no posts here yet.. how about you make one?';
    return;
  }
  postsSection.innerHTML = '';
  for (const post of posts) {
    const div = document.createElement('div');
    div.className = 'post';
    const isOwner = currentUser && post.userId === currentUser.id;
    div.innerHTML = `
      <h3>${post.title}</h3>
      <div class="post-meta">
        By ${post.User ? post.User.username : 'Unknown'}
        ${post.Category ? ` | Category: ${post.Category.name}` : ''}
      </div>
      <p>${post.content}</p>
      ${isOwner ? `
        <button class="delete-btn" data-id="${post.id}">Delete</button>
      ` : ''}
    `;
    postsSection.appendChild(div);
  }

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (!confirm('Delete this post?')) return;
      try {
        await apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
        loadPosts();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    });
  });
}
