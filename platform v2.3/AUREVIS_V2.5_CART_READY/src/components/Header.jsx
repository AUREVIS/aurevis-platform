/* AUREVIS contact section */

.catalog-contact-section {
  position: relative;
  overflow: hidden;
  margin: 70px 0 20px;
  padding: 55px 45px;
  border: 1px solid rgba(213, 177, 99, 0.38);
  border-radius: 34px;
  background:
    radial-gradient(
      circle at top right,
      rgba(202, 166, 91, 0.22),
      transparent 38%
    ),
    linear-gradient(135deg, #06251c, #0c392c);
  box-shadow: 0 28px 70px rgba(6, 37, 28, 0.18);
  color: white;
}

.catalog-contact-glow {
  position: absolute;
  width: 260px;
  height: 260px;
  right: -90px;
  top: -110px;
  border-radius: 50%;
  background: rgba(218, 183, 106, 0.2);
  filter: blur(25px);
  pointer-events: none;
}

.catalog-contact-heading {
  position: relative;
  max-width: 720px;
  margin-bottom: 32px;
}

.catalog-contact-heading > span {
  display: block;
  margin-bottom: 12px;
  color: #d8b76e;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.18em;
}

.catalog-contact-heading h2 {
  margin: 0 0 14px;
  color: white;
  font-family: Georgia, serif;
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 1.05;
}

.catalog-contact-heading p {
  max-width: 650px;
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 1rem;
  line-height: 1.7;
}

.catalog-contact-cards {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.catalog-contact-card {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 125px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.075);
  color: white;
  text-decoration: none;
  backdrop-filter: blur(12px);
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease;
}

.catalog-contact-card:hover {
  transform: translateY(-5px);
  border-color: rgba(216, 183, 110, 0.65);
  background: rgba(255, 255, 255, 0.13);
}

.contact-icon {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: #d1aa59;
  color: #06251c;
  font-size: 1.45rem;
  font-weight: 900;
}

.catalog-contact-card small,
.catalog-contact-card b,
.catalog-contact-card p {
  display: block;
}

.catalog-contact-card small {
  margin-bottom: 5px;
  color: #d8b76e;
  font-size: 0.75rem;
  font-weight: 800;
}

.catalog-contact-card b {
  color: white;
  font-size: 1rem;
  overflow-wrap: anywhere;
}

.catalog-contact-card p {
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.82rem;
}

@media (max-width: 900px) {
  .catalog-contact-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .catalog-contact-section {
    margin-top: 45px;
    padding: 38px 20px;
    border-radius: 25px;
  }

  .catalog-contact-card {
    min-height: 105px;
    padding: 17px;
  }
}
