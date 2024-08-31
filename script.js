function displayIdea(id, title, idea, date, likes) {
    const ideasDiv = document.getElementById('ideas');
    const card = document.createElement('div');
    card.className = 'col-lg-4 col-md-6 col-sm-12';
    card.innerHTML = `
        <div class="card" data-id="${id}">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${idea.substring(0, 50)}...</p>
            </div>
            <div class="card-footer">
                <span>${date}</span>
                <button class="like-button" data-id="${id}">
                    <i class="fas fa-heart"></i> <span>${likes}</span>
                </button>
                <button class="delete-button" data-id="${id}">
                    <i class="fas fa-trash"></i> 삭제
                </button>
            </div>
        </div>
    `;
    ideasDiv.appendChild(card);

    // 카드 클릭 시 팝업 표시
    card.addEventListener('click', () => {
        document.getElementById('ideaModalLabel').innerText = title;
        document.getElementById('modalIdeaText').innerText = idea;
        document.getElementById('likeModalBtn').setAttribute('data-id', id);
        document.getElementById('likeModalBtn').setAttribute('data-likes', likes);
        $('#ideaModal').modal('show');
    });

    // 좋아요 버튼 클릭 시
    card.querySelector('.like-button').addEventListener('click', (event) => {
        event.stopPropagation(); // 카드 클릭 방지
        const likeButton = event.currentTarget;
        const likeCountElement = likeButton.querySelector('span');
        const likeCountText = likeCountElement.innerText;
        const likeCount = parseInt(likeCountText, 10);
        if (!isNaN(likeCount)) {
            incrementLikes(id, likeCount, likeCountElement);
        } else {
            console.error("Invalid like count:", likeCountText);
        }
    });

    // 삭제 버튼 클릭 시
    card.querySelector('.delete-button').addEventListener('click', (event) => {
        event.stopPropagation(); // 카드 클릭 방지
        const deleteButton = event.currentTarget;
        const ideaId = deleteButton.getAttribute('data-id');
        deleteIdea(ideaId);
    });
}
// Firestore에서 아이디어 삭제
async function deleteIdea(id) {
    const ideaRef = doc(db, "ideas", id);
    try {
        await deleteDoc(ideaRef);
        // UI에서 아이디어 카드 제거
        const ideaCard = document.querySelector(`.card[data-id="${id}"]`);
        if (ideaCard) {
            ideaCard.remove();
        }
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

