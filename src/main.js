import './style.css'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, onValue } from "firebase/database";
import icon from '../public/icons/icon-192.png';
import image1 from '../public/ss1.jpg';
import image2 from '../public/ss2.jpg';

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

let deferredPrompt;

function renderAppContent() {

    document.querySelector('#app').innerHTML = `
    <div class="appbar">
        <div class="decoration"></div>
        <img src="${icon}" alt="TOBBFEN Canlı" class="logo-icon">
        <span class="logo">TOBBFEN Canlı</span>
    </div>

    <div class="content">
        <h3>
            <span class="dot"></span> &nbsp;
            Aktif Yayın
        </h3>
        <p id="yayin">Aktif yayın bulunmamaktadır.</p>
        <button class="btn-secondary" id="refresh" onclick="location.reload()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-reload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" /><path d="M20 4v5h-5" /></svg>
            Yenile
        </button>
    </div>
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
    <strong>${title}</strong>
    <a class="btn-primary" href="${liveLink}">
      Yayına Katıl
    </a>
  `;

    });

}

function renderInstallScreen() {

    document.querySelector('#app').innerHTML = `
    <div class="content">
        <p>Kullanmaya başlamak için uygulamayı yükleyiniz.</p>
        <button class="btn-primary" id="installBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-download"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>
            Uygulamayı Yükle
        </button>
    </div>

    <div class="info">
        Google Chrome tarayıcısından giriş yapmanız tavsiye edilir. Yukarıdaki butona bastıktan sonra indirilen uygulamayı açarak uygulamayı kullanabilirsiniz.
        <div class="options">
            <img src="${image1}" alt="ekran görünütüsü 1" />
            veya
            <img src="${image2}" alt="ekran görüntüsü 2" />
        </div>
    </div>
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

document.addEventListener('DOMContentLoaded', () => {
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
            iframe.setAttribute("style", "width:100%; height: 100%; border:none;");

            document.getElementById("app").innerHTML = "";
            document.getElementById("app").setAttribute("style", "width:100%; height: 100%; padding: 0;");
            document.getElementById("app").appendChild(iframe);
        } else {
            console.log('No data parameter found in URL');
        }
    }
});