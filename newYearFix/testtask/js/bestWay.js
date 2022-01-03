function reversStart(nextInfo, currentStation, stations, routes, key, result) {
  const sortedStations = new Stations();
  stations.stations.forEach((element) => {
    sortedStations.stations.push(element);
  });

  sortedStations.stations.sort((first, second) => {
    if (first.getTrainsFromIt().length < second.getTrainsFromIt().length) {
      return 1;
    }
    if (first.getTrainsFromIt().length > second.getTrainsFromIt().length) {
      return -1;
    }
    return 0;
  });

  if (!result.routes[result.routes.length - 1]) {
    const unpassedStations = sortedStations.getUnpassedStations();
    for (let l = unpassedStations.length - 1; l > 0; l--) {
      if (currentStation.canReach(unpassedStations[l]) && currentStation.id !== unpassedStations[l].id) {
        for (let n = 0; n < currentStation.getTrainsFromIt().length; n++) {
          if (currentStation.getTrainsFromIt()[n].to === unpassedStations[l].id) {
            routes.setUnused([currentStation.getTrainsFromIt()[n]]);
            result.routes.push(defineMin(nextInfo, currentStation, sortedStations, routes, key, result));
            break;
          }
        }
        routes.setUnused();
        return (currentStation = unpassedStations[l]);
      }
    }
  }
}

function compareFoo(bestWay, currentStation, key, index, result) {
  switch (key) {
    case "cost":
      if (bestWay[key] === undefined) {
        bestWay[key] = currentStation.getTrainsFromIt()[index][key];
      }
      if (bestWay[key] >= currentStation.getTrainsFromIt()[index][key]) {
        bestWay[key] = currentStation.getTrainsFromIt()[index][key];
        bestWay.train = currentStation.getTrainsFromIt()[index];
        bestWay.station = currentStation;
      }
      break;

    case "travelTime":
      if (!result.routes[0]) {
        if (bestWay[key] === undefined) {
          bestWay[key] = currentStation.getTrainsFromIt()[index][key];
        }
        if (bestWay[key] >= currentStation.getTrainsFromIt()[index][key]) {
          bestWay[key] = currentStation.getTrainsFromIt()[index][key];
          bestWay.train = currentStation.getTrainsFromIt()[index];
          bestWay.station = currentStation;
        }
        return;
      }

      if (result.routes[result.routes.length - 1]) {
        const bestArrivalTime = result.routes[result.routes.length - 1].train.parseTime("arrivalTime"),
          bestTravelTime = result.routes[result.routes.length - 1].train[key];

        const nextDepartureTime = currentStation.getTrainsFromIt()[index].parseTime("departureTime");
        const waitTimePlusTimeInWay =
          nextDepartureTime >= bestArrivalTime
            ? Math.abs(nextDepartureTime - bestArrivalTime) + bestTravelTime
            : Math.abs(nextDepartureTime - bestArrivalTime) + bestTravelTime + 86400;

        if (bestWay[key] === undefined) {
          bestWay[key] = waitTimePlusTimeInWay;
        }

        if (bestWay[key] >= waitTimePlusTimeInWay) {
          bestWay[key] = waitTimePlusTimeInWay;
          bestWay.train = currentStation.getTrainsFromIt()[index];
          bestWay.station = currentStation;
        }
      }
      break;

    default:
      break;
  }
}

function defineMin(nextInfo, currentStation, stations, routes, key, result) {
  let bestWay = nextInfo;
  for (let i = 0; i < currentStation.getTrainsFromIt().length; i++) {
    if (!routes.getByTrainNumber(currentStation.getTrainsFromIt()[i].trainNumber).alreadyUsed) {
      if (!stations.getById(currentStation.getTrainsFromIt()[i].to).alreadyPassed) {
        compareFoo(bestWay, currentStation, key, i, result);
      }
    }
  }

  let reversCalled = false;
  stations.getById(currentStation.getId()).setPassed(true);
  if (bestWay.train === "") {
    if (
      result.routes.length === stations.getLength() - 2 &&
      currentStation.canReach(stations.getUnpassedStations()[0])
    ) {
      for (let i = 0; i < currentStation.getTrainsFromIt().length; i++) {
        if (currentStation.trainsFromIt[i].to === stations.getUnpassedStations()[0].getId()) {
          routes.getByTrainNumber(currentStation.trainsFromIt[i].trainNumber).setUsed(false);
        }
      }
    } else {
      stations.getById(currentStation.getId()).setPassed(false);
      if (!result.routes[result.routes.length - 1]) {
        currentStation = reversStart(nextInfo, currentStation, stations, routes, key, result);
        reversCalled = true;
      } else {
        currentStation = result.routes[result.routes.length - 1].station;
      }
      if (!reversCalled) {
        result.routes.splice(result.routes.length - 1, result.routes.length);
      }
    }
    nextInfo = {
      key: undefined,
      train: "",
      station: "",
    };
    bestWay = defineMin(nextInfo, currentStation, stations, routes, key, result);
  } else if (!stations.getById(bestWay.train.to).alreadyPassed) {
    routes.getByTrainNumber(bestWay.train.trainNumber).setUsed(true);
  }
  return bestWay;
}
