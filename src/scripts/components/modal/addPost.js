import { closeModal } from './modal.js';
import { addPostUI } from '../posts/posts.js';
import { DB_CONFIG } from '../../../../config.js';
import { CLASSNAME_WRITE_MODE } from '../../utils/className.js';
import { openDB, withStore } from '../../services/database.js';

const registerPost = async (postData, onsuccess, onerror) => {
  if (window.indexedDB) {
    try {
      const db = await openDB(DB_CONFIG);
      const postsStore = withStore(db, DB_CONFIG.storeName);
      const key = await postsStore.addDataToStore(postData);
      onsuccess(key);
    } catch (error) {
      console.error('Error: ', error);
      onerror();
    }
  }
};

const switchToPostMode = (imageUrl) => {
  const addPost = document.querySelector('.add-post');
  const postImg = document.getElementById('postImg');
  postImg.src = imageUrl;

  addPost.classList.add(CLASSNAME_WRITE_MODE);
};

const openFileReader = (target, onload, onerror) => {
  const reader = new FileReader();
  reader.readAsDataURL(target.files[0]);
  reader.onload = () => onload(reader);
  reader.onerror = (error) => {
    console.log('Error: ', error);
    onerror();
  };
};

const onLoadFile = (reader) => {
  const imageUrl = reader.result;
  const addPostBtn = document.getElementById('addPostBtn');

  addPostBtn.onclick = () => {
    const textContent = document.getElementById('addPostText').value;
    const postData = { textContent, imageUrl };

    registerPost(
      postData,
      (key) => {
        addPostUI({ ...postData, key });
        closeModal();
      },
      closeModal
    );
  };

  switchToPostMode(imageUrl);
};

const attachListeners = (target) => {
  const uploadInput = target.querySelector('#uploadInput');
  const backBtn = target.querySelector('.add-post__backBtn');

  uploadInput.addEventListener('input', (event) =>
    openFileReader(event.target, onLoadFile, closeModal)
  );

  backBtn.addEventListener('click', () => {
    target.classList.remove(CLASSNAME_WRITE_MODE);
  });
};

const render = () => {
  const addPostElement = document.createElement('div');
  addPostElement.classList.add('add-post');
  addPostElement.innerHTML = `
    <div class="add-post__header">
      <button class="add-post__backBtn">
        <img
          width="32px"
          height="24px"
          src="./src/img/arrow_back_icon.svg"
          alt="arrow_back_icon"
        />
      </button>
      <h2>새 게시물 만들기</h2>
      <button id="addPostBtn" class="add-post__registerBtn">등록하기</button>
    </div>
    <!-- add-post__posts : Default is display none -->
    <div class="add-post__input">
      <img id="postImg" alt="업로드 이미지" />
      <div class="add-post__text">
        <textarea id="addPostText" placeholder="텍스트 입력..." autofocus></textarea>
      </div>
    </div>
    <div class="add-post__main">
      <img src="./src/img/media_icon.svg" alt="media_icon" />
      <h3>사진과 동영상을 업로드 해보세요.</h3>
      <label for="uploadInput">컴퓨터에서 선택</label>
      <input type="file" name="uploadInput" id="uploadInput" />
    </div>
  `;
  return addPostElement;
};

export const createAddPostModal = () => {
  const addPostModal = render();
  attachListeners(addPostModal);
  return addPostModal;
};
