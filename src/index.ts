const url =
  "https://challenge.sandboxnu.com/s/PMRGIYLUMERDU6ZCMVWWC2LMEI5CE43IOJUXMYLTORQXMYJOONXUA3TPOJ2GQZLBON2GK4TOFZSWI5JCFQRGI5LFEI5DCNZTGQ3TKNZRHE4SYITDNBQWY3DFNZTWKIR2EJBWC4TQN5XWYIT5FQRGQYLTNARDUISRNJDGY4TTN5NDISZXMFUXIL2LGF3HGPJCPU======";

export interface User {
  name: string;
  id: number;
  role: number;
}

export interface Request {
  rider: number;
  driver: number;
  accepted: boolean;
}

export interface Group {
  driverId: number;
  riderIds: number[];
  averagePickup: Coordinate;
  averageDropoff: Coordinate;
}

export interface Coordinate {
  x: number;
  y: number;
}

function getCoordinate(id: number, map: Number[][]): Coordinate {
  let y = map.findIndex((row) => row.includes(id));
  let x = map[y].findIndex((num) => num == id);
  return { x: x, y: y };
}

function getDifference(group: Group) {
  return (
    Math.abs(group.averageDropoff.x - group.averagePickup.x) +
    Math.abs(group.averageDropoff.y - group.averagePickup.y)
  );
}

async function fetchData(url: string): Promise<void> {
  try {
    let data = await (await fetch(url)).json();
    let pl = data["pickupLocations"] as Number[][]; // pickup locations
    let dl = data["dropoffLocations"] as Number[][]; // dropoff locations
    let requests = data["requests"] as Request[];
    requests = requests.filter((request) => request.accepted);

    let response: Group[] = [];
    for (let request of requests) {
      const isDriverId = (group) => group.driverId == request.driver;
      const dpc = getCoordinate(request.driver, pl); // driver pickup coordinate
      const ddc = getCoordinate(request.driver, dl); // driver dropoff coordinate
      const rpc = getCoordinate(request.rider, pl); // rider pickup coordinate
      const rdc = getCoordinate(request.rider, dl); // rider dropoff coordinate
      if (response.length == 0 || response.find(isDriverId) == undefined) {
        const newGroup = {
          driverId: request.driver,
          riderIds: [request.rider],
          averagePickup: { x: rpc.x + dpc.x, y: rpc.y + dpc.y },
          averageDropoff: { x: rdc.x + ddc.x, y: rdc.y + ddc.y },
        } as Group;
        response.push(newGroup);
      } else {
        const index = response.findIndex(isDriverId);
        const group = response[index];
        group.riderIds.push(request.rider);
        group.averagePickup = {
          x: group.averagePickup.x + rpc.x,
          y: group.averagePickup.y + rpc.y,
        };
        group.averageDropoff = {
          x: group.averageDropoff.x + rdc.x,
          y: group.averageDropoff.y + rdc.y,
        };
      }
    }

    response.map((group) => {
      const len = group.riderIds.length + 1;
      group.averageDropoff.x = Math.floor(group.averageDropoff.x / len);
      group.averageDropoff.y = Math.floor(group.averageDropoff.y / len);
      group.averagePickup.x = Math.floor(group.averagePickup.x / len);
      group.averagePickup.y = Math.floor(group.averagePickup.y / len);
    });
    response.sort((a, b) => {
      return getDifference(a) - getDifference(b);
    });

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData(url);
