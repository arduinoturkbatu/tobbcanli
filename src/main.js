import './style.css'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDVakE0ezK2bpxF_T87oz5VRw2vOlQICN8",
    authDomain: "fototobb-bfe51.firebaseapp.com",
    databaseURL: "https://fototobb-bfe51-default-rtdb.firebaseio.com",
    projectId: "fototobb-bfe51",
    storageBucket: "fototobb-bfe51.firebasestorage.app",
    messagingSenderId: "838056253447",
    appId: "1:838056253447:web:24b4ccd62a85ec618cf2a2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const roomsRef = ref(db, "rooms");

const path = window.location.pathname;
const params = new URLSearchParams(window.location.search);

const data = params.get("data");


if (path === "/view") {
    
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');

    if (data) {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://fototobb.onrender.com/' + data;
        iframe.frameBorder = '0';
        iframe.setAttribute("style","width:100%; height: 100%; border:none;");

        document.getElementById("app").appendChild(iframe);
    } else {
        console.log('No data parameter found in URL');
    }
}

let deferredPrompt;

function renderAppContent() {

    document.querySelector('#app').innerHTML = `
    <h1>TOBBFEN Canlı 🔴</h1>
    <h3>Aktif Yayın</h3>
    <p id="yayin">Aktif yayın bulunmamaktadır.</p>
    <button id="refresh">Yenile</button>
  `;
    
    let liveStatus = document.querySelector("#yayin");
    onValue(roomsRef, (snapshot) => {

        if (!snapshot.exists()) {
            liveStatus.innerHTML = "Aktif yayın bulunmamaktadır.";
            return;
        }

        const rooms = snapshot.val();

        const firstRoomKey = Object.keys(rooms)[0];

        const roomData = rooms[firstRoomKey];

        const title = roomData.name;

        const liveLink = `/view?data=${firstRoomKey}`;

        liveStatus.innerHTML = `
    <strong>${title}</strong><br>
    <a href="${liveLink}">
      Yayına Katıl
    </a>
  `;

    });

}

function renderInstallScreen() {

    document.querySelector('#app').innerHTML = `
    <h1>TOBBFEN Canlı 🔴</h1>

    <p>
      Kullanmaya başlamak için uygulamayı yükleyiniz.
    </p>

    <button id="installBtn">
      Uygulamayı Yükle
    </button>
  `;

    document
        .getElementById('installBtn')
        .addEventListener('click', async () => {

            if (!deferredPrompt) return;

            deferredPrompt.prompt();

            await deferredPrompt.userChoice;

            deferredPrompt = null;

        });

}

const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone;

if (isStandalone) {

    renderAppContent();

} else {

    renderInstallScreen();

}

window.addEventListener('beforeinstallprompt', (e) => {

    e.preventDefault();

    deferredPrompt = e;

});