const apiURL = "https://api.lyrics.ovh";
const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!searchTerm) {
    alert("検索する内容を入力してください");
  } else {
    searchSongs(searchTerm);
  }
});

async function searchSongs(term) {
  try {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    showData(data);
  } catch (error) {
    console.log(error);
  }
}

function showData({ data, prev, next }) {
  result.innerHTML = `
  <ul class="songs">
    ${data
      .map(
        (song) => `
    <li>
      <span>
        <strong>${song.artist.name}</strong> - ${song.title}
      </span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">歌詞を取得</button>
    </li>
    `
      )
      .join("")}
  </ul>
  `;

  if (prev || next) {
    more.innerHTML = `
    ${prev ? `<button class="btn" onclick="getMoreSongs('${prev}')">戻る</button>` : ""}
    ${next ? `<button class="btn" onclick="getMoreSongs('${next}')">進む</button>` : ""}
    `;
  } else {
    more.innerHTML = "";
  }
}

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showData(data);
}

result.addEventListener("click", (e) => {
  const clickedEl = e.target;

  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist").replace(/ /gi, "");
    const songTitle = clickedEl.getAttribute("data-songtitle").replace(/ /gi, "");
    getLyrics(artist, songTitle);
  }
});

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  let { lyrics } = await res.json();

  lyrics = lyrics.replace(/(\r\n|\n|\r)/gi, "<br>");

  result.innerHTML = `
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
  `;

  more.innerHTML = "";
}
