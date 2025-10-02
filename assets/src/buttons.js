document.getElementById('startButton').addEventListener('click', () => {
    const countryButtons = document.querySelectorAll('.buttons');
    countryButtons.forEach(button => {
        button.classList.remove('hidden');
        document.getElementById('startButton').classList.add('hidden');
    });
});