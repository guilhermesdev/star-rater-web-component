class StarRater extends HTMLElement {
	constructor(){
		super();

		this.starIcon = `<?xml version="1.0" standalone="no"?>
		<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
		 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
		<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="32" height="32"  viewBox="0 0 512 512">	
		<g transform="translate(0,512) scale(0.1,-0.1)" stroke="none">
		<path d="M2457 4995 c-110 -42 -181 -127 -211 -252 -7 -32 -109 -354 -227 -716 l-213 -657 -784 0 -783 1 -53 -24 c-114 -52 -181 -159 -181 -287 0 -41 6 -91 14 -110 26 -65 86 -134 142 -165 86 -46 1181 -846 1176 -859 -45 -117 -447 -1387 -453 -1426 -16 -124 4 -204 70 -277 65 -72 123 -98 221 -98 72 0 86 3 140 33 33 18 326 226 650 462 325 236 593 429 597 427 4 -1 273 -195 598 -431 325 -236 606 -438 623 -448 70 -40 105 -52 172 -56 64 -3 76 -1 135 30 74 38 131 104 151 177 30 104 26 118 -222 882 -127 393 -234 719 -236 725 -2 6 265 207 594 447 329 239 619 456 645 482 70 70 93 124 93 215 0 90 -24 149 -82 207 -49 49 -98 72 -176 84 -34 5 -395 9 -802 9 l-741 0 -213 658 c-118 361 -220 683 -227 715 -27 112 -88 193 -182 239 -58 28 -177 35 -235 13z"/>
		</g></svg>`;

		this.build();
	}

	build(){
		const shadow = this.attachShadow({ mode: 'open' });

		shadow.appendChild(this.styles());
		const rater = this.createRater();
		this.stars = this.createStars();
		this.stars.forEach(star => rater.appendChild(star));

		this.resetRating();

		shadow.appendChild(rater);
	}

	createRater(){
		const rater = document.createElement('div');
		rater.classList.add('star-rater');
		rater.addEventListener('mouseout', this.resetRating.bind(this));

		return rater;
	}
	
	createStars(){
		const createStar = (_, index) => {
			const star = document.createElement('span');
			star.classList.add('star');

			const dataValue = Number(index) + 1;
			const label = dataValue + ' ' + (dataValue > 1 ? 'stars' : 'star');

			star.setAttribute('data-value', dataValue);
			star.setAttribute('title', label);
			star.setAttribute('aria-label', label);

			star.innerHTML = this.starIcon;

			star.addEventListener('click', this.setRating.bind(this));
			star.addEventListener('mouseover', this.setRatingHover.bind(this));

			return star;
		};

		return Array.from({ length: 5 }, createStar);
	}

	setRating({ currentTarget }){
		const rating = currentTarget.getAttribute('data-value');
		this.setAttribute('data-rating', rating);
	}

	resetRating(){
		this.currentRatingValue = this.getAttribute('data-rating') || 0;
		this.highlightRating();
	}

	setRatingHover({ currentTarget }){
		this.currentRatingValue = currentTarget.getAttribute('data-value');
		this.highlightRating();
	}

	highlightRating(){
		this.stars.forEach(star => {
			star.style.fill =
				this.currentRatingValue >= star.getAttribute('data-value')
					? 'var(--color-star)'
					: 'var(--color-bg)';
		})
	}
	
	styles(){
		const style = document.createElement('style');
		style.textContent = `
			.star-rater {
				background-color: var(--color-rater-bg);
				padding: 15px;
				border-radius: 50px;
				
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
			}
			
			.star {
				transition: 70ms;
				cursor: pointer;
			}`;

		return style;
	}
}

customElements.define('star-rater', StarRater);