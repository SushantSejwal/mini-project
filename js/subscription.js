(function () {
    let getSubscriptionButton = document.getElementById('get-subscription');
    let subscriptionOverlay = document.getElementById('subscription-overlay');
    let subscriptionOverlayButton = document.getElementById('sub-close');

    getSubscriptionButton.addEventListener('click', () => {
        subscriptionOverlay.classList.add('shown');
    })

    subscriptionOverlayButton.addEventListener('click', () => {
        subscriptionOverlay.classList.remove('shown');
    })
})();