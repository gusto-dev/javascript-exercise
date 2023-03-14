const UNSPLASH_API_KEY = config.apikey;
const dimmContainer = document.querySelector('.dimm_container');
const prevContainer = document.querySelector('.preview_container');
const buttonElments = document.querySelectorAll('.button_opt');
const reverseElment = document.querySelector('.button_reverse');

// RGB 랜덤 생성
function randomRGB() {
  let rgb = '';
  // 0 ~ 255 의 범위에서 최소 150이상 240이하
  // color hex code 변환을 위한 16진법 변환
  // padStart: 첫번째 파라미터인 maxLength를 받아 문자열의 길이가 maxLength보다 작을 경우 나머지를 특정한 문자열(두번째 파라미터)로 채워주는 기능
  rgb += (Math.floor(Math.random() * 90 + 1) + 150)
    .toString(16)
    .padStart(2, '0');
  rgb += (Math.floor(Math.random() * 90 + 1) + 150)
    .toString(16)
    .padStart(2, '0');
  rgb += (Math.floor(Math.random() * 90 + 1) + 150)
    .toString(16)
    .padStart(2, '0');
  return rgb;
}

// 랜덤 색상 이벤트
function handleColor(flag) {
  if (flag === 'solid') {
    const hexColor = `#${randomRGB()}`;
    dimmContainer.style.background = hexColor;
    prevContainer.style.background = hexColor;
  } else if (flag === 'gradient') {
    const gradientColor = `linear-gradient(#${randomRGB()}, #${randomRGB()})`;
    dimmContainer.style.background = gradientColor;
    prevContainer.style.background = gradientColor;
  } else {
    dimmContainer.style.background = '#afdaba';
    prevContainer.style.background = '#afdaba';
  }
  dimmContainer.classList.remove('blur');
}

// unsplash 이미지 가져오기
function handleFindImage(keyword) {
  const url = `https://api.unsplash.com/search/photos?page=1&query=${keyword}&client_id=${UNSPLASH_API_KEY}&per_page=20`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const result = data.results;
      const num = Math.floor(Math.random() * result.length);
      if (result.length !== 0) {
        dimmContainer.classList.add('blur');
        dimmContainer.style.background = `#afdaba url(${result[num].urls.raw}&w=960&dpr=2) repeat center /cover fixed`;
        prevContainer.style.background = `#afdaba url(${result[num].urls.raw}&w=480&dpr=2) repeat center /cover`;
      } else {
        alert('이미지가 없습니다.');
      }
    })
    .catch((err) => console.error(err));
}

// 제목 입력 이벤트
function handleKeyDown() {
  const inputTitle = document.querySelector('.input_title');
  const previewTitle = document.querySelector('.preview_title');
  const inputSubTitle = document.querySelector('.input_subtitle');
  const previewSubTitle = document.querySelector('.preview_subtitle');
  inputTitle.value = '';
  previewTitle.textContent = '제목을 입력하세요.';
  inputSubTitle.value = '';
  previewSubTitle.textContent = '';

  inputTitle.addEventListener('input', (e) => {
    const target = e.target;
    previewTitle.textContent = target.value;
  });
  inputSubTitle.addEventListener('input', (e) => {
    const target = e.target;
    previewSubTitle.textContent = target.value;
  });
}

// 버튼컬러 변경 이벤트
function selectedButton(el) {
  const set = el.target.dataset.set;

  if (set === 'image') {
    const getText = window.prompt('키워드를 입력하세요.');
    if (getText) {
      handleFindImage(getText);

      buttonElments.forEach((el) => {
        el.classList.remove('selected');
      });
      el.target.classList.add('selected');
    }
  } else {
    buttonElments.forEach((el) => {
      el.classList.remove('selected');
    });
    el.target.classList.add('selected');
  }
}
buttonElments.forEach((el) => el.addEventListener('click', selectedButton));

// 다운로드 이벤트
function handleDownload() {
  const getConfirm = window.confirm('다운로드 하시겠습니까?');
  if (getConfirm) {
    // 출력물 1920x1080
    html2canvas(prevContainer, {
      // scale: 2,
      useCORS: true,
      width: 960,
      height: 540,
    }).then((canvas) => {
      const target = document.getElementById('downloadTarget');
      target.href = canvas.toDataURL('image/jpeg', 1.0);
      target.download = 'auto-thumbnail.jpg';
      target.click();
    });
  }
}

// 텍스트컬러 반전 이벤트
function reverseText(el) {
  const target = el.target;

  if (!target.classList.contains('black')) {
    target.classList.add('black');
    prevContainer.classList.remove('black');
  } else {
    target.classList.remove('black');
    prevContainer.classList.add('black');
  }
}
reverseElment.addEventListener('click', reverseText);

// 초기화
function init() {
  handleColor();
  handleKeyDown();
  buttonElments.forEach((el) => {
    el.classList.remove('selected');
  });
  buttonElments[0].classList.add('selected');
  reverseElment.classList.add('black');
}
init();
