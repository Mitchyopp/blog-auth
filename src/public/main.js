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
