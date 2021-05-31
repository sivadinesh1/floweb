import './styles/global.scss';
import './styles/style.scss';

import './styles/main.css';
import { gsap } from 'gsap';

import './glider.min';
import './styles/glider.min.css';

import './nav.html';
import './about.html';

if (module.hot) {
	module.hot.accept();
}

function myFunction() {
	var x = document.getElementById('mobile-menu');
	if (x.style.display === 'none') {
		x.style.display = 'block';
	} else {
		x.style.display = 'none';
	}
}

function toggleMenu() {
	alert('toggleMenu..');
	var x = document.getElementById('md-menu');
	alert('toggleMenu.test.' + x.style.display);

	if (x.style.display === 'none' || x.style.display === '') {
		x.style.display = 'block';
	} else {
		x.style.display = 'none';
	}
}

window.myFunction = myFunction;
window.toggleMenu = toggleMenu;

var tl = gsap.timeline({
	defaults: { duration: 0.7, opacity: 0 },
});

tl.from('.main-content', { opacity: 1, y: 40, stagger: 0.3 });

// video

window.addEventListener('load', function () {
	new Glider(document.querySelector('.glider'), {
		slidesToShow: 1,
		dots: '#dots',
		draggable: true,
		arrows: {
			prev: '.glider-prev',
			next: '.glider-next',
		},
	});
});

window.addEventListener('load', function () {
	new Glider(document.querySelector('.glider1'), {
		slidesToShow: 1,
		dots: '#dots',
		draggable: true,
		arrows: {
			prev: '.glider-prev',
			next: '.glider-next',
		},
	});
});
