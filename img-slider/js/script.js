const goSlide = (
  elem,
  { autoPlay = false, controls = true, pagination = false }
) => {
  if (elem.children.length <= 0)
    return console.error('slides-item을 추가하세요.');

  // 변수 선언
  let currentIdx = 0;
  let slideWidth = elem.offsetWidth;
  let slides = [];

  // goslider-draggable element 생성
  const draggable = document.createElement('div');
  draggable.setAttribute('class', 'goslider-draggable');

  // goslider-wrapper element 생성
  const wrapper = document.createElement('div');
  wrapper.setAttribute('class', 'goslider-wrapper');

  elem.appendChild(draggable);
  draggable.appendChild(wrapper);

  // goslider-slide 추가
  elem.childNodes.forEach((el, idx) => {
    if (el.classList && el.classList.contains('goslider-slide')) {
      el.style.width = `${slideWidth}px`;
      wrapper.appendChild(el);
      slides[idx] = el;
      if (idx === 1) {
        el.classList.add('goslider-slide-current');
      }
    }
  });
  slides = slides.filter(
    (item) => item !== null && item !== '' && item !== undefined
  );

  // controls
  if (controls) {
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    prevButton.setAttribute('class', 'goslider-controls-prev');
    prevButton.innerHTML = 'Prev';
    nextButton.setAttribute('class', 'goslider-controls-next');
    nextButton.innerHTML = 'Next';

    const controlContainer = document.createElement('div');
    controlContainer.setAttribute('class', 'goslider-controls');
    controlContainer.appendChild(prevButton);
    controlContainer.appendChild(nextButton);
    elem.appendChild(controlContainer);

    prevButton.addEventListener('click', () => goToslide(currentIdx - 1));
    nextButton.addEventListener('click', () => goToslide(currentIdx + 1));
  }

  // pagination
  if (pagination) {
    let paginationContainer = document.createElement('div');
    paginationContainer.setAttribute('class', 'goslider-pagination');
    slides.forEach((el, idx) => {
      const paginationButton = document.createElement('span');
      paginationButton.setAttribute('class', 'goslider-pagination-button');
      paginationButton.setAttribute('data-idx', idx);
      paginationButton.innerHTML = idx + 1;
      paginationContainer.appendChild(paginationButton);
    });
    elem.appendChild(paginationContainer);

    paginationContainer.childNodes.forEach((el, idx) => {
      if (el.classList.contains('goslider-pagination-button')) {
        el.addEventListener('click', () => goToslide(el.dataset.idx));
        if (idx === 0) {
          el.classList.add('goslider-pagination-button-current');
        }
      }
    });
  }

  // autoPlay
  if (autoPlay) {
    setInterval(() => goToslide(currentIdx + 1), 5000);
  }

  // 슬라이드 변경
  function goToslide(index) {
    if (index > slides.length - 1) {
      index = 0;
    }
    if (index < 0) {
      index = slides.length - 1;
    }
    currentIdx = Number(index);

    wrapper.style.transform = `translate3d(${
      currentIdx * -slideWidth
    }px, 0px, 0px)`;

    slides.forEach((el, idx) => {
      el.classList.remove('goslider-slide-current');
      if (currentIdx === idx) {
        el.classList.add('goslider-slide-current');
      }
    });

    const paging = document.querySelectorAll('.goslider-pagination-button');
    paging.forEach((el, idx) => {
      el.classList.remove('goslider-pagination-button-current');
      if (currentIdx === idx) {
        el.classList.add('goslider-pagination-button-current');
      }
    });
  }
};
