import NewsItem from './NewsItem';

export default function NewsList({ title, news }) {
  return (
    <section className="news-list">
      {/* Optionale h2 für title */}
      {title && <h2>{title}</h2>}
      {/* Für jeden Eintrag in news ein NewsItem */}
      {news.map((item, index) => (
        <NewsItem key={item.url} {...item} index={index} />
      ))}
    </section>
  );
}
