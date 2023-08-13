(function () {
  const vscode = acquireVsCodeApi();

  const organizationInput = document.querySelector("#organization");
  const mailInput = document.querySelector("#mail");
  const patToken = document.querySelector("#patToken");
  const credentialsSetButton = document.querySelector(
    "#credentials-set-button"
  );

  const checkCreds = () => {
    credentialsSetButton.disabled =
      !mailInput.value || !patToken.value || !organizationInput.value;
    return !credentialsSetButton.disabled;
  };

  if (checkCreds()) {
    credentialsSetButton.textContent = "CHECK & UPDATE";
  }
  organizationInput.addEventListener("keyup", checkCreds);
  mailInput.addEventListener("keyup", checkCreds);
  patToken.addEventListener("keyup", checkCreds);

  credentialsSetButton.addEventListener("click", () => {
    vscode.postMessage({
      type: "set-configuration",
      data: {
        organizationName: organizationInput.value,
        mail: mailInput.value,
        patToken: patToken.value,
      },
    });
  });

  const projectSelect = document.querySelector("#project-select");
  const areaSelect = document.querySelector("#area-select");

  const setDetails = () => {
    const areaPath = areaSelect?.selectedOptions[0]?.innerText;

    vscode.postMessage({
      type: "set-details",
      data: {
        projectName: projectSelect?.value,
        areaPath: areaPath === "All" ? "" : areaPath,
        subAreaId: areaSelect?.value || "",
      },
    });
  };

  projectSelect?.addEventListener("change", setDetails);
  areaSelect?.addEventListener("change", setDetails);
})();
