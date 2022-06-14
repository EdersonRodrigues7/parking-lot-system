(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcStayPeriod(miliseconds) {
        const minutes = Math.floor(miliseconds / 60000);
        const seconds = Math.floor((miliseconds % 60000) / 1000);
        return `${minutes}min. and ${seconds}sec.`;
    }
    function parkingLot() {
        function read() {
            return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
        }
        function add(vehicle, isSaved) {
            var _a, _b;
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.plate}</td>
        <td>${vehicle.arrival}</td>
        <td>
          <button class="delete" data-plate="${vehicle.plate}">Delete</button>
        </td>
      `;
            (_a = row.querySelector('.delete')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                remove(this.dataset.plate);
            });
            (_b = $('#parkingLot')) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (!isSaved) {
                save([...read(), vehicle]);
            }
        }
        function save(vehicles) {
            localStorage.setItem('parkingLot', JSON.stringify(vehicles));
        }
        function remove(plate) {
            const { arrival, name } = read().find(vehicle => vehicle.plate === plate);
            const period = calcStayPeriod(new Date().getTime() - new Date(arrival).getTime());
            if (!confirm(`The vehicle ${name} has been parked for ${period}. Do you want to remove it from the parking lot?`))
                return;
            save(read().filter(vehicle => vehicle.plate !== plate));
            render();
        }
        function render() {
            $('#parkingLot').innerHTML = '';
            const parkingLotVehicles = read();
            if (parkingLotVehicles.length > 0) {
                parkingLotVehicles.forEach(vehicle => add(vehicle, true));
            }
        }
        return { read, add, remove, save, render };
    }
    parkingLot().render();
    (_a = $('#register')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const vehicleName = (_a = $('#vehicleName')) === null || _a === void 0 ? void 0 : _a.value;
        const vehiclePlate = (_b = $('#vehiclePlate')) === null || _b === void 0 ? void 0 : _b.value;
        if (!vehicleName || !vehiclePlate) {
            alert('Both input fields are mandatory');
            return;
        }
        let newVehicle;
        newVehicle = {
            name: vehicleName,
            plate: vehiclePlate,
            arrival: new Date().toISOString()
        };
        parkingLot().add(newVehicle, false);
    });
})();
