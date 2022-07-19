const commentFormHandler = async (event) => {
  event.preventDefault();

  const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];
  const comment_body = document.querySelector('textarea[name="comment-desc"]').value;
  console.log(post_id);

  if (!comment_body) {
    alert("You must add a comment!");
  } else {
    //const response = await fetch(`/api/comments/${post_id}`, {
    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({
        comment_body,
        post_id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response);

    if (response.ok) {
      document.location.reload();
    } else {
      alert('Failed to comment this post!');
    }
  }
};


document.querySelector('.comment-post-form').addEventListener('submit', commentFormHandler);
