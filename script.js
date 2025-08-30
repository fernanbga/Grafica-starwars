// Titulos y fechas de estreno
function renderFilmChart(dataset) {
  const filmTitles = [];
  const releaseYears = [];

  for (let i = 0; i < dataset.length; i++) {
    filmTitles.push(dataset[i].title);
    const year = dataset[i].release_date.slice(0, 4); //Extraer año del date string
    releaseYears.push(year);
  }

  const data = {
    labels: filmTitles,
    series: [releaseYears],
  };

  const yAxisOptions = {
    onlyInteger: true,
  };

  const chartOptions = {
    fullWidth: true,
    chartPadding: {
      right: 40,
    },
  };

  // Render dentro del 1 starWars container
  new Chartist.Line(".starWars", data, yAxisOptions, chartOptions);
}

//Fetch Film Data de la API
async function fetchFilmData() {
  try {
    const response = await fetch("https://swapi.info/api/films");

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Resource not found (404)");
      } else if (response.status === 500) {
        throw new Error("Server error (500)");
      } else {
        throw new Error(`HTTP error: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log("Films:", data);
    renderFilmChart(data);
  } catch (error) {
    if (error.message.includes("404")) {
      console.error("Error: The requested resource was not found.");
    } else if (error.message.includes("500")) {
      console.error("Error: Server encountered a problem.");
    } else {
      console.error("Unexpected error:", error.message);
    }
  }
}

// Personajes y numeros de pelis
function renderCharacterChart(dataset) {
  const characterNames = [];
  const filmCounts = [];

  for (const character of dataset) {
    characterNames.push(character.name);
    filmCounts.push(character.films.length);
  }

  const data = {
    labels: characterNames,
    series: [filmCounts],
  };

  const chartOptions = {
    seriesBarDistance: 15,
  };

  const responsiveOptions = [
    [
      "screen and (min-width: 641px) and (max-width: 1024px)",
      {
        seriesBarDistance: 10,
        axisX: {
          labelInterpolationFnc: value => value,
        },
      },
    ],
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: value => value[0], // Solo la primera letra del name
        },
      },
    ],
  ];

  // renderizar dentro del starWars2 container
  new Chartist.Bar(".starWars2", data, chartOptions, responsiveOptions);
}

// Obtener datos de la api
async function fetchCharacterData() {
  const characterIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  try {
    const responses = await Promise.all(
      characterIds.map(id => fetch(`https://swapi.info/api/people/${id}`))
    );

    for (const response of responses) {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Resource not found (404)");
        } else if (response.status === 500) {
          throw new Error("Server error (500)");
        } else {
          throw new Error(`HTTP error: ${response.status}`);
        }
      }
    }

    const data = await Promise.all(responses.map(res => res.json()));
    console.log("Characters:", data);
    renderCharacterChart(data);
  } catch (error) {
    if (error.message.includes("404")) {
      console.error("Error: The requested resource wasn't found.");
    } else if (error.message.includes("500")) {
      console.error("Error: Server encountered a problem.");
    } else {
      console.error("Unexpected error:", error.message);
    }
  }
}

// los dos fetch
fetchFilmData();
fetchCharacterData();

