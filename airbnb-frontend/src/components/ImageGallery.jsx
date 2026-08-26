import '../styles/gallery.css';

export default function ImageGallery({ images = [], title }) {
  const [main, ...rest] = images;
  const thumbs = rest.slice(0, 4);

  return (
    <div className="gallery">
      <div className="gallery__main">
        {main && <img src={main} alt={title} loading="lazy" />}
      </div>
      <div className="gallery__grid">
        {thumbs.map((img, i) => (
          <div key={i} className="gallery__thumb">
            <img src={img} alt={`${title} photo ${i + 2}`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
