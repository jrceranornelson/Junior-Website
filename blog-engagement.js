'use strict';

/* ═══════════════════════════════════════════════════════════
   BLOG ENGAGEMENT — blog-engagement.js
   Like button + Comments via localStorage
   Usage: include this script, then call initEngagement(articleId)
═══════════════════════════════════════════════════════════ */

function initEngagement(articleId) {
  const LIKE_KEY    = 'blog_likes_'    + articleId;
  const COMMENT_KEY = 'blog_comments_' + articleId;
  const OWNED_KEY   = 'blog_owned_'    + articleId;

  /* ── Helpers ─────────────────────────────────────────── */
  function getComments() {
    try { return JSON.parse(localStorage.getItem(COMMENT_KEY)) || []; }
    catch { return []; }
  }

  function saveComments(list) {
    localStorage.setItem(COMMENT_KEY, JSON.stringify(list));
  }

  function getOwned() {
    try { return JSON.parse(localStorage.getItem(OWNED_KEY)) || []; }
    catch { return []; }
  }

  function addOwned(id) {
    const owned = getOwned();
    owned.push(id);
    localStorage.setItem(OWNED_KEY, JSON.stringify(owned));
  }

  function isLiked() {
    return localStorage.getItem(LIKE_KEY) === '1';
  }

  function getLikeCount() {
    return parseInt(localStorage.getItem(LIKE_KEY + '_count') || '0', 10);
  }

  function saveLike(liked, count) {
    localStorage.setItem(LIKE_KEY, liked ? '1' : '0');
    localStorage.setItem(LIKE_KEY + '_count', String(count));
  }

  function timeAgo(isoDate) {
    const diff = (Date.now() - new Date(isoDate).getTime()) / 1000;
    if (diff < 60)      return 'just now';
    if (diff < 3600)    return Math.floor(diff / 60)   + ' min ago';
    if (diff < 86400)   return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800)  return Math.floor(diff / 86400)+ 'd ago';
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  /* ── Like button ─────────────────────────────────────── */
  const likeBtn   = document.getElementById('likeBtn');
  const likeCount = document.getElementById('likeCount');

  function renderLike() {
    const liked = isLiked();
    const count = getLikeCount();
    likeCount.textContent = count;
    likeBtn.classList.toggle('liked', liked);
    likeBtn.setAttribute('aria-pressed', String(liked));
    likeBtn.setAttribute('aria-label', liked ? 'Unlike this article' : 'Like this article');
  }

  likeBtn.addEventListener('click', () => {
    const wasLiked = isLiked();
    const count    = getLikeCount();
    const newCount = wasLiked ? Math.max(0, count - 1) : count + 1;
    saveLike(!wasLiked, newCount);

    // Pop animation
    likeBtn.classList.remove('pop');
    void likeBtn.offsetWidth; // reflow to restart animation
    likeBtn.classList.add('pop');

    renderLike();
  });

  renderLike();

  /* ── Comment count ───────────────────────────────────── */
  function updateCount() {
    const el = document.getElementById('commentCount');
    if (el) el.textContent = getComments().length;
  }

  /* ── Render comments ─────────────────────────────────── */
  function renderComments() {
    const list    = document.getElementById('commentList');
    const comments = getComments();
    const owned   = getOwned();

    updateCount();

    if (!comments.length) {
      list.innerHTML = `<p class="comment-empty">Be the first to leave a comment.</p>`;
      return;
    }

    list.innerHTML = comments
      .slice()
      .reverse()            // newest first
      .map(c => `
        <div class="comment-item" data-id="${c.id}">
          <div class="comment-avatar">${initials(c.name)}</div>
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-author-name">${escapeHtml(c.name)}</span>
              <span class="comment-time">${timeAgo(c.date)}</span>
            </div>
            <p class="comment-text">${escapeHtml(c.text).replace(/\n/g, '<br>')}</p>
            <button
              class="comment-delete-btn ${owned.includes(c.id) ? 'visible' : ''}"
              data-id="${c.id}"
              aria-label="Delete comment"
            >Delete</button>
          </div>
        </div>
      `)
      .join('');

    // Delete handlers
    list.querySelectorAll('.comment-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const updated = getComments().filter(c => c.id !== id);
        saveComments(updated);
        renderComments();
      });
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderComments();

  /* ── Comment form ────────────────────────────────────── */
  const form       = document.getElementById('commentForm');
  const nameInput  = document.getElementById('commentName');
  const textInput  = document.getElementById('commentText');
  const submitBtn  = document.getElementById('commentSubmit');
  const successMsg = document.getElementById('commentSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    if (!name || !text) return;

    submitBtn.disabled = true;

    const comment = {
      id:   Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      text,
      date: new Date().toISOString(),
    };

    const comments = getComments();
    comments.push(comment);
    saveComments(comments);
    addOwned(comment.id);

    // Reset form
    nameInput.value = '';
    textInput.value = '';

    // Show success flash
    successMsg.classList.add('visible');
    setTimeout(() => successMsg.classList.remove('visible'), 3000);

    submitBtn.disabled = false;
    renderComments();

    // Scroll to new comment
    setTimeout(() => {
      const first = document.querySelector('.comment-item');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  });
}
