const USER_PER_PAGE = 24;

const users = JSON.parse(localStorage.getItem("bestFriends")) || [];
let filterUsers = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
let numOfBestFriends = document.querySelector("#best-friends");

function addNumOfBestFriends() {
  if (localStorage.getItem("bestFriends") === null) {
    numOfBestFriends.innerText = 0;
  } else {
    numOfBestFriends.innerText = JSON.parse(
      localStorage.getItem("bestFriends")
    ).length;
  }
}

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="card border-success m-3" id="card">
    <img src="${item.avatar}" class="card-img-top show-user" alt="user-image">
    <span class="visible position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger""><i class="fa-regular fa-heart"></i></span>
          <div class="card-body">
            <p class="card-text" id="user-name">${item.name} ${item.surname}</p>
            <i class="fa-solid fa-hashtag"></i> ${item.birthday}
          </div>

<div class="card-footer d-flex justify-content-around">
  <button class="btn btn-success btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">Profile</button>
  <button class="btn btn-danger btn-remove-user" data-id="${item.id}">X</button>
</div>
</div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>
    `;
  }
  paginator.innerHTML = rawHTML;
}

function getUserByPage(page) {
  const data = filterUsers.length ? filterUsers : users;
  const startIndex = (page - 1) * USER_PER_PAGE;
  return data.slice(startIndex, startIndex + USER_PER_PAGE);
}

function showUserModal(id) {
  const userModalName = document.querySelector("#user-modal-name");
  const userModalPicture = document.querySelector("#user-modal-picture");
  const userModalBirthday = document.querySelector("#user-modal-birthday");
  const userModalEmail = document.querySelector("#user-modal-email");
  const userModalAge = document.querySelector("#user-modal-age");

  const user = users.find((user) => user.id === id);

  userModalName.innerText = `${user.name}  ${user.surname}`;
  userModalBirthday.innerText = `Birthday: ` + user.birthday;
  userModalEmail.innerText = `Email: ` + user.email;
  userModalAge.innerText = `Age:   ` + user.age;
  userModalPicture.innerHTML = `<img src="${user.avatar}" alt="user-picture" class="rounded-circle img-fluid border border-success">`;
}

function removeFavoriteUser(id) {
  const userIndex = users.findIndex((users) => users.id === id);
  users.splice(userIndex, 1);
  localStorage.setItem("bestFriends", JSON.stringify(users));
  renderUserList(users);
  addNumOfBestFriends();
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  const id = Number(event.target.dataset.id);
  if (event.target.matches(".btn-show-user")) {
    showUserModal(id);
  } else if (event.target.matches(".btn-remove-user")) {
    removeFavoriteUser(id);
  }
});

searchForm.addEventListener("submit", function onSearchSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  filterUsers = users.filter((users) =>
    users.name.toLowerCase().includes(keyword)
  );
  if (filterUsers.length === 0) {
    return alert("尋找不到此人：" + keyword);
  }
  renderPaginator(filterUsers.length);
  renderUserList(getUserByPage(1));
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = event.target.dataset.page;
  renderUserList(getUserByPage(page));
});

renderPaginator(users.length);
renderUserList(getUserByPage(1));
addNumOfBestFriends();
