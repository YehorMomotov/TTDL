function cout(bestWays) {
  for (let i = 0; i < bestWays.length; i++) {
    console.log("----------------------Начало вывода по критерию " + bestWays[i].bestBy + "----------------------");
    if (bestWays[i].bestBy === "travelTime") {
      let obj = {
        h: Math.round(bestWays[i].required / 3600),
        m: (bestWays[i].required % 3600) / 60,
        s: ((bestWays[i].required % 3600) % 60) / 60,
      };
      console.log("Будет затрачено времени:");
      console.log(obj);
    } else {
      console.log("Будет затрачено денег:");
      console.log(bestWays[i].required);
    }
    console.log("Использованы следующие поезда:");
    for (let j = 0; j < bestWays[i].routes.length; j++) {
      console.group();
      console.log(bestWays[i].routes[j].train);
      for (let z = 0; z < bestWays[i].analog[j].length; z++) {
        if (bestWays[i].analog[j][z]) {
          console.log("или");
          console.log(bestWays[i].analog[j][z]);
        }
      }
      console.groupEnd();
    }
    console.log("----------------------Конец вывода по критерию " + bestWays[i].bestBy + "----------------------");
  }
}
