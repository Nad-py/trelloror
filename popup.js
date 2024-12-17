document.addEventListener("DOMContentLoaded", () => {
  const defaultColor = "#f1f2f4";

  const colorPicker = document.getElementById("color-picker");
  const colorModeBtn = document.getElementById("color-mode-btn");
  const resetBtn = document.getElementById("reset-btn");
  
  chrome.storage.local.get(["changeStatus"], (result) => {
    colorModeBtn.textContent = result.changeStatus;
  });

  chrome.storage.local.get(["userColor"], (result) => {
    colorPicker.value = result.userColor;
  });

  // Listen for color picker input
  colorPicker.addEventListener("input", (event) => {
    chrome.storage.local.get(["userColor"], (result) => {
      colorPicker.value = result.userColor;
    });
    chrome.storage.local.set({userColor : event.target.value }, () => {
      console.log("User selected color:", event.target.value);
    });
    
  }); 


  resetBtn.addEventListener("click", () => {
    chrome.storage.local.set({userColor : defaultColor }, () => {
      colorPicker.value = defaultColor;
      console.log("Reset to default color.");
    });
  });

  colorModeBtn.addEventListener("click", () => {
    chrome.storage.local.get(["changeStatus"], (result) => {
      let currentStatus = result.changeStatus || "inactive"; 
      let newStatus = currentStatus === "active" ? "inactive" : "active"; // Toggle status
      chrome.storage.local.set({changeStatus : newStatus}, () => {
        colorModeBtn.textContent = newStatus;
      });
    });
  });

});
