// Element selectors
var modal = document.getElementById("myModal");
var formContainer = document.querySelector(".form");
var submit = document.querySelector(".submit-form");
var closeBtn = document.getElementById("closeBtn");
var postData = document.querySelector("#post");
var iframes = document.querySelectorAll('iframe');
var formName = 'Default'

// Form Rendered
function getForm() {
  firebaseDB.collection("forms").doc("Default").get()
    .then((doc) => {
      if (doc.exists) {
        doc.data().items.slice().reverse().forEach((item) => {
          const form = `
            <label>${item.title}</label><br>
            <input type="text" style="width: 100%;" id="${item.itemId}" ></br>
            `
          formContainer.insertAdjacentHTML('afterbegin', form)
        })
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
};

// Form Functions
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  })
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  };
};

if (submit) {
  submit.onclick = function (event) {
    event.preventDefault();
    var inputs = document.querySelectorAll("input");
    var answers = {}
    inputs.forEach((response) => {
      answers[response.id] = {
        questionId: response.id,
        textAnswers: {
          answers: [
            { value: response.value }
          ]
        }
      }
    })

    // Maybe change this to each post so you answer one survey per post incase a post has two videos
    player.getVideoId().then((videoId) => {
      firebaseDB.collection("formResponses").doc(formName).set({
        responses: {
          [postData.dataset.memberEmail]: firebase.firestore.FieldValue.arrayUnion(
            {
              responseId: crypto.randomUUID(),
              videoId: videoId,
              createTime: new Date().toISOString(),
              answers: answers
            }
          )
        }
      }, { merge: true })
        .then(() => {
          modal.style.display = "none";
        })
        .catch((error) => {
          console.error("Error submitting form: ", error);
        });
    });
  };
};

// Vimeo
if (postData && iframes) {
  iframes.forEach((iframe) => {

    var player = new Vimeo.Player(iframe);

    // Set watched seconds on Vimeo Player
    player.getVideoId().then((videoId) => {
      firebaseDB.collection("users").doc(postData.dataset.memberEmail).get()
        .then((doc) => {
          if (doc.exists) {
            const watchedSeconds = doc.data().watchedVideosProgress[postData.dataset.postId][videoId]['watchedSeconds']
            player.setCurrentTime(watchedSeconds).then(() => {
              // `seconds` indicates the actual time that the player seeks to
            }).catch((error) => {
              switch (error.name) {
                case 'RangeError':
                  // The time is less than 0 or greater than the video's duration
                  break;
                default:
                  // Some other error occurred
                  break;
              }
            });
          } else {
            // doc.data() will be undefined in this case
            console.log("Unable to get Video watched seconds: No such document");
          }
        })
        .catch((error) => {
          console.log("No document found:", error);
        });
    })


    // Video Played
    player.on('play', () => {
      player.getVideoId().then((videoId) => {
        const videoCount = document.querySelectorAll(".kg-embed-card").length

        firebaseDB.collection("users").doc(postData.dataset.memberEmail).set({
          watchedVideosProgress: {
            [postData.dataset.postId]: {
              [videoId]: {
                postId: postData.dataset.postId,
                videoId: videoId,
              },
              videoCount: videoCount
            }
          }
        }, { merge: true })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      });
    });

    // Video Paused
    player.on('pause', () => {
      player.getCurrentTime().then((seconds) => {
        player.getDuration().then((duration) => {
          player.getVideoId().then((videoId) => {
            firebaseDB.collection("users").doc(postData.dataset.memberEmail).set({
              watchedVideosProgress: {
                [postData.dataset.postId]: {
                  [videoId]: {
                    watchedSeconds: seconds - 5,
                    progressPosition: seconds / duration,
                  }
                }
              }
            }, { merge: true })
              .catch((error) => {
                console.error("Error updating document: ", error);
              })
          });
        });
      });
    });

    // Video Ended
    player.on('ended', () => {
      // Uncomment when ready to use forms
      // getForm()
      // modal.style.display = "block"

      player.getCurrentTime().then((seconds) => {
        firebaseDB.collection("users").doc(postData.dataset.memberEmail).set({
          watchedVideos: {
            [postData.dataset.postId]: {
              watchedSeconds: 60,
              progressPosition: 1,
            }
          }
        }, { merge: true })
          .then(() => {
            player.off('pause')
          })
          .catch((error) => {
            console.error("Error updating document on end event: ", error);
          });
      });
    });
  })


};