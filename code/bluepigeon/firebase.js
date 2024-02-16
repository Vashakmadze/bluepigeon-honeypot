// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { updateUser, populatePosts } from "./main";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "Your_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "Your_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"

let token;

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);

    export const loginFirebase = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return userCredential;
            })
            .catch((err) => {
                alert(err);
            });
    }

export const registerFirebase = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                return userCredential;
            })
            .catch((err) => {
                alert(err);
            })
    }

export const logoutFirebase = async (email) => {
        getToken()
            .then(async (tokeni) => {
                const body = JSON.stringify({
                    email
                });
                fetch("http://localhost:8080/deactivate", {
                    method: "POST",
                    body,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + tokeni,
                    },
                })
                    .then(result => result.json())
                    .catch(error => console.log(error))
                return await signOut(auth).then((data) => {
                }).catch((err) => {
                    alert(err);
                })
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

export const getToken = async () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    try {
                        const firebaseUserIdToken = await user.getIdToken(true);
                        token = firebaseUserIdToken;
                        resolve(firebaseUserIdToken);
                    } catch (error) {
                        reject(error);
                    } finally {
                        unsubscribe(); // Make sure to unsubscribe when done
                    }
                } else {
                    reject("User is not authenticated.");
                    unsubscribe(); // Unsubscribe in case of error
                }
            });
        });
    };

    onAuthStateChanged(auth, async (user) => {
    if (user) {
        sessionStorage.setItem("user", JSON.stringify(user));
        updateUser();
        const body = JSON.stringify({
            email: user.email
        });
        const firebaseUserIdToken = await user.getIdToken(true);
        fetch("http://localhost:8080/activate", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + firebaseUserIdToken,
            },
        })
            .then(result => result.json())
            .catch(error => { })
    } else {
    }
})

export const uploadFile = async (file, email) => {

    const reader = new FileReader();

    reader.onload = function () {
        const base64Image = reader.result;
        var formdata = new FormData();
        formdata.append("image", base64Image.split("base64,")[1]);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        return getToken()
            .then(async (tokeni) => {
                fetch("https://api.imgbb.com/1/upload?key=d39431d57d7355e760ea786ec32b19a1", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        const body = JSON.stringify({
                            email,
                            image: result.data.display_url
                        });

                        fetch("http://localhost:8080/add-image", {
                            method: "POST",
                            body,
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + tokeni,
                            },
                        }).then(result => result.json())

                    })
                    .catch(error => console.log('error', error));
            })
            .catch((error) => {
                console.error("Error:", error);
            });


    };

    reader.readAsDataURL(file);

}

export const getFile = async (email) => {
    const body = JSON.stringify({
        email,
    });

    return getToken()
        .then(async (tokeni) => {
            return fetch("http://localhost:8080/get-profile", {
                method: "POST",
                body,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + tokeni,
                },
            }).then(result => {
                return result.json();
            })
        })
        .catch((error) => {
            console.error("Error:", error);
        });


}

export const addPost = async (email, name, url, content, title) => {
    const body = JSON.stringify({
        email,
        name,
        url,
        content,
        title
    });

    return getToken()
        .then(async (tokeni) => {
            return fetch("http://localhost:8080/add-post", {
                method: "POST",
                body,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + tokeni,
                },
            }).then(async result => {
                alert("Post added!")
                const posts = await getPosts();
                populatePosts(posts);
                return result.json();
            })
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}


export const getPosts = async () => {
    return getToken()
        .then(async (tokeni) => {
            return fetch("http://localhost:8080/posts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + tokeni,
                },
            }).then(result => {
                return result.json();
            })
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
