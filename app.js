const form = document.getElementById("newsForm");
const results = document.getElementById("results");
const alertContainer = document.getElementById("alertContainer");
const apiKey = "9383184bc93a484c9519074962a2c6c3";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const query = document.getElementById("query").value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;

  results.innerHTML = "";
  alertContainer.innerHTML = "";

  let url = `https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&apiKey=${apiKey}`;
  if (from) {
    url += `&from=${from}`;
  }
  if (to) {
    url += `&to=${to}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "ok") {
    alertContainer.innerHTML = `<div class="alert alert-danger">Error: ${data.message}</div>`;
    return;
  }
  if (!data.articles || data.articles.length === 0) {
    alertContainer.innerHTML = `<div class="alert alert-info">No se encontraron noticias.</div>`;
    return;
  }

  for (let i = 0; i < data.articles.length; i += 2) {
    const row = document.createElement("div");
    row.className = "row g-4 mb-2";

    for (let j = i; j < i + 2 && j < data.articles.length; j++) {
      const noticia = data.articles[j];
      const col = document.createElement("div");
      col.className = "col-md-6";

      let imagen;
      if (noticia.urlToImage) {
        imagen = noticia.urlToImage;
      } else {
        imagen = imagen =
          "https://dummyimage.com/400x200/cccccc/000000&text=Sin+Imagen";
      }

      let titulo;
      if (noticia.title) {
        titulo = noticia.title;
      } else {
        titulo = "Sin título";
      }

      let descripcion;
      if (noticia.description) {
        descripcion = noticia.description;
      } else {
        descripcion = "Sin descripción";
      }

      let fuente;
      if (noticia.source && noticia.source.name) {
        fuente = noticia.source.name;
      } else {
        fuente = "Desconocida";
      }

      let fecha;
      if (noticia.publishedAt) {
        fecha = new Date(noticia.publishedAt).toLocaleString();
      } else {
        fecha = "Sin fecha";
      }

      col.innerHTML = `
                <div class="card h-100">
                    <img src="${imagen}" class="card-img-top" alt="Imagen noticia" style="object-fit:cover;max-height:200px;">
                    <div class="card-body">
                        <h5 class="card-title">${titulo}</h5>
                        <p class="card-text">${descripcion}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">
                            Fuente: ${fuente}<br>
                            Fecha: ${fecha}
                        </small>
                        <br>
                        <a href="${noticia.url}" class="btn btn-sm btn-primary mt-2" target="_blank">Ver noticia</a>
                    </div>
                </div>
            `;
      row.appendChild(col);
    }
    results.appendChild(row);
  }
});
