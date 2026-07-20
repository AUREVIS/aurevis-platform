const cards = [
  ["Website", "Online"],
  ["Supabase", "Ready"],
  ["Telegram", "Environment ready"],
  ["Orders", "Next sprint"]
];

export default function AdminPage() {
  return (
    <section className="page admin-page">
      <div className="page-heading">
        <p className="eyebrow">AUREVIS CONTROL CENTER</p>
        <h1>Admin Dashboard</h1>
      </div>
      <div className="status-grid">
        {cards.map(([title, value]) => (
          <article key={title}><span>{title}</span><b>{value}</b></article>
        ))}
      </div>
      <div className="admin-panel">
        <h2>Առաջին իրական Admin sprint</h2>
        <p>Orders table, Telegram Test, Test Order և status management-ը կավելացվեն այս React հիմքի վրա։</p>
      </div>
    </section>
  );
}
