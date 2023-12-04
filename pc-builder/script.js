const viewerID = "2d3f3b8c0ec144317151513f0e6aab";
const iframe = document.getElementById("iframe");
const progress = document.getElementById("progress");

// Objects
const PSU = {
	objectID: "Power_Supply",
	placeholderID: "Power_Supply_placeholder",
};
const RAM = {
	objectID: "RAM",
	placeholderID: "RAM_placeholder",
};
const Mainboard = {
	objectID: "Motherboard",
	placeholderID: "Motherboard_placeholder",
};
const DiskDrive = {
	objectID: "Disk_Drive",
	placeholderID: "Disk_Drive_placeholder",
};
const HardDrive = {
	objectID: "Hard_Drives",
	placeholderID: "Hard_Drives_placeholder",
};
const GPU = {
	objectID: "Graficscard",
	placeholderID: "Graficscard_placeholder",
};
const Ventilation = {
	objectID: "Vents",
	placeholderID: "Vents_placeholder",
};

// Buttons
const buttonPSU = document.getElementById("btnPSU");
const buttonRAM = document.getElementById("btnRAM");
const buttonMainboard = document.getElementById("btnMainboard");
const buttonDiskDrive = document.getElementById("btnDiskDrive");
const buttonHardDrive = document.getElementById("btnHardDrive");
const buttonGPU = document.getElementById("btnGPU");
const buttonVentilation = document.getElementById("btnVentilation");

const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
	ui_controls: false, // remove control elements
	render_background: true, // render even when not focused
	transparent: true, // make the viewer environment transparent
	ui_hint: false, // disable startup hint
	camera_zoom_start: 4, // zoom in
	onSuccess: function (api) {
		api.on("viewer.start", function () {
			let currentIndex = 0;
			const objectList = [
				PSU,
				RAM,
				Mainboard,
				DiskDrive,
				HardDrive,
				GPU,
				Ventilation,
			].sort(() => 0.5 - Math.random());

			api.hide("Side_glass");
			objectList.forEach((element, index) => {
				api.hide(element.objectID);
				if (index > 0) api.hide(element.placeholderID);
				else api.show(element.placeholderID);
			});

			function onButtonPress(answer) {
				if (answer != objectList[currentIndex]) {
					// negative feedback logic //
					alert("That's wrong!");
					return;
				}

				// show object
				api.hide(answer.placeholderID);
				api.show(answer.objectID);

				currentIndex += 1;
				progress.value = currentIndex;

				if (currentIndex == objectList.length) {
					alert("You finished the game!");
					return;
				}

				// show next placeholder
				api.show(objectList[currentIndex].placeholderID);
			}

			buttonPSU.addEventListener("click", () => onButtonPress(PSU));
			buttonRAM.addEventListener("click", () => onButtonPress(RAM));
			buttonMainboard.addEventListener("click", () => onButtonPress(Mainboard));
			buttonDiskDrive.addEventListener("click", () => onButtonPress(DiskDrive));
			buttonHardDrive.addEventListener("click", () => onButtonPress(HardDrive));
			buttonGPU.addEventListener("click", () => onButtonPress(GPU));
			buttonVentilation.addEventListener("click", () =>
				onButtonPress(Ventilation)
			);
		});
	},
});
