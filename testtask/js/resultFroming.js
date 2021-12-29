function findAnalogWays(result, key) {
  if (key === "cost") {
    for (let i = 0; i < result.routes.length; i++) {
      result.analog.push([]);
      for (let j = 0; j < result.routes[i].station.getTrainsFromIt().length; j++) {
        if (
          result.routes[i].station.getTrainsFromIt()[j].to === result.routes[i].train.to &&
          result.routes[i].station.getTrainsFromIt()[j].trainNumber !== result.routes[i].train.trainNumber &&
          result.routes[i].station.getTrainsFromIt()[j].cost === result.routes[i].train.cost
        ) {
          result.analog[i].push(result.routes[i].station.getTrainsFromIt()[j]);
        }
      }
    }
  }

  if (key === "travelTime") {
    for (let i = 0; i < result.routes.length; i++) {
      result.analog.push([]);
      if (i === 0) {
        for (let j = 0; j < result.routes[i].station.getTrainsFromIt().length; j++) {
          if (
            result.routes[i].station.getTrainsFromIt()[j].to === result.routes[i].train.to &&
            result.routes[i].station.getTrainsFromIt()[j].trainNumber !== result.routes[i].train.trainNumber &&
            result.routes[i].station.getTrainsFromIt()[j].travelTime === result.routes[i].train.travelTime
          ) {
            result.analog[i].push(result.routes[i].station.getTrainsFromIt()[j]);
          }
        }
      } else {
        for (let j = 0; j < result.routes[i].station.getTrainsFromIt().length; j++) {
          const bestArrivalTime = result.routes[i - 1].train.parseTime("arrivalTime"),
            bestTravelTime = result.routes[i - 1].train.travelTime;

          const nextDepartureTime = result.routes[i].station.getTrainsFromIt()[j].parseTime("departureTime");

          const wait =
            nextDepartureTime >= bestArrivalTime
              ? Math.abs(nextDepartureTime - bestArrivalTime) + bestTravelTime
              : Math.abs(bestArrivalTime - nextDepartureTime) + bestTravelTime + 86400;
          if (
            result.routes[i].station.getTrainsFromIt()[j].to === result.routes[i].train.to &&
            result.routes[i].station.getTrainsFromIt()[j].trainNumber !== result.routes[i].train.trainNumber &&
            wait === result.routes[i][key]
          ) {
            result.analog[i].push(result.routes[i].station.getTrainsFromIt()[j]);
          }
        }
      }
    }
  }
}

function formResult(stations, routes, key, id) {
  const result = { routes: [], analog: [], required: 0 };
  let currentStation = stations.getById(id);
  let nextInfo = {
    key: undefined,
    train: "",
    station: "",
  };

  do {
    nextInfo = defineMin(nextInfo, currentStation, stations, routes, key, result);
    result.routes.push(nextInfo);
    id = nextInfo.train.to;
    currentStation = stations.getById(id);
    nextInfo = {
      key: undefined,
      train: "",
      station: "",
    };
  } while (!(result.routes.length === stations.getLength() - 1));

  findAnalogWays(result, key);

  result.routes.forEach((element) => {
    result.required += element[key];
  });
  result.required = Math.ceil(result.required * 100) / 100;

  return result;
}
