import './style.css'
import { getUsers, deleteUser, disableUser, enableUser } from './firebase';

const init = async () => {
  document.querySelector(".refresh").addEventListener("click", refreshPage);
  const users = await getUsers();
  populateUsers(users);
}

const populateUsers = (users) => {
  const inputLocation = document.querySelector(".user-list");
  users.result.forEach(user => {
    const element = `
    <div class="user-list-item">
    <span>${user.name}</span>
    <span>${user.email}</span>
    <span>${user.active}</span>
    <span>${user.access}</span>
    <span class="action-buttons">
        <button class="delete" type="button" value="${user.email}">Delete</button>
        <button class="enable" type="button" value="${user.email}">Enable</button>
        <button class="disable" type="button" value="${user.email}">Disable</button>
    </span>
</div>
    `
    inputLocation.insertAdjacentHTML("beforeend", element);
    document.querySelector(".delete").addEventListener("click", deleteUserFromDatabase)
    document.querySelector(".enable").addEventListener("click", enableUserDatabase)
    document.querySelector(".disable").addEventListener("click", disableUserDatabase)

  })
}

document.addEventListener('DOMContentLoaded', init);

const refreshPage = () => {
  window.location.reload();
}

const deleteUserFromDatabase = async (e) => {
  const result = await deleteUser(e.target.value);
  if (result.success == true) {
    alert("User deleted successfully! Refresh to update users!");
  }
}

const disableUserDatabase = async (e) => {
  const result = await disableUser(e.target.value);
  if (result.success == true) {
    alert("User disabled successfully! Refresh to update users!");
  }
}

const enableUserDatabase = async (e) => {
  const result = await enableUser(e.target.value);
  if (result.success == true) {
    alert("User enabled successfully! Refresh to update users!");
  }
}