/**
 * Menu navigation handler
 * Sets up event listeners for game mode selection buttons
 */
document.addEventListener('DOMContentLoaded', () => {
    const pvpBtn = document.getElementById('pvpBtn');
    const pvcBtn = document.getElementById('pvcBtn');

    if (pvpBtn) {
        pvpBtn.addEventListener('click', () => {
            window.location.href = 'game.html?mode=pvp';
        });
    }

    if (pvcBtn) {
        pvcBtn.addEventListener('click', () => {
            window.location.href = 'game.html?mode=pvc';
        });
    }
});

