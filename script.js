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
