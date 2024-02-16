// Import the functions you need from the SDKs you need
const admin = require("firebase-admin");
var serviceAccount = require("./honeypot-d6a9d-firebase-adminsdk-c3x1f-c5171e04e9.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const addUser = async (email, name) => {
    const documentRef = db.collection("users").doc(email);
    const data = {
        name: name,
        profile: false,
        image: null,
        email,
        access: true
    };
    documentRef
        .set(data)
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

const addPost = async (title, email, name, url, content) => {
    const collectionRef = db.collection("posts");
    const currentTime = new Date();
    const data = {
        active: true,
        title,
        content,
        name,
        image: url,
        email,
        timestamp: currentTime,
    };
    collectionRef
        .add(data)
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

const addProfile = async (email, image) => {
    const documentRef = db.collection("users").doc(email);
    const data = {
        image: image
    };
    documentRef
        .update(data)
        .then(() => {
            console.log("Profile successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

const getPosts = async () => {
    const collectionRef = db.collection("posts");
    const posts = [];

    return collectionRef
        .orderBy("timestamp", "desc") // Order by document ID in descending order
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                posts.push(doc.data());
            });
            return posts;
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
}

const getUsers = async () => {
    const collectionRef = db.collection("users");
    const posts = [];

    return collectionRef
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                posts.push(doc.data());
            });
            return posts;
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
}

const deleteUser = async (email) => {
    admin
        .auth()
        .getUserByEmail(email)
        .then((userRecord) => {
            admin.auth().deleteUser(userRecord.uid);
            const collectionRef = db.collection("users");
            const usersCollection = db.collection("users");

            usersCollection
                .doc(email) // Assuming the document ID is the user's email
                .delete()
                .then(() => {
                    console.log("User document deleted from Firestore");
                })
                .catch((error) => {
                    console.error("Error deleting user document from Firestore:", error);
                });
        })
        .then(() => {
            console.log("Successfully deleted user by email");
        })
        .catch((error) => {
            console.error("Error deleting user by email:", error);
        });
}

const disableUser = async (email) => {
    try {
        // Disable the user in Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(userRecord.uid, { disabled: true });

        // Update the user in Firestore
        const db = admin.firestore();
        const usersCollection = db.collection("users");

        const userDoc = usersCollection.doc(email);
        await userDoc.update({ access: false }); // Add the 'enabled' field to your Firestore document

        console.log("User disabled and Firestore document updated.");
    } catch (error) {
        console.error("Error disabling user and updating Firestore document:", error);
    }
}

const enableUser = async (email) => {
    try {
        // Enable the user in Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(userRecord.uid, { disabled: false });

        // Update the user in Firestore
        const db = admin.firestore();
        const usersCollection = db.collection("users");

        const userDoc = usersCollection.doc(email);
        await userDoc.update({ access: true }); // Add the 'enabled' field to your Firestore document

        console.log("User enabled and Firestore document updated.");
    } catch (error) {
        console.error("Error enabling user and updating Firestore document:", error);
    }
}

const activateUser = async (email) => {
    const documentRef = db.collection("users").doc(email);
    const data = {
        active: true
    };
    documentRef
        .update(data)
        .then(() => {
            console.log("Profile successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

const deactivateUser = async (email) => {
    const documentRef = db.collection("users").doc(email);
    const data = {
        active: false
    };
    documentRef
        .update(data)
        .then(() => {
            console.log("Profile successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

const getProfile = async (email) => {
    const documentRef = db.collection("users").doc(email);
    return documentRef
        .get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                return data;
            } else {
                console.log("Document does not exist");
            }
        })
        .catch((error) => {
            console.error("Error reading document: ", error);
        });

}



module.exports = {
    admin, addUser, addProfile, getProfile, addPost, getPosts, activateUser, deactivateUser, getUsers, deleteUser, disableUser, enableUser
}
