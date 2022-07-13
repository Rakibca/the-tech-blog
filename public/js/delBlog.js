const delFormHandler = async (event) => {
  event.preventDefault();

  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  const response = await fetch(`/api/blogs/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({
      blog_id: id
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert('Failed to delete blog');
  }
};

document.querySelector('.delete-blog-btn').addEventListener('click', delFormHandler);
