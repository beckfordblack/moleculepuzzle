async function handleScoreSubmission() {
    if (isSubmitting) return;
    const name = playerName.value.trim();
    if (!name) {
        submitStatus.textContent = "名前を入力してください";
        return;
    }
    isSubmitting = true;
    submitStatus.textContent = "登録中...";
    await submitScore(name);
    await loadRanking();
};
