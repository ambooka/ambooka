interface BlogProps {
  isActive?: boolean
}

export default function Blog({ isActive = false }: BlogProps) {
  const blogPosts = [
    {
      id: 1,
      image: '/assets/images/blog-1.jpg',
      category: 'Design',
      date: 'Feb 23, 2022',
      title: 'Design conferences in 2022',
      text: 'Veritatis et quasi architecto beatae vitae dicta sunt, explicabo.'
    },
    {
      id: 2,
      image: '/assets/images/blog-2.jpg',
      category: 'Design',
      date: 'Feb 23, 2022',
      title: 'Best fonts every designer',
      text: 'Sed ut perspiciatis, nam libero tempore, cum soluta nobis est eligendi.'
    },
    {
      id: 3,
      image: '/assets/images/blog-3.jpg',
      category: 'Design',
      date: 'Feb 23, 2022',
      title: 'Design digest #80',
      text: 'Excepteur sint occaecat cupidatat no proident, quis nostrum exercitationem ullam corporis suscipit.'
    },
    {
      id: 4,
      image: '/assets/images/blog-4.jpg',
      category: 'Design',
      date: 'Feb 23, 2022',
      title: 'UI interactions of the week',
      text: 'Enim ad minim veniam, consectetur adipiscing elit, quis nostrud exercitation ullamco laboris nisi.'
    },
    {
      id: 5,
      image: '/assets/images/blog-5.jpg',
      category: 'Design',
      date: 'Feb 23, 2022',
      title: 'The forgotten art of spacing',
      text: 'Maxime placeat, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 6,
      image: '/assets/images/blog-6.jpg',
      category: 'Design',
      date: 'Feb 23, 2022',
      title: 'Design digest #79',
      text: 'Optio cumque nihil impedit uo minus quod maxime placeat, velit esse cillum.'
    }
  ]

 return (
    <article className={`blog ${isActive ? 'active' : ''}`} data-page="blog">
      <header>
        <h2 className="h2 article-title">Blog</h2>
      </header>

      <section className="blog-posts">
        <ul className="blog-posts-list">
          {blogPosts.map(post => (
            <li key={post.id} className="blog-post-item">
              <a href="#">
                <figure className="blog-banner-box">
                  <img src={post.image} alt={post.title} loading="lazy" />
                </figure>

                <div className="blog-content">
                  <div className="blog-meta">
                    <p className="blog-category">{post.category}</p>
                    <span className="dot"></span>
                    <time dateTime="2022-02-23">{post.date}</time>
                  </div>

                  <h3 className="h3 blog-item-title">{post.title}</h3>
                  <p className="blog-text">{post.text}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}