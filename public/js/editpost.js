const editFormHandler = async (event) => {
  event.preventDefault();

  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];
  console.log(id);
  const name = document.querySelector('input[name="post-name"]').value;
  const description = document.querySelector('textarea[name="post-desc"]').value;

  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      description
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(response);
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert('Could not update this post!');
  }
  document.location.replace('/dashboard');
};


document
  .querySelector('.edit-post-form')
  .addEventListener('submit', editFormHandler);


document
  .querySelector('.comment-post-form')
  .addEventListener('submit', editFormHandler);
