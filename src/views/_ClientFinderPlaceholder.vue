<template>
  <div class="page-shell">
    <section class="page-section">
      <div class="page-heading">
        <div>
          <h1>Client Finder</h1>
          <p>
            Phase 2 will turn collected places into outreach-ready opportunities, without changing the foundation built for Phase 1.
          </p>
        </div>
        <span class="badge badge--gold">Coming in Phase 2</span>
      </div>

      <article class="card placeholder__hero">
        <div class="card-body placeholder__hero-grid">
          <div class="placeholder__copy">
            <p class="eyebrow">Roadmap Preview</p>
            <h2>From place discovery to conversion workflow</h2>
            <p>
              The next phase will layer decision-maker discovery, outreach tracking, follow-up history, and pipeline management on top of the place records already collected here.
            </p>

            <div class="placeholder__bullets">
              <div class="placeholder__bullet">
                <strong>Find decision makers</strong>
                <span>Store owners, managers, marketers, and contact channels linked to each place.</span>
              </div>
              <div class="placeholder__bullet">
                <strong>Track outreach</strong>
                <span>Email, call, WhatsApp, and social contact attempts with timestamps and notes.</span>
              </div>
              <div class="placeholder__bullet">
                <strong>Manage pipeline</strong>
                <span>Move leads from untouched to contacted, qualified, negotiating, and won.</span>
              </div>
            </div>
          </div>

          <div class="placeholder__mockup">
            <div class="placeholder__panel placeholder__panel--wide">
              <header>
                <span class="badge badge--blue">Lead board</span>
                <strong>Hijab shops • Dhaka</strong>
              </header>
              <div class="placeholder__kanban">
                <section>
                  <h4>New</h4>
                  <div class="placeholder__ticket">
                    <strong>Noor Boutique</strong>
                    <span>Owner unknown</span>
                  </div>
                  <div class="placeholder__ticket">
                    <strong>Modest Wear Hub</strong>
                    <span>Website found</span>
                  </div>
                </section>
                <section>
                  <h4>Contacted</h4>
                  <div class="placeholder__ticket">
                    <strong>Urban Hijab House</strong>
                    <span>Email sent • Awaiting reply</span>
                  </div>
                </section>
                <section>
                  <h4>Qualified</h4>
                  <div class="placeholder__ticket placeholder__ticket--accent">
                    <strong>Scarves & Co.</strong>
                    <span>Decision maker identified</span>
                  </div>
                </section>
              </div>
            </div>

            <div class="placeholder__panel-row">
              <div class="placeholder__panel">
                <header>
                  <span class="badge badge--accent">Contact intel</span>
                </header>
                <ul>
                  <li>Owner name</li>
                  <li>Best channel</li>
                  <li>Last response</li>
                  <li>Next follow-up</li>
                </ul>
              </div>

              <div class="placeholder__panel">
                <header>
                  <span class="badge badge--gold">Sequence steps</span>
                </header>
                <ul>
                  <li>Intro message</li>
                  <li>Social proof</li>
                  <li>Case study</li>
                  <li>Close / nurture</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.placeholder__hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: var(--space-6);
}

.placeholder__copy h2,
.placeholder__copy p {
  margin: 0;
}

.placeholder__copy h2 {
  margin-top: var(--space-3);
  font-family: var(--font-display);
  font-size: 2.3rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.placeholder__copy > p:last-of-type {
  margin-top: var(--space-3);
  color: var(--text-muted);
}

.placeholder__bullets {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-5);
}

.placeholder__bullet {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(10, 22, 29, 0.72);
}

.placeholder__bullet span {
  color: var(--text-muted);
}

.placeholder__mockup {
  display: grid;
  gap: var(--space-4);
}

.placeholder__panel-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.placeholder__panel {
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(180deg, rgba(17, 34, 45, 0.9), rgba(10, 20, 27, 0.94)),
    var(--surface);
}

.placeholder__panel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.placeholder__panel ul {
  display: grid;
  gap: var(--space-3);
  padding-left: 1.2rem;
  margin: 0;
  color: var(--text-muted);
}

.placeholder__kanban {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.placeholder__kanban section {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(9, 20, 26, 0.62);
}

.placeholder__kanban h4 {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.placeholder__ticket {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(11, 24, 31, 0.92);
}

.placeholder__ticket span {
  color: var(--text-dim);
  font-size: 0.84rem;
}

.placeholder__ticket--accent {
  border-color: rgba(34, 224, 194, 0.3);
  background: rgba(17, 50, 57, 0.68);
}

@media (max-width: 1120px) {
  .placeholder__hero-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .placeholder__kanban,
  .placeholder__panel-row {
    grid-template-columns: 1fr;
  }
}
</style>
