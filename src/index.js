import './styles/style.scss';
import './styles/about.scss';
import './styles/freelancers.scss';
import './styles/herotabs.scss';
import './styles/upnav.scss';

import './glider.min';
import './styles/glider.min.css';

if (module.hot) {
	module.hot.accept();
}

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
