import { openDB, withStore } from './services/database.js';
import { createModal } from './components/modal/modal.js';
import { createAddPostModal } from './components/modal/addPost.js';
import { initializePostsUI } from './components/posts/posts.js';
import { DB_CONFIG } from '../../config.js';

const main = async () => {
  const addPostBtn = document.getElementById('add-post-btn');
  const firstPostBtn = document.getElementById('firstPostBtn');

  addPostBtn.addEventListener('click', () => createModal(createAddPostModal));
  firstPostBtn.addEventListener('click', () => createModal(createAddPostModal));

  if (window.indexedDB) {
    const db = await openDB(DB_CONFIG);
    const postsStore = withStore(db, DB_CONFIG.storeName);
    const posts = await postsStore.getAllDataFromStore();

    initializePostsUI(posts);
  }
};

main();
