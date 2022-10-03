const addMemoform = document.getElementById('addMemoForm');
const newMemoInput = document.getElementById('newMemoInput');
const memoList = document.getElementById('memoList');

let memoArr = JSON.parse(localStorage.getItem('memoArr')) || [];

renderMemos();

addMemoform.addEventListener('submit', (e) => {
    e.preventDefault();

    addNewMemo();
    renderMemos();
    localStorage.setItem('memoArr', JSON.stringify(memoArr));
})

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
            localStorage.setItem('memoArr', JSON.stringify(memoArr));
            renderMemos();
        }
    })

    memoEditCancelBtn.addEventListener('click', (e) => {
        renderMemos();
    })
}

function deleteMemo(selectedMemoId) {
    memoArr.splice(selectedMemoId, 1);
    renderMemos();
    localStorage.setItem('memoArr', JSON.stringify(memoArr));
}