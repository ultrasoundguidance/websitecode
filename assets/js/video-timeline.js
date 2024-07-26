window.addEventListener('load', function () {
  const postItem = document.querySelector(".postItem")

  if (postItem) {
    firebaseDB.collection("users").doc(postItem.dataset.memberEmail).get()
      .then((doc) => {
        if (doc.exists) {

          const watchedVideosProgress = doc.data().watchedVideosProgress;
          let videoCount = 1
          Object.entries(watchedVideosProgress).forEach(([key, value]) => {
            if (value.videoCount) {
              videoCount = value.videoCount
            }
            let progressPosition = 0

            Object.entries(value).forEach(([videoId, value]) => {
              // Need to divide this by how many videos there are in a post
              if (value.progressPosition) {
                progressPosition += value.progressPosition
              }
            })

            var element = document.getElementById(key)
            element.style.setProperty("--progress-position", progressPosition / videoCount)
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
})
