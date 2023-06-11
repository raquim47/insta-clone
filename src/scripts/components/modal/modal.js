import {
  CLASSNAME_VISIBLE,
  CLASSNAME_NO_SCROLL,
} from '../../utils/className.js';

export const closeModal = () => {
  const modal = document.querySelector('.modal');
  modal.classList.remove(CLASSNAME_VISIBLE);
  document.body.classList.remove(CLASSNAME_NO_SCROLL);

  setTimeout(() => modal.remove(), 250);
};

const renderModalElement = (content) => {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <button class="modal__closeBtn">
      <img
        width="22px"
        height="22px"
        src="./src/img/close_icon.svg"
        alt="close_icon_logo"
      />
    </button>
  `;
  modal.append(content);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  modal.querySelector('button').addEventListener('click', closeModal);

  return modal;
};

export const createModal = (createContent) => {
  const modal = renderModalElement(createContent());
  document.querySelector('body').prepend(modal);

  document.body.classList.add(CLASSNAME_NO_SCROLL);
  setTimeout(() => modal.classList.add(CLASSNAME_VISIBLE), 20);
};
