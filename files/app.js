const bars = document.getElementById('bars');
const summary = document.getElementById('summary');
async function render(context) {
  document.getElementById('title').textContent = context.notebook ? context.notebook.title : 'Notebook stats';
  try {
    const sources = await betterVault.call('sources.list');
    const total = sources.reduce((sum, s) => sum + s.characters, 0);
    const most = Math.max(1, ...sources.map((s) => s.characters));
    summary.textContent = sources.length + ' sources · ' + total.toLocaleString(context.language) + ' characters';
    bars.replaceChildren(...sources.sort((a, b) => b.characters - a.characters).map((s) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = s.title;
      const meta = document.createElement('span');
      meta.className = 'format';
      meta.textContent = s.format.toUpperCase() + ' · ' + s.characters.toLocaleString(context.language);
      const bar = document.createElement('div');
      bar.className = 'bar';
      const fill = document.createElement('span');
      fill.style.width = (100 * s.characters / most).toFixed(1) + '%';
      bar.append(fill);
      li.append(name, meta, bar);
      return li;
    }));
  } catch (error) {
    summary.textContent = error.message;
  }
}
betterVault.onContext(render);
