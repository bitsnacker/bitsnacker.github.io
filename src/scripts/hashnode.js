const fetchAll = function() {
    fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query Post {
                publication(host: "engineering.hashnode.com") {
                  posts(first: 20) {
                    edges {
                      node {
                        title,
                        publishedAt,
                        slug,
                      }
                    }
                  }
                }
              }`
        })
    })
        .then(res => res.json())
        .then(res => {
            const postsContainer = document.getElementById('hashnode-posts');
            const posts = res.data.publication.posts.edges;
            posts.forEach(element => {
                const div = document.createElement('div');
                const link = document.createElement('a');
    
                link.href = element.node.slug;
                link.innerHTML = element.node.title;
                link.className = "underline";
                // link.addEventListener('click', handleLocation);
                const date = document.createElement('p');
                date.className = "pb-4 font-light";
                date.innerHTML = new Date(element.node.publishedAt).toDateString();
                div.appendChild(link);
                div.appendChild(date);
                postsContainer.appendChild(div);
            });
        })
}

const fetchPost = function () {
    const slug = window.location.pathname.replace("/", "");

    fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query Publication {
                publication(host: "engineering.hashnode.com") {
                  isTeam
                  title
                  post(slug: "${slug}") {
                    title,
                    publishedAt,
                    slug,
                    content {
                      html
                    }
                  }
                }
              }`
        })
    }).then(res => res.json())
    .then(res => {
        const page = document.getElementById("page-container");
        const title = document.createElement('div');
        title.className = "font-bold text-3xl px-10 pt-20";
        title.innerHTML = res.data.publication.post.title;

        page.innerHTML = "";
        page.appendChild(title);

        const date = document.createElement('p');
        date.className = "pb-6 px-10 font-light";
        date.innerHTML = new Date(res.data.publication.post.publishedAt).toDateString();

        page.appendChild(date);
        
        const content = document.createElement('div');
        content.className = "px-10"
        content.innerHTML = res.data.publication.post.content.html;
        page.appendChild(content);
        window.history.replaceState({}, res.data.publication.post.title, res.data.publication.post.slug);
    })
}

const router = function() {
    if (window.location.pathname.length != 1) {
        fetchPost();
    } else {
        fetchAll();
    }
}

router()


// const handleLocation = function(event) {
//     var location = window.location.pathname;
//     if (event) {
//         event.preventDefault();
//         location = this.getAttribute('href');
//         const title = this.href;
//         window.history.replaceState({}, title, location);
//     } else {
//         console.log("called on paint");
//     }

//     if (location.length > 1) {
//         fetchPost();
//     }
// }

// window.onpaint = handleLocation();