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










function loadCanvasImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = () => {
            reject(new Error("画像の読み込みに失敗しました: " + src));
        };

        // srcを設定する前に指定する
        img.crossOrigin = "anonymous";
        img.src = src;
    });
}



document.getElementById("downloadBtn").addEventListener("click", async () => {
    const ids = ["img001", "img002", "img003", "img004", "img005"];

    try {
        // HTMLから画像要素を取得
        const elements = ids.map(id => document.getElementById(id));

        // Canvas用に画像を読み込み直す
        const images = await Promise.all(
            elements.map(el => {
                if (!el) {
                    throw new Error("画像要素が見つかりません");
                }

                return loadCanvasImage(el.src);
            })
        );

        // Canvasで書き出せるように設定
        images.forEach(img => {
            img.crossOrigin = "anonymous";
        });

        // 画像の読み込みを確認
        for (const img of images) {
            if (!img) {
                throw new Error("画像要素が見つかりません。");
            }

            if (!img.complete || img.naturalWidth === 0) {
                throw new Error(
                    img.id + " の画像が読み込まれていません。"
                );
            }
        }

        // ヘッド画像を基準にCanvasを作成
        const width = images[0].naturalWidth;
        const height = images[0].naturalHeight;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvasを作成できませんでした。");
        }

        // 背面から順番に重ねる
        // img005: バックアーマー
        // img004: アンダー
        // img003: ライン
        // img002: アーマー
        // img001: ヘッド
        [images[4], images[3], images[2], images[1], images[0]]
            .forEach(img => {
                ctx.drawImage(img, 0, 0, width, height);
            });

        // PNG画像を生成
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, "image/png");
        });

        if (!blob) {
            throw new Error("PNG画像を生成できませんでした。");
        }

        // ダウンロード
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "my-hero.png";
        document.body.appendChild(link);
        link.click();
        link.remove();

        // ダウンロード開始後にURLを解放
        setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (error) {
        console.error("ダウンロードエラー:", error);
        alert("ダウンロードに失敗しました。\n" + error.message);
    }
});
