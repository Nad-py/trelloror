/* notes:
extract data - > as we load page

save data 
*/

let currentBoardId = window.location.pathname.split("/")[2];
console.log(currentBoardId);

/* STORAGE CLEAR IF NEEDED
chrome.storage.local.clear(() => {
  if (chrome.runtime.lastError) {
    console.error("Error clearing storage:", chrome.runtime.lastError);
  } else {
    console.log("All data cleared from local storage.");
  }
});*/


function applyColors(boardId) {
  chrome.storage.local.get([boardId], (result) => {
    if (result[boardId]) {
      Object.entries(result[boardId]).forEach(([item, color]) => {
        console.log(result);
        console.log(item, color);
        let listToChange = document.querySelector(`[data-list-id="${item}"].tBRLg6uDC7sSyw`);
        if (listToChange){

          changeCardColor(listToChange, color);
        }
        /*
        fetch an object with data-list-id that = item
        if not found, delete it from database, log it and go to next item without crashing
        if found, applyColor(color stored in item)
        */
      });
    }
  });
}

function changeCardColor(card, color){
  let elementsToChange = [
    card.querySelector('.Sb_QqNKeadm2oq'),
    card.querySelector('.RD2CmKQFZKidd6'),
    card.querySelector('.Ddjfff57W7abTr'),
    card.querySelector('.bPNGI_VbtbXQ8v')
  ];
  
  elementsToChange.forEach((element) => {
    if (element) {
      element.style.backgroundColor = color; 
    }
  });
  console.log("Elements inside the card changed to color:", color);
}



const observer = new MutationObserver(() => {
  let newBoardId = window.location.pathname.split("/")[2];
  if (newBoardId !== currentBoardId) {
    currentBoardId = newBoardId;
    console.log("Board changed to:", currentBoardId);
    setTimeout(() => applyColors(currentBoardId), 1000);

  }
});

observer.observe(document.body, { childList: true, subtree: true });

setTimeout(() => applyColors(currentBoardId), 1000);







document.addEventListener("click", (event) => {
  chrome.storage.local.get(["changeStatus"], (statusResult) => {
    if(statusResult.changeStatus === "active"){

      const target = event.target;
      
      // Check if the click is inside the container with class tBRLg6uDC7sSyw
      const clickedCardContainer = target.closest('.tBRLg6uDC7sSyw');

      if (clickedCardContainer) {
        
        chrome.storage.local.get(["userColor"], (userColorResult) => {
          chrome.storage.local.get([currentBoardId], (getBoardResult) => {
            let boardData = getBoardResult[currentBoardId] || {};
            boardData[clickedCardContainer.dataset.listId] = userColorResult.userColor;
            
            chrome.storage.local.set({ [currentBoardId]: boardData }, () => {
              console.log("DB updated for", currentBoardId);
            }); 
            changeCardColor(clickedCardContainer, userColorResult.userColor);
            
            console.log("Elements inside the card changed to color:", userColorResult.userColor);
          });
        });
      }
    }
  });
});
