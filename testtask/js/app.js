Papa.parse("http://127.0.0.1:5500//test_task_data.csv", {
  download: true,
  delimiter: ";",
  newline: "",
  complete: function (results) {
    app(results.data);
  },
});

//Программа тестируется через раширение Live Server!!!

function resetAll(stations = new Stations(), routes = new Routes()) {
  stations.setAllUnpassed();
  routes.setUnused();
}

function app(data) {
  const routes = new Routes();
  const stsArr = [];

  const stations = new Stations();
  for (let index = 0; index < data.length; index++) {
    routes.set(
      new Train(data[index][0], data[index][1], data[index][2], data[index][3], data[index][4], data[index][5])
    );
  }

  for (let index = 0; index < routes.getLength(); index++) {
    if (!stsArr.includes(routes.getByIndex(index).to)) {
      stsArr.push(routes.getByIndex(index).to);
      stations.set(new Station(routes.getByIndex(index).to));
    }
  }

  for (let i = 0; i < stsArr.length; i++) {
    for (let j = 0; j < routes.getLength(); j++) {
      if (stsArr[i] === routes.getByIndex(j).from) {
        stations.getById(stsArr[i]).setTrainsFromIt(routes.getByIndex(j));
      }
    }
  }

  const result = [[], []];
  let key = "travelTime";
  const bestWays = [];
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < stations.getLength(); j++) {
      let id = stations.stations[j].id;
      try {
        result[i].push(formResult(stations, routes, key, id));
        resetAll(stations, routes);
      } catch (error) {
        console.log(error);
      }
    }

    result[i].sort((first, second) => {
      if (first.required > second.required) {
        return 1;
      }
      if (first.required < second.required) {
        return -1;
      }
      return 0;
    });
    result[i][0].bestBy = key;
    bestWays.push(result[i][0]);
    key = "cost";
  }
  console.log("Это массив ВСЕХ путей, созданных алгоритмом");
  console.log(result);

  cout(bestWays);
}
