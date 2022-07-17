// const commentFormHandler = async (event) => {
//   event.preventDefault();
//
//   const post_id = document.querySelector('input[name="post-id"]').value;
//   const comment_body = document.querySelector('textarea[name="comment-body"]').value;
//
//   if (!comment_body) {
//     alert("You must fill in text for your comment!");
//   } else {
//     const response = await fetch(`/commentRoutes`, {
//       method: 'POST',
//       body: JSON.stringify({
//         post_id,
//         comment_body
//       }),
//       headers: {
//         'Content-Type': 'application/json'
//       },
//     });
//
//     console.log(response);
//
//     if (response.ok) {
//       document.location.reload();
//     } else {
//       alert('Failed to comment this post');
//     }
//   }
// };
//
// document
//   .querySelector('.new-comment-form')
//   .addEventListener('submit', commentFormHandler);
