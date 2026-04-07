document.addEventListener('DOMContentLoaded', () => {
    // 預設產生的雷點項目 (依照需求刪除與新增)
    const items = [
        "莫名優越感", "玻璃心", "雙標仔", "強迫推坑", "愛喊老公老婆",
        "模仿動漫腔", "穿痛衣招搖", "瘋狂戰CP", "惡意刷負評",
        "鄙視新粉", "過激打藝", "AI圖", "爆雷仔", "嚼嚼嚼", "愛玩內梗"
    ];

    const bank = document.getElementById('item-bank');
    const dropzones = document.querySelectorAll('.tier-dropzone');

    // 將 20 個雷點渲染進項目池
    items.forEach((itemText, index) => {
        const div = document.createElement('div');
        div.classList.add('draggable-item');
        div.textContent = itemText;
        div.id = `item-${index}`;
        bank.appendChild(div);
    });

    // 實例化 SortableJS - 同一 group 即可互相拖曳
    dropzones.forEach(zone => {
        new Sortable(zone, {
            group: 'shared',
            animation: 150,
            ghostClass: 'sortable-ghost',
            delay: 0, // 在桌機不需長按
            delayOnTouchOnly: true, // 手機防止誤觸滑動，啟用0.5秒長按拖曳
            touchStartThreshold: 3 // 手勢容忍度
        });
    });

    // 重置按鈕
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (confirm("確定要清除所有的雷點分級重新開始嗎？")) {
            const draggables = document.querySelectorAll('.draggable-item');
            draggables.forEach(item => {
                bank.appendChild(item);
            });
        }
    });

    // 產出圖檔按鈕：使用 dom-to-image-more，對 file:// 協定更友善
    document.getElementById('btn-export').addEventListener('click', () => {
        const exportBtn = document.getElementById('btn-export');
        const originalText = exportBtn.textContent;
        exportBtn.textContent = '產生中...';
        exportBtn.disabled = true;

        const captureArea = document.getElementById('capture-area');
        const bankSection = document.querySelector('.item-bank-section');
        bankSection.style.display = 'none';
        const scale = window.devicePixelRatio || 2;

        domtoimage.toPng(captureArea, {
            bgcolor: '#ffffff',
            width: captureArea.offsetWidth * scale,
            height: captureArea.offsetHeight * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: captureArea.offsetWidth + 'px',
                height: captureArea.offsetHeight + 'px'
            }
        }).then(async dataUrl => {
            // 手機：使用 Web Share API 儲存到照片庫
            if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
                try {
                    const res = await fetch(dataUrl);
                    const blob = await res.blob();
                    const file = new File([blob], 'nonolist.png', { type: 'image/png' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: '我的動漫圈雷點分級表'
                        });
                    } else {
                        // 降級：直接下載
                        const link = document.createElement('a');
                        link.download = 'nonolist.png';
                        link.href = dataUrl;
                        link.click();
                    }
                } catch (shareErr) {
                    if (shareErr.name !== 'AbortError') {
                        console.error('分享失敗:', shareErr);
                    }
                }
            } else {
                // 桌機：一般下載
                const link = document.createElement('a');
                link.download = 'nonolist.png';
                link.href = dataUrl;
                link.click();
            }
            bankSection.style.display = '';
            exportBtn.textContent = originalText;
            exportBtn.disabled = false;
        }).catch(err => {
            console.error('匯出失敗:', err);
            alert('產生圖片時發生錯誤，請稍後再試！');
            bankSection.style.display = '';
            exportBtn.textContent = originalText;
            exportBtn.disabled = false;
        });
    });
});
