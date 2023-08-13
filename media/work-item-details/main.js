(function () {
  const vscode = acquireVsCodeApi();

  const organizationInput = document.querySelector("#organization");
  const mailInput = document.querySelector("#mail");
  const tokenInput = document.querySelector("#token");
  const credentialsSetButton = document.querySelector(
    "#credentials-set-button"
  );

  const checkCreds = () => {
    credentialsSetButton.disabled =
      !mailInput.value || !tokenInput.value || !organizationInput.value;
    return !credentialsSetButton.disabled;
  };

  if (checkCreds()) {
    credentialsSetButton.textContent = "CHECK & UPDATE";
  }
  organizationInput.addEventListener("keyup", checkCreds);
  mailInput.addEventListener("keyup", checkCreds);
  tokenInput.addEventListener("keyup", checkCreds);

  credentialsSetButton.addEventListener("click", () => {
    vscode.postMessage({
      type: "set-configuration",
      credentials: {
        organization: organizationInput.value,
        mail: mailInput.value,
        patToken: tokenInput.value,
      },
    });
  });

  const updateDetailButton = document.querySelector("#update-detail-button");
  const projectInput = document.querySelector("#project");
  const areaInput = document.querySelector("#area");

  const checkUpdateDetail = () => {
    updateDetailButton.disabled = !projectInput.value || !areaInput.value;
    return !updateDetailButton.disabled;
  };

  projectInput.addEventListener("change", checkUpdateDetail);
  areaInput.addEventListener("change", checkUpdateDetail);

  updateDetailButton.addEventListener("click", () => {
    vscode.postMessage({
      type: "set-details",
      details: {
        projectId: projectInput.value,
        areaId: areaInput.value
      },
    });
  });
})();
