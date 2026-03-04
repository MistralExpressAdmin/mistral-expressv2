const ME_WEATHER = (() => {
  const ports = [
    { id:"beaulieu", nameKey:"ports.beaulieu", lat:43.70758, lon:7.33289 },
    { id:"sjcf",     nameKey:"ports.sjcf",     lat:43.683334, lon:7.333334 },
    { id:"villef",   nameKey:"ports.villef",   lat:43.705,    lon:7.3125 }
  ];

  const cache = new Map(); // id -> { ts, data }
  const TTL = 3 * 60 * 1000; // 3 min

  function fmtDir(deg){
    const dirs = ["N","NE","E","SE","S","SW","W","NW"];
    const i = Math.round(deg/45) % 8;
    return dirs[i];
  }

  function skyFromCode(code){
    // mapping simple WMO (tu peux i18n-iser plus tard)
    if (code === 0) return "Ciel clair";
    if ([1,2,3].includes(code)) return "Peu nuageux";
    if ([45,48].includes(code)) return "Brume";
    if ([51,53,55,61,63,65].includes(code)) return "Pluie";
    if ([71,73,75,77].includes(code)) return "Neige";
    if ([95,96,99].includes(code)) return "Orage";
    return "Variable";
  }

  async function fetchPort(p){
    const now = Date.now();
    const c = cache.get(p.id);
    if (c && (now - c.ts) < TTL) return c.data;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=Europe%2FParis`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("weather fetch failed");

    const data = await res.json();
    const cur = data.current;

    const out = {
      name: window.ME_I18N?.t?.(p.nameKey) || p.id,
      temp: Math.round(cur.temperature_2m),
      wind: Math.round(cur.wind_speed_10m),
      dir: fmtDir(cur.wind_direction_10m),
      sky: skyFromCode(cur.weather_code)
    };

    cache.set(p.id, { ts: now, data: out });
    return out;
  }

  function skeleton(){
    return `
      <div class="weather">
        <div>
          <div class="w-title">…</div>
          <div class="w-sub">…</div>
        </div>
        <div class="w-right">
          <div class="w-temp">…</div>
          <div class="w-wind">…</div>
        </div>
      </div>
    `;
  }

  async function render(){
    const grid = document.getElementById("weatherGrid");
    if (!grid) return;

    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = ports.map(skeleton).join("");

    try{
      const items = await Promise.all(ports.map(fetchPort));
      grid.innerHTML = items.map(x => `
        <div class="weather">
          <div>
            <div class="w-title">${escapeHtml(x.name)}</div>
            <div class="w-sub">${escapeHtml(x.sky)}</div>
          </div>
          <div class="w-right">
            <div class="w-temp">${x.temp}°C</div>
            <div class="w-wind">${x.wind} km/h ${escapeHtml(x.dir)}</div>
          </div>
        </div>
      `).join("");
    } catch(err){
      console.error(err);
      grid.innerHTML = `<p class="muted">Météo indisponible pour le moment.</p>`;
    } finally {
      grid.setAttribute("aria-busy", "false");
    }
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    render().catch(()=>{});
    setInterval(() => render().catch(()=>{}), 10 * 60 * 1000);
  });

  window.addEventListener("me:lang", () => render().catch(()=>{}));

  return { render };
})();

window.ME_WEATHER = ME_WEATHER;