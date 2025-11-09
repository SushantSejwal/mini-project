(function () {

    try {
        // const themeMeta = document.querySelector('meta#theme-color');
        const rootStyle = getComputedStyle(document.documentElement);
        const primary = rootStyle.getPropertyValue('--color-pri').trim();
        // if (themeMeta && primary) themeMeta.setAttribute('content', primary);
    } catch { }

    const nav = document.getElementById('nav-bar');
    if (nav) {
        nav.addEventListener('click', (e) => {
            const li = e.target.closest('.nav-item');
            if (!li) return;
            nav.querySelectorAll('.nav-item i').forEach(i => i.style.color = '');
            const icon = li.querySelector('i');
            if (icon) icon.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-pri');
        });
    }

    const seeBtn = document.getElementById('see-prices');
    if (seeBtn) {
        seeBtn.addEventListener('click', () => {
            const pick = document.getElementById('pick-input')?.value?.trim();
            const drop = document.getElementById('drop-input')?.value?.trim();
            const date = document.getElementById('ride-date')?.value;
            const time = document.getElementById('ride-time')?.value;
            const payload = { pick, drop, date, time };
            document.dispatchEvent(new CustomEvent('cabme:see-prices', { detail: payload }));
        });
    }

    







    const homeBtn = document.getElementById('home-btn');

    const favoritesBtn = document.getElementById('favorites-btn');
    const favoritesOverlay = document.getElementById('favorites-overlay');
    // const favoritesCloseBtn = document.getElementById('favorites-close');

    const historyBtn = document.getElementById('history-btn');
    const historyOverlay = document.getElementById('history-overlay');
    // const historyCloseBtn = document.getElementById('history-close');

    const userBtn = document.getElementById('user-btn');
    const userOverlay = document.getElementById('user-overlay');
    // const userCloseBtn = document.getElementById('user-close');
    const logoutBtn = document.getElementById('logout-btn');


    // FUNCTION for fav Overlays
    const openFavorites = () => {
        favoritesOverlay.classList.add('active');
        favoritesOverlay.classList.remove('hidden');
        favoritesOverlay.setAttribute('aria-hidden', 'false');
    };
    const closeFavorites = () => {
        favoritesOverlay.classList.remove('active');
        favoritesOverlay.setAttribute('aria-hidden', 'true');
    };
    
    // FUNCTION for history Overlays
    const openHistory = () => {
        historyOverlay.classList.add('active');
        historyOverlay.classList.remove('hidden');
        historyOverlay.setAttribute('aria-hidden', 'false');
    };
    const closeHistory = () => {
        historyOverlay.classList.remove('active');
        historyOverlay.setAttribute('aria-hidden', 'true');
    };

    // FUNCTION for profile Overlays
    const openUser = () => {
        userOverlay.classList.add('active');
        userOverlay.classList.remove('hidden');
        userOverlay.setAttribute('aria-hidden', 'false');
    };
    
    const closeUser = () => {
        userOverlay.classList.remove('active');
        userOverlay.setAttribute('aria-hidden', 'true');
    };
    
    
    logoutBtn.addEventListener('click', () => {
        alert('You have been logged out.');
        closeUser(); // Also close the overlay after logging out
    });
    
    favoritesBtn.addEventListener('click', () => {
        openFavorites();
        closeHistory();
        closeUser();
    });
    
    historyBtn.addEventListener('click', () => {
        openHistory();
        closeFavorites();
        closeUser();
    });
    
    userBtn.addEventListener('click', () => {
        openUser();
        closeHistory();
        closeFavorites();
    });

    homeBtn.addEventListener('click', () => {
        closeHistory();
        closeFavorites();
        closeUser();
    });
    
})();



// favoritesCloseBtn.addEventListener('click', closeFavorites);
// historyCloseBtn.addEventListener('click', closeHistory);
// userCloseBtn.addEventListener('click', closeUser);