import { withStore, openDB } from '../../services/database.js';
import { DB_CONFIG } from '../../../../config.js';
import { CLASSNAME_EDIT_MODE } from '../../utils/className.js';
import { closeModal } from './modal.js';
import { deletePostUI } from '../posts/posts.js';

const editPost = async (postKey, newText) => {
  try {
    const db = await openDB(DB_CONFIG);
    const store = withStore(db, DB_CONFIG.storeName);
    const updatedPostData = { textContent: newText };
    await store.updateDataInStore(postKey, updatedPostData);
    return postKey;
  } catch (error) {
    console.error('게시물 수정 중 오류가 발생했습니다:', error);
    throw error;
  }
};

const deletePost = async (postKey) => {
  if (window.confirm('정말로 삭제하시겠습니까?')) {
    try {
      const db = await openDB(DB_CONFIG);
      const store = withStore(db, DB_CONFIG.storeName);
      await store.deleteDataFromStore(postKey);
      return postKey;
    } catch (error) {
      console.error('게시물 삭제 중 오류가 발생했습니다:', error);
      throw error;
    }
  }
};

const renderPostView = (postData) => {
  const template = document.createElement('div');
  template.classList.add('post-view');
  template.innerHTML = `
    <img src=${postData.imageUrl} alt="post-image" />
    <div id="postViewDefault" class="post-view__content post-view__content--default">
      <p>${postData.textContent}</p>
      <div class="post-view__btns">
        <button id="editBtn">수정하기</button>
        <button id="deleteBtn">삭제하기</button>
      </div>
    </div>
    <div id="editPostView" class="post-view__content post-view__content--edit">
        <textarea></textarea>
        <div class="post-view__btns">
          <button id="confirmEditButton">수정</button>
          <button id="cancelEditButton">취소</button>
        </div>
    </div>
  `;

  return template;
};

const enterEditMode = (postviewEl, key) => {
  const postedText = postviewEl.querySelector('p');
  const textarea = postviewEl.querySelector('textarea');
  const confirmEditButton = postviewEl.querySelector('#confirmEditButton');
  const cancelBtn = postviewEl.querySelector('#cancelEditButton');

  textarea.value = postedText.innerText;

  postviewEl.classList.add(CLASSNAME_EDIT_MODE);
  confirmEditButton.addEventListener('click', () => {
    const newText = textarea.value;
    editPost(key, newText)
      .then(() => {
        postedText.innerText = newText;
        postviewEl.classList.remove(CLASSNAME_EDIT_MODE);
      })
      .catch((error) => {
        alert(error);
        postviewEl.classList.remove(CLASSNAME_EDIT_MODE);
      });
  });

  cancelBtn.addEventListener('click', () => {
    postviewEl.classList.remove(CLASSNAME_EDIT_MODE);
  });
};

export const postView = (postData) => {
  console.log(key)
  const postviewEl = renderPostView(postData);

  const editBtn = postviewEl.querySelector('#editBtn');
  const deleteBtn = postviewEl.querySelector('#deleteBtn');

  editBtn.addEventListener('click', () =>
    enterEditMode(postviewEl, postData.key)
  );

  deleteBtn.addEventListener('click', () =>
    deletePost(postData.key).then((key) => {
      deletePostUI(key);
      closeModal();
    })
  );

  return postviewEl;
};
