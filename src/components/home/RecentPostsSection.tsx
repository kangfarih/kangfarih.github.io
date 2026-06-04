import Link from "next/link";

export function RecentPostsSection({
  id = "recent-posts",
  posts,
}: {
  id?: string;
  posts: { title: string; summary: string; date: string; url: string; hero: string }[];
}) {
  return (
    <div className="container-fluid anchor pb-5 recent-posts-section" id={id}>
      <h1 className="text-center">Recent Posts</h1>
      <div className="container">
        <div className="row" id="recent-post-cards">
          {posts.map((p) => (
            <div className="col-lg-4 col-md-6 pt-2 post-card" key={p.url}>
              <Link href={p.url} className="post-card-link">
                <div className="card">
                  <div className="card-head">
                    <img className="card-img-top" src={p.hero} alt="Card image cap" />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{p.title}</h5>
                    <p className="card-text post-summary">{p.summary}</p>
                  </div>
                  <div className="card-footer">
                    <span className="float-left">{p.date}</span>
                    <span className="float-right btn btn-outline-info btn-sm">Read</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

