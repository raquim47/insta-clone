import { CLASSNAME_SHOW } from '../../utils/className.js';
import { postView } from '../modal/postView.js';
import { createModal } from '../modal/modal.js';
import { DB_CONFIG } from '../../../../config.js';
import { openDB, withStore } from '../../services/database.js';

export const toggleEmptyMessage = (target) => {
  const isEmpty = !target.hasChildNodes();
  const emptyElement = document.querySelector('.empty');

  if (isEmpty) {
    emptyElement.classList.add(CLASSNAME_SHOW);
  } else {
    emptyElement.classList.remove(CLASSNAME_SHOW);
  }
};

const createPostItem = (postData) => {
  const postItem = document.createElement('li');
  postItem.innerHTML = `<img src="${postData.imageUrl}" />`;

  postItem.dataset.key = postData.key;

  postItem.addEventListener('click', async () => {
    const db = await openDB(DB_CONFIG);
    const store = withStore(db, DB_CONFIG.storeName);
    const currentPostData = await store.getDataFromStore(
      parseInt(postItem.dataset.key)
    );
    createModal(() => postView(currentPostData));
  });

  return postItem;
};

export const initializePostsUI = (posts) => {
  const postsListElement = document.querySelector('.posts__list');
  // postsListElement.innerHTML = '';

  posts.forEach((post) => {
    const postItem = createPostItem(post);
    postsListElement.prepend(postItem);
  });

  toggleEmptyMessage(postsListElement);
};

export const addPostUI = (postData) => {
  const postsListElement = document.querySelector('.posts__list');
  const postItem = createPostItem(postData);
  postsListElement.prepend(postItem);

  toggleEmptyMessage(postsListElement);
};

export const deletePostUI = (key) => {
  const postsListElement = document.querySelector('.posts__list');
  const postItem = postsListElement.querySelector(`[data-key="${key}"]`);
  postsListElement.removeChild(postItem);

  toggleEmptyMessage(postsListElement);
};
