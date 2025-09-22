import "../styles/mainbanner.scss";

function MainBanner({ image, title, subtitle, buttonText, buttonClick }) {
  return (
    <section className="main-banner">
      <img src={image} alt={title} className="banner-image" />
      <div className="banner-text">
        {title && <h1>{title}</h1>}
        {subtitle && <p>{subtitle}</p>}
        {buttonText && (
          <button className="banner-button" onClick={buttonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
}

export default MainBanner;