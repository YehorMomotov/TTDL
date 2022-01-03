class Train {
  constructor(trainNumber, from, to, cost, departureTime, arrivalTime) {
    this.trainNumber = trainNumber;
    this.from = from;
    this.to = to;
    this.cost = Number(cost);
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.alreadyUsed = false;
    this.travelTime = this.calculateTravelTime();
  }

  calculateTravelTime() {
    let currMonth = new Date().getMonth() + 1;
    const currDate = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
    currMonth = new Date().getMonth() < 10 ? "0" + currMonth : currMonth;

    const arrivalTime = new Date(`${new Date().getFullYear()}-${currMonth}-${currDate}T${this.arrivalTime}`);

    const departureTime = new Date(`${new Date().getFullYear()}-${currMonth}-${currDate}T${this.departureTime}`);

    const temparrivalTime = arrivalTime.getHours() * 3600 + arrivalTime.getMinutes() * 60 + arrivalTime.getSeconds(),
      tempdepartureTime =
        departureTime.getHours() * 3600 + departureTime.getMinutes() * 60 + departureTime.getSeconds();
    const res =
      temparrivalTime > tempdepartureTime
        ? temparrivalTime - tempdepartureTime
        : 86400 - tempdepartureTime + temparrivalTime;

    return res;
  }

  parseTime(key) {
    let currMonth = new Date().getMonth() + 1;
    const currDate = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
    currMonth = new Date().getMonth() < 10 ? "0" + currMonth : currMonth;
    const result = new Date(`${new Date().getFullYear()}-${currMonth}-${currDate}T${this[key]}`);
    return result.getHours() * 3600 + result.getMinutes() * 60 + result.getSeconds();
  }

  setUsed(boolean) {
    this.alreadyUsed = boolean;
  }
}

class Station {
  constructor(id) {
    this.id = id;
    this.trainsFromIt = [];
    this.alreadyPassed = false;
  }

  getId() {
    return this.id;
  }

  setTrainsFromIt(trainsFromIt) {
    this.trainsFromIt.push(trainsFromIt);
  }

  getTrainsFromIt() {
    return this.trainsFromIt;
  }

  setPassed(boolean) {
    this.alreadyPassed = boolean;
  }

  canReach(station) {
    for (let i = 0; i < this.getTrainsFromIt().length; i++) {
      if (this.getTrainsFromIt()[i].to === station.getId()) {
        return true;
      }
    }
    return false;
  }
}

class Stations {
  constructor() {
    this.stations = [];
  }

  set(station) {
    this.stations.push(station);
  }

  getById(id) {
    for (let index = 0; index < this.stations.length; index++) {
      if (this.stations[index].id === id) {
        return this.stations[index];
      }
    }
  }

  getLength() {
    return this.stations.length;
  }

  getUnpassedStations() {
    let res = [];
    for (let index = 0; index < this.stations.length; index++) {
      if (!this.stations[index].alreadyPassed) {
        res.push(this.stations[index]);
      }
    }
    return res;
  }

  setAllUnpassed() {
    for (let index = 0; index < this.stations.length; index++) {
      this.stations[index].setPassed(false);
    }
  }
}

class Routes {
  constructor() {
    this.routes = [];
  }

  set(route) {
    this.routes.push(route);
  }

  getByIndex(index) {
    return this.routes[index];
  }

  getLength() {
    return this.routes.length;
  }

  getByTrainNumber(trainNumber) {
    for (let index = 0; index < this.routes.length; index++) {
      if (this.routes[index].trainNumber === trainNumber) {
        return this.routes[index];
      }
    }
  }

  setUnused(routes = this.routes) {
    for (let i = 0; i < routes.length; i++) {
      for (let j = 0; j < this.routes.length; j++) {
        if (this.routes[j].trainNumber === routes[i].trainNumber) {
          this.routes[j].setUsed(false);
        }
      }
    }
  }
}
