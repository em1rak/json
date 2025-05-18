document.addEventListener('DOMContentLoaded', loadUsers);

const loadData = async (url, errorMsg) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(errorMsg);
    return response.json();
};

const displaySection = (showId, hideIds) => {
    hideIds.forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById(showId).style.display = showId === 'photos' ? 'grid' : 'block';
};

async function loadUsers() {
    try {
        const users = await loadData('https://jsonplaceholder.typicode.com/users', 'Ошибка сети');
        const usersDiv = document.getElementById('users');
        usersDiv.innerHTML = users.map(user => 
            `<div onclick="loadAlbums(${user.id})">${user.name}</div>`
        ).join('');
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
        document.getElementById('users').innerHTML = 'Ошибка загрузки пользователей';
    }
}

async function loadAlbums(userId) {
    try {
        const albums = await loadData(`https://jsonplaceholder.typicode.com/albums?userId=${userId}`, 'Ошибка сети');
        const albumsDiv = document.getElementById('albums');
        albumsDiv.innerHTML = `
            <button onclick="displaySection('users', ['albums', 'photos'])">Назад к пользователям</button>
            ${albums.map(album => 
                `<div onclick="loadPhotos(${album.id})">${album.title}</div>`
            ).join('')}
        `;
        displaySection('albums', ['users', 'photos']);
    } catch (error) {
        console.error('Ошибка при загрузке альбомов:', error);
        document.getElementById('albums').innerHTML = 'Ошибка загрузки альбомов';
    }
}

async function loadPhotos(albumId) {
    try {
        const photos = await loadData(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`, 'Ошибка сети');
        const photosDiv = document.getElementById('photos');
        photosDiv.innerHTML = `
            <button onclick="displaySection('albums', ['photos'])">Назад к альбомам</button>
            ${photos.map(photo => 
                `<img src="${photo.thumbnailUrl}">`
            ).join('')}
        `;
        displaySection('photos', ['albums', 'users']);
    } catch (error) {
        console.error('Ошибка при загрузке фотографий:', error);
        document.getElementById('photos').innerHTML = 'Ошибка загрузки фотографий';
    }
}