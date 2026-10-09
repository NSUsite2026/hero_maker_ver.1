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





document.getElementById("saveHero").addEventListener("click", async () => {
    try {
        const monitor = document.querySelector(".monitor");
        const rect = monitor.getBoundingClientRect();

        // 保存画像のサイズ
        const canvas = document.createElement("canvas");
        canvas.width = 960;
        canvas.height = Math.round(960 * rect.height / rect.width);

        const ctx = canvas.getContext("2d");


        // 画像の読み込みを確認
        const layers = [document.getElementById("img001"), // ヘッド
                        document.getElementById("img002"), // アーマー
                        document.getElementById("img003"), // アンダー
                        document.getElementById("img004"), // ライン
                        document.getElementById("img005")  // バックアーマー];

        await Promise.all(layers.map(img => {
            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(
                    new Error("画像の読み込みに失敗しました: " + img.src)
                );
            });
        }));

        // CSSのz-indexが小さい順に描画
        layers.sort((a, b) => {
            const za = Number(getComputedStyle(a.parentElement).zIndex) || 0;
            const zb = Number(getComputedStyle(b.parentElement).zIndex) || 0;
            return za - zb;
        });

        // 各パーツをモニター上の位置に合わせて描画
        for (const img of layers) {
            const r = img.getBoundingClientRect();

            const x = (r.left - rect.left) * canvas.width / rect.width;
            const y = (r.top - rect.top) * canvas.height / rect.height;
            const w = r.width * canvas.width / rect.width;
            const h = r.height * canvas.height / rect.height;

            ctx.drawImage(img, x, y, w, h);
        }

        // PNG画像として保存
        canvas.toBlob(blob => {
            if (!blob) {
                alert("画像を作成できませんでした。");
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "my-hero.png";
            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, "image/png");

    } catch (error) {
        console.error("画像保存エラー:", error);
        alert("画像を保存できませんでした。ブラウザのコンソールでエラーを確認してください。");
    }
});
