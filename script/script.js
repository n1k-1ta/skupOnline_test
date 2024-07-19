document.addEventListener('DOMContentLoaded', function() {
    const productSelect = document.getElementById('product');
    const specificTypeContainer = document.getElementById('specificTypeContainer');

    productSelect.addEventListener('change', function() {
        if (productSelect.value === 'appliance') {
            specificTypeContainer.style.display = 'block';
        } else {
            specificTypeContainer.style.display = 'none';
        }
    });

    const animatingText = document.querySelectorAll('.animating-text span');
    let currentIndex = 0;

    function showText(index) {
        animatingText[index].classList.add('show');
    }

    function cycleText() {
        if (currentIndex < animatingText.length) {
            showText(currentIndex);
            currentIndex++;
            setTimeout(cycleText, 500);
        }
    }

    cycleText();

    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');

    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});






