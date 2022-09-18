const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const USER_URL = BASE_URL + "/api/v1/users";
const USER_PER_PAGE = 24;

const users = [];
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
          <img src="${item.avatar}" class="card-img-top show-user" alt="user-image">`;

    // 控制愛心標記，若在喜歡清單內visible fa-heart愛心, 若不在invisible fa-heart愛心
    const bestFriendsList =
      JSON.parse(localStorage.getItem("bestFriends")) || [];
    if (bestFriendsList.some((user) => item.id === user.id)) {
      rawHTML += `
      <span class="visible position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger""><i class="fa-regular fa-heart"></i></span>
      `;
    } else {
      rawHTML += `
      <span class="invisible position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger""><i class="fa-regular fa-heart"></i></span>
      `;
    }
    rawHTML += `          
          <div class="card-body">
            <p class="card-text" id="user-name">${item.name} ${item.surname}</p>
            <i class="fa-solid fa-hashtag"></i> ${item.birthday}
          </div>
          
          <div class="card-footer d-flex justify-content-around" >
            <button class="btn btn-success btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">Profile</button>
            <button class="btn btn-outline-danger btn-favorite-user" data-id="${item.id}">＋</button>
          </div>
          
      </div>
    `;
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
  userModalAge.innerText = `Age: ` + user.age;
  userModalPicture.innerHTML = `<img src="${user.avatar}" alt="user-picture" class="rounded-circle img-fluid border border-success">`;
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("bestFriends")) || [];
  const user = users.find((user) => user.id === id);

  if (list.some((user) => user.id === id)) {
    return alert("已經是你的摯友！");
  }
  list.push(user);
  localStorage.setItem("bestFriends", JSON.stringify(list));
  addNumOfBestFriends();
}
dataPanel.addEventListener("click", function onPanelClicked(event) {
  const id = Number(event.target.dataset.id);

  if (event.target.matches(".btn-show-user")) {
    showUserModal(id);
  } else if (event.target.matches(".btn-favorite-user")) {
    addToFavorite(id);
    const visibleSpanClass =
      event.target.parentElement.parentElement.children[1].classList;
    visibleSpanClass.remove("invisible");
  }
});

searchForm.addEventListener("submit", function onSearchSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  filterUsers = users.filter(
    (users) =>
      users.name.toLowerCase().includes(keyword) ||
      users.surname.toLowerCase().includes(keyword)
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

axios.get(USER_URL).then((response) => {
  users.push(...response.data.results);
  renderPaginator(users.length);
  renderUserList(getUserByPage(1));
  addNumOfBestFriends()
});