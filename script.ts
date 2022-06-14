interface Vehicle {
  name: string;
  plate: string;
  arrival: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);
  function calcStayPeriod(miliseconds: number): string {
    const minutes = Math.floor(miliseconds / 60000);
    const seconds = Math.floor((miliseconds % 60000) / 1000);
    return `${minutes}min. and ${seconds}sec.`;
  }

  function parkingLot() {
    function read(): Vehicle[] {
      return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
    }
    function add(vehicle: Vehicle, isSaved: boolean) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.plate}</td>
        <td>${vehicle.arrival}</td>
        <td>
          <button class="delete" data-plate="${vehicle.plate}">Delete</button>
        </td>
      `;

      row.querySelector('.delete')?.addEventListener('click', function () {
        remove(this.dataset.plate);
      });

      $('#parkingLot')?.appendChild(row);

      if (!isSaved) {
        save([...read(), vehicle]);
      }
    }
    function save(vehicles: Vehicle[]) {
      localStorage.setItem('parkingLot', JSON.stringify(vehicles));
    }
    function remove(plate: string) {
      const { arrival, name } = read().find(vehicle => vehicle.plate === plate);
      const period = calcStayPeriod(new Date().getTime() - new Date(arrival).getTime());
      if (
        !confirm(
          `The vehicle ${name} has been parked for ${period}. Do you want to remove it from the parking lot?`
        )
      )
        return;
      save(read().filter(vehicle => vehicle.plate !== plate));
      render();
    }
    function render() {
      $('#parkingLot')!.innerHTML = '';
      const parkingLotVehicles = read();
      if (parkingLotVehicles.length > 0) {
        parkingLotVehicles.forEach(vehicle => add(vehicle, true));
      }
    }
    return { read, add, remove, save, render };
  }

  parkingLot().render();

  $('#register')?.addEventListener('click', () => {
    const vehicleName = $('#vehicleName')?.value;
    const vehiclePlate = $('#vehiclePlate')?.value;
    if (!vehicleName || !vehiclePlate) {
      alert('Both input fields are mandatory');
      return;
    }

    let newVehicle: Vehicle;
    newVehicle = {
      name: vehicleName,
      plate: vehiclePlate,
      arrival: new Date().toISOString()
    };

    parkingLot().add(newVehicle, false);
  });
})();
