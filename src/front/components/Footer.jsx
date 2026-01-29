export const Footer = () => {
  return (
    <footer className="border-top mt-5 py-4 bg-body-tertiary">
      <div className="container d-flex justify-content-between align-items-center">
        <span className="text-muted">© {new Date().getFullYear()} www.moda</span>

        <div className="d-flex gap-3">
          <a className="text-muted text-decoration-none" href="#">
            Instagram
          </a>
          <a className="text-muted text-decoration-none" href="#">
            TikTok
          </a>
          <a className="text-muted text-decoration-none" href="#">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
