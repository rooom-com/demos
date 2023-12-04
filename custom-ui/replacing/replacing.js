const iframe = document.getElementById("iframe");
const viewer = new ProductViewer(iframe);

viewer.init("e725a9e18cb87bbc2977b73d4bdc65", {
	ui_controls: false, // disable control elements
	ui_annotations: false, // disable annotation controls
	ui_animations: false, // disable animation controls
	ui_infos: false, // remove top info bar
	ui_logo: false, // remove logo in bottom left corner
	onSuccess: function (api) {
		const button = document.getElementById("reset");
		button.addEventListener("click", function () {
			api.recenterCamera();
		});

		api.on("viewer.start", function () {
			button.style.display = "block";
		});
	},
});
