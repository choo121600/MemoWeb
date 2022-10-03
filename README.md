# MemoWeb
웹앱 스터디 메모 웹 실습 자료 입니다.

# [실습] 메모 앱 만들기

> 목표: javascript를 이용하여 간단한 메모 CRUD 만들기
> 

## 요구사항

- 새 메모 생성
- 메모 배열 출력
- 기존 메모 수정
- 기존 메모 삭제

## 사전 지식

- HTML(form, label, input, div, button)
- Array.push, Array.splice
- document.getElementBy—
- localStorage
- addEventListener

![스크린샷 2022-09-23 오전 4 06 14](https://user-images.githubusercontent.com/54111883/193661642-83f85f57-c01b-4e95-aeaf-f1ca5e13a362.png)


## 힌트

- 자바스크립트에 있는 html 선택자를 사용한다.
- 자바스크립트 Array를 사용한다.
- 가능하다면 localStorage를 사용한다. (나중엔 다른 것을 주로 쓸 거라서 몰라도 크게 상관은 없다.)

## 메모 프로젝트 생성

```bash
mkdir MemoApp && cd MemoApp
touch index.html
touch script.js
```

## 간단한 구조분해 및 설계

[https://miro.com/app/board/uXjVPVGX3Rk=/?share_link_id=89127544112](https://miro.com/app/board/uXjVPVGX3Rk=/?share_link_id=89127544112)

## HTML 프레임 만들기

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MemoApp</title>
</head>
<body>
    <div class="container">
        <div class="header">
            <h3>Memo를 남겨봐~~</h3>
        </div>
        <div id="memoContainer">
            <form id="addMemoForm">
                <label for="newMemoInput">메모 추가</label>
                <input id="newMemoInput" type="text">
                <button id="addMemoBtn" type="submit">추가</button>
            </form>
        </div>
        <div id="memoList">
        </div>
    </div>
    <script src="./script.js"></script>
</body>
</html>
```

## javascript 코드 작성

구조 분해한 내용에 따르면 함수가 6개 정도 필요하다.

- submit을 받는 eventListener
- addMemo
- renderMemo
- click을 받는 eventListener
- editMemo
- deleteMemo

사실 조금 더 나누는 편이 좋긴 하지만 원활한 설명을 위해 코드 뭉치로 뭉쳐놓았다.

### id를 기준으로 태그들을 선택하자.

```jsx
// script.js
// id를 통하여 테그 선택
const addMemoform = document.getElementById('addMemoForm');
const newMemoInput = document.getElementById('newMemoInput');
const memoList = document.getElementById('memoList');

```

### eventListener(submit, (e) ⇒ {})

```jsx
addMemoform.addEventListener('submit', (e) => {
    e.preventDefault(); // 새로고침 방지

    addNewMemo();
})
```

### addNewMemo()

```jsx
// script.js
let memoArr = JSON.parse(localStorage.getItem('memoArr')) || [];

renderMemos();

//localStorage를 안쓰는 경우, memoArr을 아래와 같이 정의하면 된다.
let memoArr = []

function addNewMemo() {
    const newMemoValue = newMemoInput.value;
    
    const isEmptyNewMemo = newMemoValue === '';

    if (isEmptyNewMemo) {
        alert('메모를 입력해주세요.');
        return;
    }else{
        const memoObj = {
            id: memoArr.length ? memoArr[memoArr.length - 1].id + 1 : 0,
            title: newMemoValue
        }
    
        memoArr.push(memoObj);
    }
    newMemoInput.value = '';
    console.log(memoArr);
}
```

### renderMemo()

```jsx
function renderMemos() {
    const memoListHtml = memoArr.map((memo) => {
        return `
        <div class="memoCard" id=${memo.id}>
            <div class="memoContent">
                <input class="memoTitle" value="${memo.title}" readonly="readonly" >
            </div>
            <div class="memoFooter">
                <button class="memoEditBtn" data-action="edit">수정</button>
                <button class="memoDeleteBtn" data-action="delete">삭제</button>
                <button class="memoEditDoneBtn" data-action="edit-done" style=display:none;>완료</button>
                <button class="memoEditCancelBtn" data-action="edit-cancel" style=display:none;>취소</button>
            </div>
        </div>
        `
    }).join('');
    memoList.innerHTML = memoListHtml;
    console.log(memoList);
}
```

### eventListener(click, (e) ⇒ {})

```jsx
memoList.addEventListener('click', (e) => {
    const target = e.target;
    const selectedParentElement = target.parentElement.parentElement;

    if (selectedParentElement.className === 'memoCard') {
        const selectedElementId = selectedParentElement.id;
        // const selectedMemoId = memoArr.findIndex(element => element.id == selectedElementId);
        const selectedMemoId = memoArr.findIndex(element => element.id === Number(selectedElementId));
        const selectedMemo = memoArr[selectedMemoId];

        const action = target.dataset.action;
        action === 'edit' && editMemo(selectedParentElement, selectedElementId);
        action === 'delete' && deleteMemo(selectedMemoId);

        console.log(selectedMemo, action);
    } else {
        return;
    }
    console.log(selectedParentElement)
})
```

### deleteMemo(selectedMemoId)

```jsx
function deleteMemo(selectedMemoId) {
    memoArr.splice(selectedMemoId, 1);
    renderMemos();
    localStorage.setItem('memoArr', JSON.stringify(memoArr)); // localStorage를 쓰는 경우 추가하면 됨
}
```

### editMemo(selectedParentElement, selectedElementId)

```jsx
function editMemo(selectedParentElement, selectedElementId) {
    console.log("editMemo--", selectedElementId)
    const aditMemoInput = selectedParentElement.querySelector('.memoTitle');
    const editBtn = selectedParentElement.querySelector('.memoEditBtn');
    const deleteBtn = selectedParentElement.querySelector('.memoDeleteBtn');
    const memoEditDoneBtn = selectedParentElement.querySelector('.memoEditDoneBtn');
    const memoEditCancelBtn = selectedParentElement.querySelector('.memoEditCancelBtn');

    aditMemoInput.removeAttribute('readonly');
    aditMemoInput.focus();

    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    memoEditDoneBtn.style.display = 'inline-block';
    memoEditCancelBtn.style.display = 'inline-block';

    memoEditDoneBtn.addEventListener('click', (e) => {
        const editMemoInputValue = aditMemoInput.value;
        const isEmptyEditMemo = editMemoInputValue === '';

        if (isEmptyEditMemo) {
            alert('수정 내용을 입력하세요.')
            return;
        } else {
            const selectedMemoId = memoArr.findIndex(element => element.id === Number(selectedElementId));
            memoArr[selectedMemoId].title = editMemoInputValue;
            localStorage.setItem('memoArr', JSON.stringify(memoArr)); // localStorage를 사용하는 경우 추가
            renderMemos();
        }
    })

    memoEditCancelBtn.addEventListener('click', (e) => {
        renderMemos();
    })
}
```

위와 같이 짰을 때, 새로고침을 하면 모든 데이터가 사라진다는 문제점이 있다. 따라서 localStorage라는 것을 사용하자. 물론, 이를 사용하지 않아도 구현은 가능하지만 새로고침을 하면 모든 데이터가 사라진다는 문제점은 해결되지 않고 구현하는 방식이 무지막지하게 귀찮아진다. (parentNode를 찾아가며 지워주고 또 Array에서 지워주는 방식으로 구현할 수는 있다. 혹시 구현해보고 싶다면 해보자.)

## LocalStorage

localStorage는 브라우저 상에 간단한 key와 value로 이루어진 데이터를 저장할 수 있다.

```jsx
JSON.parse(localStorage.getItem('memoArr'))
localStorage.setItem('memoArr', JSON.stringify(memoArr));
```

검사 [F12] > Application > sideBar에서 Local Storage를 클릭하면 아래와 같이 확인할 수 있다.
![스크린샷 2022-09-23 오전 10 49 17](https://user-images.githubusercontent.com/54111883/193661870-27c334ae-05f6-49c9-9e62-32d546a5d0db.png)
