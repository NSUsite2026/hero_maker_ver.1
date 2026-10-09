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
        // 保存する5つのパーツ
        const parts = [
            document.getElementById("img001"), // ヘッド
            document.getElementById("img002"), // アーマー
            document.getElementById("img003"), // アンダー
            document.getElementById("img004"), // ライン
            document.getElementById("img005")  // バックアーマー
        ];

        // 画像の読み込みを待つ
        for (const img of parts) {
            if (!img.complete || img.naturalWidth === 0) {
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = () => reject(
                        new Error("画像を読み込めません: " + img.src)
                    );
                });
            }
        }

        // 透明背景のキャンバスを作成
        const canvas = document.createElement("canvas");
        canvas.width = 960;
        canvas.height = 960;

        const ctx = canvas.getContext("2d");

        // 各パーツを重なり順に描画
        const order = [
            "img005", // バックアーマー
            "img004", // ライン
            "img003", // アンダー
            "img002", // アーマー
            "img001"  // ヘッド
        ];

        const monitor = document.querySelector(".monitor");
        const monitorRect = monitor.getBoundingClientRect();

        for (const id of order) {
            const img = document.getElementById(id);
            const rect = img.getBoundingClientRect();

            const x = (rect.left - monitorRect.left)
                * canvas.width / monitorRect.width;
            const y = (rect.top - monitorRect.top)
                * canvas.height / monitorRect.height;
            const w = rect.width * canvas.width / monitorRect.width;
            const h = rect.height * canvas.height / monitorRect.height;

            ctx.drawImage(img, x, y, w, h);
        }

        // PNG形式で保存
        canvas.toBlob(blob => {
            if (!blob) {
                alert("PNG画像を作成できませんでした。");
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "my-hero.png";
            link.click();

            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, "image/png");

    } catch (error) {
        console.error("画像保存エラー:", error);
        alert("保存に失敗しました。コンソールのエラーを確認してください。");
    }
});
