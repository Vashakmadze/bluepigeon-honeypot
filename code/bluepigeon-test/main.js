import './style.css'
import { registerFirebase, loginFirebase, logoutFirebase, getToken, uploadFile, getFile, addPost, getPosts } from "./firebase"

const signupElement = document.querySelector("#signup");
const xElement = document.querySelector(".x");
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');
const signupForm = document.querySelector(".signup");
const loginForm = document.querySelector(".login");
const logoutButton = document.querySelector("#logout");

const logout = async () => {
  const email = JSON.parse(sessionStorage.getItem("user")).email;
  const result = await logoutFirebase(email);
  sessionStorage.removeItem('user');
  removeUser();
  chuckNorris();
}

const getProfile = async (email) => {
  const file = await getFile(email);
  if (file.result.image != null) {
    document.querySelector('.profile-pic').setAttribute('src', file.result.image);
  }
}

const on = () => {
  document.querySelector(".overlay").style.display = "block";
}

const off = () => {
  document.querySelector(".overlay").style.display = "none";
}

const post = async (e) => {
  e.preventDefault();
  const userStorage = sessionStorage.getItem("user");
  const email = JSON.parse(userStorage).email;
  const user = await getFile(email);
  const name = user.result.name;
  const url = user.result.image;
  const content = document.querySelector("#post").value;
  const title = document.querySelector("#title").value;
  const result = await addPost(email, name, url, content, title);
}

const escapeHTML = (input) => {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const populatePosts = (posts) => {
  const inputLocation = document.querySelector("#app > main > section > section:nth-child(1)");
  inputLocation.innerHTML = "";

  posts.result.forEach(post => {
    const document = `<article>
    <div class="left">
      <img class="profile" src="${post.image ? escapeHTML(post.image) : "./public/profile.svg"}">
    </div>
    <div class="right">
      <h1 class="title">${escapeHTML(post.title)}</h1>
      <p class="text">${escapeHTML(post.content)}</p>
      <p class="username">${escapeHTML(post.name)}</p>
    </div>
  </article>`
    inputLocation.insertAdjacentHTML("beforeend", document)
  });
}

const init = async () => {
  const user = sessionStorage.getItem("user");
  if (user) {
    getProfile(JSON.parse(user).email)
  } else {
    removeUser();
  }

  initListeners();
  initSignup();
  initializeLogin();
  initProfileUpload();

  if (!user) {
    chuckNorris();
  }


}

const initListeners = () => {
  signupElement.addEventListener("click", on);
  xElement.addEventListener("click", off);
  signupForm.addEventListener("submit", signUp);
  loginForm.addEventListener("submit", logIn);
  logoutButton.addEventListener("click", logout);
}

const initializeLogin = () => {
  loginBtn.addEventListener('click', (e) => {
    let parent = e.target.parentNode.parentNode;
    Array.from(e.target.parentNode.parentNode.classList).find((element) => {
      if (element !== "slide-up") {
        parent.classList.add('slide-up')
      } else {
        signupBtn.parentNode.classList.add('slide-up')
        parent.classList.remove('slide-up')
      }
    });
  });
}

const initSignup = () => {
  signupBtn.addEventListener('click', (e) => {
    let parent = e.target.parentNode;
    Array.from(e.target.parentNode.classList).find((element) => {
      if (element !== "slide-up") {
        parent.classList.add('slide-up')
      } else {
        loginBtn.parentNode.parentNode.classList.add('slide-up')
        parent.classList.remove('slide-up')
      }
    });
  });
}

const initProfileUpload = () => {
  document.querySelector(".upload-button").addEventListener("click", () => {
    document.querySelector(".file-upload").click();
  })

  document.querySelector(".file-upload").addEventListener("change", function () {
    readURL(this);
  })
}

const chuckNorris = async () => {
  const url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'X-RapidAPI-Key': '4727427919msh0fc30188adc98a0p131524jsn4391c68d512f',
      'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const template = `
    <article>
    <div class="right">
      <p class="text" id="chuck-text">${escapeHTML(result.value)}</p>
    </div>
  </article>`;
    const input = document.querySelector(".chuck");
    input.insertAdjacentHTML("afterbegin", template)
  } catch (error) {
    console.error(error);
  }
}

const signUp = async (e) => {
  e.preventDefault();
  const name = document.querySelector("#nameSignUp").value;
  const email = document.querySelector("#emailSignUp").value;
  const password = document.querySelector("#passwordSignUp").value;

  await registerFirebase(email, password)
    .then(async (result) => {
      getToken()
        .then(async (token) => {
          const requestBody = JSON.stringify({
            email,
            name
          });

          const result = await fetch("http://localhost:8080/register", {
            method: "POST",
            body: requestBody,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          })
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      sessionStorage.setItem('user', JSON.stringify(result.user));
      off();
    })
    .catch(error => console.log('error', error));
}

const logIn = async (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  await loginFirebase(email, password)
    .then(async result => {
      if (result.user) {
        sessionStorage.setItem('user', JSON.stringify(result.user));
        off();
      }
    })
    .catch(error => console.log('Error, Try Again'));
}

export const updateUser = async () => {
  const userInput = document.querySelector("#user");
  const userContainer = document.querySelector(".user");
  const signUpContainer = document.querySelector(".signup-container");
  const userFromStorage = JSON.parse(sessionStorage.getItem('user'));
  userInput.innerText = userFromStorage.email;
  userContainer.style.display = "flex";
  signUpContainer.style.display = "none";
  removeChuck();
  const posts = await getPosts();
  populatePosts(posts)
}

const removeUser = async () => {
  const userInput = document.querySelector("#user");
  const userContainer = document.querySelector(".user");
  const signUpContainer = document.querySelector(".signup-container");
  const pigeons = document.querySelector("#app > main > section > section:nth-child(1)");
  pigeons.innerText = "Log in to see posts!"
  userContainer.style.display = "none";
  signUpContainer.style.display = "flex";
  removePostInput();
}

const removePostInput = () => {
  const chuckTitle = document.querySelector("#right-title");
  chuckTitle.innerText = "Random Chuck Norris Fact"
  const postInput = document.querySelector("#postArea");
  postInput?.remove();
}

const removeChuck = () => {
  const chuckTitle = document.querySelector("#right-title");
  chuckTitle.innerText = "Write a Post!"

  const chuckText = document.querySelector("#chuck-text");
  if (chuckText) {
    chuckText.style.display = "none";
  }

  const pigeonsChuck = document.querySelector("#app > main > section > section.pigeons.chuck");
  console.log(pigeonsChuck.children)
  const inputForm =
    `<form id="postArea">
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" required><br><br>
    <label for="post">Add your post here:</label>
    <textarea type="text" id="post" name="post" required></textarea>
    <input type="submit" id="submit"> 
 </form>`;

  pigeonsChuck.insertAdjacentHTML("beforeend", inputForm);
  const postArea = document.querySelector("#postArea");
  postArea.addEventListener("submit", post);

  // postSection.insertAdjacentHTML('beforeend', inputForm);
}


const readURL = async (input) => {
  if (input.files && input.files[0]) {
    let reader = new FileReader();

    reader.onload = function (e) {
      $('.profile-pic').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
    const upload = await uploadFile(input.files[0], JSON.parse(sessionStorage.getItem("user")).email);



  }
}

document.addEventListener("DOMContentLoaded", init);



