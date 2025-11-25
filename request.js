let form = document.querySelector("#requestForm")
let message = document.querySelector("#message")
let requestList = document.querySelector("#requestList")

const apiUrl = "https://dummyjson.com/posts";
const storageKey = "requests";

// -LOCAL STORAGE-

//Hämtar sparade requests från localstorage
function loadLocalRequests() {
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : [];
}
// Sparar requests i localstorage
function saveLocalRequests(requests) {
  localStorage.setItem(storageKey, JSON.stringify(requests));
}

// -FUNKTION FÖR LISTAN-

//Visar alla requests
function renderRequests(requests) {
  requestList.innerHTML = "";
  requests.forEach((req) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${req.title}</strong> — by ${req.user}`;
//Delete knappen
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteRequest(req.id));
    li.appendChild(delBtn);
    requestList.appendChild(li);
  });
}

// -FUNKTION FÖR ATT LADDA IN DATA (GET)-

async function loadRequests() {
  const local = loadLocalRequests();
//Om det redan finns data sparad lokalt
  if (local.length > 0) {
    renderRequests(local);
    console.log("Loaded correctly from localStorage");
    return;
  }
  //Annars hämta data från API:et
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
//10 senaste inläggen
    const requests = data.posts.slice(0, 10).map((post) => ({
      id: post.id,
      title: post.title,
      user: "User " + post.userId,
    }));
//Sparar inläggen från API:et i localStorage första gången
    saveLocalRequests(requests);
    renderRequests(requests);
    console.log("Loaded from API"); //Om det inte finns något redan i localStorage
  } catch {
    message.textContent = "Failed to load data from API and there's nothing saved in the localStorage";
  }
}

// -FORMULÄR- (POST)

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const request = document.querySelector("#request").value.trim();

  if (!name || !request) return;
//Ny request
  const newRequest = {
    id: Date.now(), //Skapar ett unikt ID för inlägget i localStorage
    title: request,
    user: name,
  };
//Försök att skicka till API:et
  try {
    await fetch(apiUrl + "/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: request,
        body: `Requested by ${name}`,
        userId: Math.floor(Math.random() * 100), //Genererar ett slumpat ID för användaren, för API:et
      }),
    });

    message.textContent = `Thank you, ${name}! Your request "${request}" was added.`;
  } catch {
    message.textContent = "API unreachable the request was saved locally.";
  }

  //Sparar i localStorage oavsett om API:et funkar
  const current = loadLocalRequests();
  current.unshift(newRequest); //Lägger till det senaste inlägget överst på listan
  saveLocalRequests(current);
  renderRequests(current);

  form.reset();
});

// -FUNKTION FÖR ATT TA BORT REQUESTS (DELETE)-

function deleteRequest(id) {
  const updated = loadLocalRequests().filter((req) => req.id !== id);
  saveLocalRequests(updated);
  renderRequests(updated);
  message.textContent = `Deleted request #${id}`;
}

//Laddar in allt vid sidstart
loadRequests();


//Katrinas Kod

/* Källor:
Uppgifter i Avancera
MDN
GeekforGeeks
Gamla Stack Overflow inlägg
OpenJavaScript på Youtube
Net Ninja på Youtube
ChatGPT för ytterligare förklaring */
