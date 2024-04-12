const postItem = document.querySelector(".postItem")

if (postItem) {
  firebaseDB.collection("users").doc(postItem.dataset.memberEmail).get()
    .then((doc) => {
      if (doc.exists) {
        const watchedVideos = doc.data().watchedVideos;
        Object.entries(watchedVideos).forEach(([key, value]) => {
          var element = document.getElementById(key)
          element.style.setProperty("--progress-position", value.progressPosition)
        });

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
