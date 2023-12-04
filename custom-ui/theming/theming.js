const iframe = document.getElementById("iframe");
const viewer = new ProductViewer(iframe);

viewer.init("e725a9e18cb87bbc2977b73d4bdc65", {
	ui_color_primary: "1d2130",
	ui_color_secondary: "ffffff",
	ui_color_accent: "ffffff",
	ui_progress_color: "ffffff",
	ui_progress_bg_color: "000000AA",
	ui_infos: false,
	ui_logo: false,
	ui_progress_logo: "https://place-hold.it/100x100",
});
