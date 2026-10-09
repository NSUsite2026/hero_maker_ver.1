function changeH(imagePath) {
    const image = document.getElementById("img001");
    image.src = imagePath;
}


function changeA(armorPath, backArmorPath) {
    // アーマー画像を変更
    document.getElementById("img002").src = armorPath;

    // バックアーマー画像を変更
    document.getElementById("img005").src = backArmorPath;
}

function changeU(imagePath) {
    const image = document.getElementById("img003");
    image.src = imagePath;
}

function changeL(imagePath) {
    const image = document.getElementById("img004");
    image.src = imagePath;
}

const tabs = document.querySelectorAll(".tab");
const parts = document.querySelectorAll(".parts");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // タブの色切り替え
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // ボタングループ切り替え
        parts.forEach(p => p.classList.remove("active"));

        document
            .getElementById(tab.dataset.target)
            .classList.add("active");
    });
});


