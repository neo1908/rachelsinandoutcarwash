<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let bubbles: { id: number; left: number; size: number; duration: number; delay: number }[] = [];
	let selectedService: string | null = null;
	let showBookingMessage = false;

	// Dark mode / Night Wash Mode
	let nightWashMode = false;

	// Konami code state
	const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
	let konamiIndex = 0;
	let konamiActivated = false;
	let showKonamiMessage = false;

	// Achievement badges
	let achievements: string[] = [];
	let showAchievement = false;
	let currentAchievement = '';

	// Reviews carousel
	let currentReviewIndex = 0;
	const reviews = [
		{ name: "Clean McShiny", rating: 5, text: "Rachel cleaned my car so well, it filed for a name change to 'Sparkles'!" },
		{ name: "Dusty McDirtface", rating: 5, text: "I came in dirty. I left enlightened. Rachel changed my life." },
		{ name: "A Very Real Person", rating: 5, text: "Suspiciously soft service. I'm not entirely convinced Rachel isn't a cloud." },
		{ name: "Sir Spots-A-Lot", rating: 5, text: "My dalmatian thought my car was a new friend. That's how spotless it was." },
		{ name: "Muddy Waters", rating: 5, text: "I drove through a swamp on the way here. Rachel didn't even flinch." },
		{ name: "Definitely Not Rachel's Mum", rating: 5, text: "The best car wash in the world! Completely unbiased review." }
	];

	// Booking form
	let showBookingForm = false;
	let bookingName = '';
	let bookingEmail = '';
	let bookingSubmitted = false;
	let rachelExcuse = '';
	const rachelExcuses = [
		"Rachel is currently apologizing to a mop for leaning it against the wall too hard.",
		"Rachel is too busy being soft right now. Please try again when she's slightly less soft.",
		"Rachel is practicing her squeegee technique in the mirror.",
		"Rachel is writing a formal apology letter to a bucket she accidentally kicked.",
		"Rachel is having a deep conversation with a sponge about the meaning of clean.",
		"Rachel is measuring her softness levels. The meter broke again.",
		"Rachel is teaching a masterclass on 'How to Wipe Gently 101'.",
		"Rachel is currently hugging a microfiber cloth. It's a whole thing.",
		"Rachel is negotiating with a stubborn stain. Diplomacy takes time.",
		"Rachel is on a spiritual retreat with some soap bubbles. Very cleansing."
	];

	// Softness calculator
	let showSoftnessCalc = false;
	let dirtLevel = 50;
	let softnessResult = '';

	// Softness meter
	let softnessMeterValue = 0;
	let meterBroken = false;

	// FAQ
	const faqs = [
		{ q: "Is Rachel really that soft?", a: "Yes. Medically verified. We have the certificate framed in the office." },
		{ q: "Do you accept tips?", a: "Only compliments. Rachel feeds on positive affirmations." },
		{ q: "What if it rains after my wash?", a: "Rachel will personally apologize to the sky on your behalf." },
		{ q: "Can Rachel clean my soul?", a: "That's technically outside our service area, but she's willing to try." },
		{ q: "Why is Rachel so soft?", a: "Scientists are still investigating. Leading theory: born in a cloud factory." },
		{ q: "Is this a real car wash?", a: "As real as Rachel's commitment to softness. Make of that what you will." }
	];
	let openFaqIndex: number | null = null;

	// Seasonal special (changes based on current month)
	function getSeasonalSpecial() {
		const month = new Date().getMonth();
		const specials = [
			{ name: "New Year New Shine", price: "£20", description: "Start the year sparkling! Includes complimentary 'new car smell' spray.", icon: "🎆" },
			{ name: "Valentine's Lover's Lane Wash", price: "£30", description: "Bring your car (or your date's car) for a romantic wash. Includes rose-scented freshener.", icon: "💕" },
			{ name: "Spring Clean Supreme", price: "£25", description: "Shake off the winter grime with our deep clean special!", icon: "🌷" },
			{ name: "April Showers Power Wash", price: "£18", description: "More water? No problem. We're used to it.", icon: "🌧️" },
			{ name: "May Day Sparkle", price: "£22", description: "Celebrate spring with a car that shines like sunshine!", icon: "🌸" },
			{ name: "Summer Sizzle Wash", price: "£25", description: "Beat the heat with our cooling wash. Ice lolly for you while you wait!", icon: "☀️" },
			{ name: "Summer Sizzle Wash", price: "£25", description: "Beach sand removal specialist. We've seen things.", icon: "🏖️" },
			{ name: "Back to School Buff", price: "£20", description: "Get the school run car looking presentable again!", icon: "📚" },
			{ name: "Autumn Leaf Relief", price: "£22", description: "Leaves in places you didn't know existed? We'll find them.", icon: "🍂" },
			{ name: "Halloween Spooky Sparkle", price: "£25", description: "So clean it's scary! Cobweb removal included.", icon: "🎃" },
			{ name: "Winter Warmer Wash", price: "£28", description: "Hot chocolate for you, warm wash for your car. Toasty!", icon: "❄️" },
			{ name: "Christmas Miracle Clean", price: "£30", description: "Your car will shine brighter than Rudolph's nose!", icon: "🎄" }
		];
		return specials[month];
	}

	const seasonalSpecial = getSeasonalSpecial();

	onMount(() => {
		// Generate floating bubbles
		bubbles = Array.from({ length: 20 }, (_, i) => ({
			id: i,
			left: Math.random() * 100,
			size: Math.random() * 40 + 20,
			duration: Math.random() * 10 + 10,
			delay: Math.random() * 10
		}));

		// Auto-rotate reviews
		const reviewInterval = setInterval(() => {
			currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
		}, 5000);

		// Animate softness meter
		const meterInterval = setInterval(() => {
			if (softnessMeterValue < 100) {
				softnessMeterValue += 2;
			} else if (!meterBroken) {
				meterBroken = true;
			}
		}, 50);

		// Check for scroll achievement
		const handleScroll = () => {
			const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
			if (scrollPercent > 0.95 && !achievements.includes('scroll')) {
				unlockAchievement('scroll', '🫧 Bubble Enthusiast - You scrolled to the bottom!');
			}
		};

		if (browser) {
			window.addEventListener('scroll', handleScroll);
			window.addEventListener('keydown', handleKonami);
		}

		return () => {
			clearInterval(reviewInterval);
			clearInterval(meterInterval);
			if (browser) {
				window.removeEventListener('scroll', handleScroll);
				window.removeEventListener('keydown', handleKonami);
			}
		};
	});

	function handleKonami(e: KeyboardEvent) {
		if (e.key === konamiCode[konamiIndex]) {
			konamiIndex++;
			if (konamiIndex === konamiCode.length) {
				activateKonami();
				konamiIndex = 0;
			}
		} else {
			konamiIndex = 0;
		}
	}

	function activateKonami() {
		konamiActivated = true;
		showKonamiMessage = true;

		// Explosion of bubbles
		const extraBubbles = Array.from({ length: 50 }, (_, i) => ({
			id: bubbles.length + i,
			left: Math.random() * 100,
			size: Math.random() * 60 + 30,
			duration: Math.random() * 5 + 3,
			delay: 0
		}));
		bubbles = [...bubbles, ...extraBubbles];

		setTimeout(() => {
			showKonamiMessage = false;
		}, 5000);

		if (!achievements.includes('konami')) {
			unlockAchievement('konami', '🎮 Code Master - You found the secret!');
		}
	}

	function unlockAchievement(id: string, text: string) {
		if (!achievements.includes(id)) {
			achievements = [...achievements, id];
			currentAchievement = text;
			showAchievement = true;
			setTimeout(() => {
				showAchievement = false;
			}, 4000);
		}
	}

	interface Service {
		name: string;
		price: string;
		description: string;
		pun: string;
		icon: string;
	}

	const carServices: Service[] = [
		{
			name: "The Quick Splash",
			price: "£8",
			description: "Exterior wash - in and out faster than you can say 'squeaky clean'!",
			pun: "We're wheely good at this!",
			icon: "🚗"
		},
		{
			name: "The Full Monty",
			price: "£15",
			description: "Interior + exterior wash with vacuum. Your car will feel like new (or at least newer).",
			pun: "We'll clean your ride until it shines bright like a diamond!",
			icon: "✨"
		},
		{
			name: "The VIP Treatment",
			price: "£25",
			description: "Premium wash, wax, interior deep clean, and air freshener. The works!",
			pun: "So fresh, so clean clean!",
			icon: "👑"
		}
	];

	const homeServices: Service[] = [
		{
			name: "Window Wonderland",
			price: "£30",
			description: "All windows inside and out. No streaks, no squeaks, just sparkle!",
			pun: "We see right through the competition!",
			icon: "🪟"
		},
		{
			name: "Laundry Love",
			price: "£20/load",
			description: "Wash, dry, and fold. We handle your dirty laundry so you don't have to!",
			pun: "We're loads of fun to work with!",
			icon: "🧺"
		},
		{
			name: "General Tidy-Up",
			price: "£40/hour",
			description: "Kitchen, bathroom, living areas - wherever chaos has struck!",
			pun: "Mess with us, we'll clean it up!",
			icon: "🧹"
		}
	];

	const teamMembers = [
		{ role: "Lead Scrubber", name: "Rachel", emoji: "🧽" },
		{ role: "Head of Softness", name: "Also Rachel", emoji: "☁️" },
		{ role: "Chief Bubble Officer", name: "Yep, Rachel", emoji: "🫧" },
		{ role: "Director of Shine", name: "Still Rachel", emoji: "✨" },
		{ role: "VP of Gentle Touch", name: "Surprise! Rachel", emoji: "🤲" },
		{ role: "CEO", name: "You guessed it... Rachel", emoji: "👑" }
	];

	function selectService(serviceName: string) {
		selectedService = serviceName;
		showBookingMessage = true;
		setTimeout(() => {
			showBookingMessage = false;
		}, 3000);

		if (!achievements.includes('service')) {
			unlockAchievement('service', '🛒 Savvy Shopper - You selected a service!');
		}
	}

	function toggleNightWashMode() {
		nightWashMode = !nightWashMode;
		if (!achievements.includes('nightmode')) {
			unlockAchievement('nightmode', '🌙 Night Owl - You activated Night Wash Mode!');
		}
	}

	function submitBooking() {
		rachelExcuse = rachelExcuses[Math.floor(Math.random() * rachelExcuses.length)];
		bookingSubmitted = true;

		if (!achievements.includes('booking')) {
			unlockAchievement('booking', '📝 Eager Beaver - You tried to book Rachel!');
		}
	}

	function resetBooking() {
		bookingSubmitted = false;
		bookingName = '';
		bookingEmail = '';
		rachelExcuse = '';
	}

	function calculateSoftness() {
		const apologyTime = Math.round(dirtLevel * 0.3);
		const softStrokes = Math.round(dirtLevel * 2.5);
		const compliments = Math.round(dirtLevel / 10) + 1;

		softnessResult = `Based on your dirt level of ${dirtLevel}%, Rachel will need to:
		• Apologize to your car for ${apologyTime} minutes first
		• Apply ${softStrokes} gentle strokes (extra soft)
		• Whisper ${compliments} compliment(s) to your paintwork
		• Estimated softness applied: Maximum (it's always maximum)`;

		if (!achievements.includes('calculator')) {
			unlockAchievement('calculator', '🔢 Math Whiz - You calculated your softness needs!');
		}
	}

	function toggleFaq(index: number) {
		openFaqIndex = openFaqIndex === index ? null : index;

		if (!achievements.includes('faq')) {
			unlockAchievement('faq', '❓ Curious Cat - You explored the FAQs!');
		}
	}

	let mouseX = 0;
	let mouseY = 0;

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}
</script>

<svelte:window on:mousemove={handleMouseMove} />

<div class="page" class:night-mode={nightWashMode}>
	<!-- Night Wash Mode Toggle -->
	<button class="night-mode-toggle" on:click={toggleNightWashMode} title="Toggle Night Wash Mode">
		{nightWashMode ? '☀️' : '🌙'}
	</button>

	<!-- Floating Bubbles Background -->
	<div class="bubbles-container">
		{#each bubbles as bubble}
			<div
				class="bubble"
				class:glowing={nightWashMode}
				style="
					left: {bubble.left}%;
					width: {bubble.size}px;
					height: {bubble.size}px;
					animation-duration: {bubble.duration}s;
					animation-delay: {bubble.delay}s;
				"
			></div>
		{/each}
	</div>

	<!-- Konami Code Message -->
	{#if showKonamiMessage}
		<div class="konami-message">
			<h2>🎉 SECRET UNLOCKED! 🎉</h2>
			<p>Rachel's hidden message:</p>
			<p class="secret-text">"You're the best. Yes, you specifically. Now go clean something."</p>
			<p class="konami-hint">Enjoy the bubble explosion! 🫧</p>
		</div>
	{/if}

	<!-- Hero Section -->
	<header class="hero">
		<div class="hero-content">
			<h1 class="title">
				<span class="title-rachel">Rachel's</span>
				<span class="title-main">In & Out</span>
				<span class="title-sub">Car Wash</span>
			</h1>
			<p class="tagline">Quick cleaning with a gentle touch!</p>
			<p class="subtitle">Now offering household services too!</p>
			<div class="hero-bubbles">
				<span class="hero-bubble">🫧</span>
				<span class="hero-bubble delay-1">🫧</span>
				<span class="hero-bubble delay-2">🫧</span>
			</div>
		</div>
		<div class="wave">
			<svg viewBox="0 0 1440 120" preserveAspectRatio="none">
				<path d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z" fill={nightWashMode ? '#1a1a2e' : 'white'}/>
			</svg>
		</div>
	</header>

	<!-- Softness Meter Section -->
	<section class="softness-meter-section">
		<div class="container">
			<h2>Live Rachel Softness Meter 📊</h2>
			<div class="meter-container">
				<div class="meter">
					<div class="meter-fill" style="width: {softnessMeterValue}%"></div>
					<div class="meter-label">{softnessMeterValue}%</div>
				</div>
				{#if meterBroken}
					<p class="meter-broken">⚠️ METER OVERLOADED - Rachel is too soft! The gauge has broken... again.</p>
				{/if}
			</div>
			<p class="meter-disclaimer">*This meter has been replaced 47 times due to Rachel's excessive softness</p>
		</div>
	</section>

	<!-- About Rachel Section -->
	<section class="about">
		<div class="container">
			<h2>Why Rachel? 🧽</h2>
			<div class="about-content">
				<div class="about-card">
					<div class="about-icon">🧴</div>
					<h3>Soft as They Come</h3>
					<p>Rachel is famously <strong>very soft</strong> - which means your precious paintwork and delicate surfaces are in the gentlest of hands. No scratches, no harsh scrubbing, just pure softness!</p>
				</div>
				<div class="about-card">
					<div class="about-icon">💨</div>
					<h3>In & Out Speed</h3>
					<p>True to our name, we're quick! Rachel doesn't mess about (well, she does - that's her job - but she cleans it up fast!)</p>
				</div>
				<div class="about-card">
					<div class="about-icon">💖</div>
					<h3>Tender Loving Clean</h3>
					<p>Every car and home gets treated with the care and affection only Rachel can provide. It's not just cleaning - it's a spa day for your stuff!</p>
				</div>
			</div>
			<p class="soft-quote">"She's so soft, she once apologised to a sponge for squeezing it too hard." <span>- Satisfied Customer</span></p>
		</div>
	</section>

	<!-- Customer Reviews Carousel -->
	<section class="reviews">
		<div class="container">
			<h2>What Our Customers Say 💬</h2>
			<div class="reviews-carousel">
				<div class="review-card">
					<div class="review-stars">{'⭐'.repeat(reviews[currentReviewIndex].rating)}</div>
					<p class="review-text">"{reviews[currentReviewIndex].text}"</p>
					<p class="review-author">- {reviews[currentReviewIndex].name}</p>
				</div>
				<div class="review-dots">
					{#each reviews as _, i}
						<button
							class="review-dot"
							class:active={i === currentReviewIndex}
							on:click={() => currentReviewIndex = i}
							aria-label="Go to review {i + 1}"
						></button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Meet the Team Section -->
	<section class="team">
		<div class="container">
			<h2>Meet the Team 👥</h2>
			<p class="team-intro">Our diverse team of highly specialized professionals:</p>
			<div class="team-grid">
				{#each teamMembers as member}
					<div class="team-card">
						<div class="team-emoji">{member.emoji}</div>
						<h3>{member.role}</h3>
						<p class="team-name">{member.name}</p>
					</div>
				{/each}
			</div>
			<p class="team-note">*Yes, it's all Rachel. She's very versatile.</p>
		</div>
	</section>

	<!-- Seasonal Special -->
	<section class="seasonal">
		<div class="container">
			<h2>🌟 Seasonal Special 🌟</h2>
			<div class="seasonal-card">
				<div class="seasonal-icon">{seasonalSpecial.icon}</div>
				<h3>{seasonalSpecial.name}</h3>
				<div class="seasonal-price">{seasonalSpecial.price}</div>
				<p>{seasonalSpecial.description}</p>
				<button class="book-btn" on:click={() => showBookingForm = true}>Book This Special!</button>
			</div>
		</div>
	</section>

	<!-- Car Wash Services -->
	<section class="services car-services">
		<div class="container">
			<h2>Car Wash Services 🚗</h2>
			<p class="services-intro">Get your motor looking motor-vational!</p>
			<div class="services-grid">
				{#each carServices as service}
					<div
						class="service-card"
						class:selected={selectedService === service.name}
						on:click={() => selectService(service.name)}
						on:keypress={(e) => e.key === 'Enter' && selectService(service.name)}
						role="button"
						tabindex="0"
					>
						<div class="service-icon">{service.icon}</div>
						<h3>{service.name}</h3>
						<div class="service-price">{service.price}</div>
						<p>{service.description}</p>
						<p class="service-pun">"{service.pun}"</p>
						<button class="book-btn" on:click|stopPropagation={() => showBookingForm = true}>Book Now!</button>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Household Services -->
	<section class="services home-services">
		<div class="container">
			<h2>Household Services 🏠</h2>
			<p class="services-intro">Because cars aren't the only things that get dirty!</p>
			<p class="new-badge">✨ NEW! ✨</p>
			<div class="services-grid">
				{#each homeServices as service}
					<div
						class="service-card"
						class:selected={selectedService === service.name}
						on:click={() => selectService(service.name)}
						on:keypress={(e) => e.key === 'Enter' && selectService(service.name)}
						role="button"
						tabindex="0"
					>
						<div class="service-icon">{service.icon}</div>
						<h3>{service.name}</h3>
						<div class="service-price">{service.price}</div>
						<p>{service.description}</p>
						<p class="service-pun">"{service.pun}"</p>
						<button class="book-btn" on:click|stopPropagation={() => showBookingForm = true}>Book Now!</button>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Softness Calculator -->
	<section class="calculator">
		<div class="container">
			<h2>Softness Calculator 🧮</h2>
			<p class="calc-intro">How much softness does your car need?</p>
			<div class="calc-card">
				<label for="dirt-slider">Your Car's Dirt Level: {dirtLevel}%</label>
				<input
					type="range"
					id="dirt-slider"
					min="0"
					max="100"
					bind:value={dirtLevel}
					class="dirt-slider"
				/>
				<div class="dirt-labels">
					<span>Slightly Dusty</span>
					<span>Mud Monster</span>
				</div>
				<button class="calc-btn" on:click={calculateSoftness}>Calculate Softness Needs!</button>
				{#if softnessResult}
					<div class="calc-result">
						<pre>{softnessResult}</pre>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="faq">
		<div class="container">
			<h2>Frequently Asked Questions 🤔</h2>
			<div class="faq-list">
				{#each faqs as faq, i}
					<div class="faq-item" class:open={openFaqIndex === i}>
						<button class="faq-question" on:click={() => toggleFaq(i)}>
							<span>{faq.q}</span>
							<span class="faq-icon">{openFaqIndex === i ? '−' : '+'}</span>
						</button>
						{#if openFaqIndex === i}
							<div class="faq-answer">
								<p>{faq.a}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Fun Facts -->
	<section class="fun-facts">
		<div class="container">
			<h2>Fun Facts About Rachel 🫧</h2>
			<div class="facts-grid">
				<div class="fact-card">
					<span class="fact-number">100%</span>
					<span class="fact-text">Softness Rating</span>
				</div>
				<div class="fact-card">
					<span class="fact-number">0</span>
					<span class="fact-text">Scratches Ever</span>
				</div>
				<div class="fact-card">
					<span class="fact-number">∞</span>
					<span class="fact-text">Puns Per Wash</span>
				</div>
				<div class="fact-card">
					<span class="fact-number">99%</span>
					<span class="fact-text">Chance of Getting a Compliment</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Call to Action -->
	<section class="cta">
		<div class="container">
			<h2>Ready to Get Clean? 🛁</h2>
			<p>Don't be dirty - let Rachel sort you out!</p>
			<p class="cta-subtext">(That sounded better in our heads, but you get the idea)</p>
			<button class="cta-button" on:click={() => showBookingForm = true}>
				Book Rachel Now!
			</button>
			<p class="cta-disclaimer">*Rachel's softness is medically verified and may cause jealousy in other cleaning services</p>
		</div>
	</section>

	<!-- Achievement Badges Display -->
	<section class="achievements">
		<div class="container">
			<h2>Your Achievements 🏆</h2>
			<div class="achievements-grid">
				<div class="achievement-badge" class:unlocked={achievements.includes('scroll')}>
					<span class="badge-icon">🫧</span>
					<span class="badge-name">Bubble Enthusiast</span>
					{#if !achievements.includes('scroll')}
						<span class="badge-hint">Scroll to the bottom</span>
					{/if}
				</div>
				<div class="achievement-badge" class:unlocked={achievements.includes('konami')}>
					<span class="badge-icon">🎮</span>
					<span class="badge-name">Code Master</span>
					{#if !achievements.includes('konami')}
						<span class="badge-hint">Find the secret code</span>
					{/if}
				</div>
				<div class="achievement-badge" class:unlocked={achievements.includes('nightmode')}>
					<span class="badge-icon">🌙</span>
					<span class="badge-name">Night Owl</span>
					{#if !achievements.includes('nightmode')}
						<span class="badge-hint">Try the dark side</span>
					{/if}
				</div>
				<div class="achievement-badge" class:unlocked={achievements.includes('service')}>
					<span class="badge-icon">🛒</span>
					<span class="badge-name">Savvy Shopper</span>
					{#if !achievements.includes('service')}
						<span class="badge-hint">Select a service</span>
					{/if}
				</div>
				<div class="achievement-badge" class:unlocked={achievements.includes('booking')}>
					<span class="badge-icon">📝</span>
					<span class="badge-name">Eager Beaver</span>
					{#if !achievements.includes('booking')}
						<span class="badge-hint">Try to book Rachel</span>
					{/if}
				</div>
				<div class="achievement-badge" class:unlocked={achievements.includes('calculator')}>
					<span class="badge-icon">🔢</span>
					<span class="badge-name">Math Whiz</span>
					{#if !achievements.includes('calculator')}
						<span class="badge-hint">Use the calculator</span>
					{/if}
				</div>
				<div class="achievement-badge" class:unlocked={achievements.includes('faq')}>
					<span class="badge-icon">❓</span>
					<span class="badge-name">Curious Cat</span>
					{#if !achievements.includes('faq')}
						<span class="badge-hint">Explore the FAQs</span>
					{/if}
				</div>
			</div>
			<p class="achievements-count">Unlocked: {achievements.length} / 7</p>
		</div>
	</section>

	<!-- Footer -->
	<footer>
		<div class="container">
			<p>© 2026 Rachel's In & Out Car Wash</p>
			<p class="footer-pun">Making the world cleaner, one soft wipe at a time 🧽</p>
			<p class="footer-tagline">Remember: Life's too short for a dirty car (or a dusty house)!</p>
			<p class="konami-hint-footer">Psst... try the Konami code 🎮</p>
		</div>
	</footer>

	<!-- Booking Form Modal -->
	{#if showBookingForm}
		<div class="modal-overlay" on:click={() => showBookingForm = false} on:keypress={(e) => e.key === 'Escape' && (showBookingForm = false)} role="button" tabindex="0">
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
		<div class="modal" on:click|stopPropagation role="dialog" aria-modal="true">
				{#if !bookingSubmitted}
					<h2>Book Rachel 📅</h2>
					<p class="modal-subtitle">Fill out this form and Rachel will get back to you... probably!</p>
					<form on:submit|preventDefault={submitBooking}>
						<div class="form-group">
							<label for="name">Your Name</label>
							<input type="text" id="name" bind:value={bookingName} required placeholder="e.g., Dusty McDirtface" />
						</div>
						<div class="form-group">
							<label for="email">Your Email</label>
							<input type="email" id="email" bind:value={bookingEmail} required placeholder="e.g., dirty@needsclean.com" />
						</div>
						<button type="submit" class="submit-btn">Submit Booking Request</button>
					</form>
				{:else}
					<h2>Booking Status 📋</h2>
					<div class="excuse-container">
						<p class="sorry-text">We're so sorry, but...</p>
						<p class="excuse-text">{rachelExcuse}</p>
						<p class="try-again-text">Please try again later when Rachel has finished being... Rachel.</p>
					</div>
					<button class="try-again-btn" on:click={resetBooking}>Try Again (You Won't Succeed)</button>
				{/if}
				<button class="close-btn" on:click={() => { showBookingForm = false; resetBooking(); }}>×</button>
			</div>
		</div>
	{/if}

	<!-- Booking Message Toast -->
	{#if showBookingMessage}
		<div class="toast">
			<p>🫧 {selectedService} selected! Rachel's ready when you are! 🫧</p>
		</div>
	{/if}

	<!-- Achievement Unlock Toast -->
	{#if showAchievement}
		<div class="achievement-toast">
			<p>🏆 Achievement Unlocked!</p>
			<p class="achievement-name">{currentAchievement}</p>
		</div>
	{/if}
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Poppins', sans-serif;
		background: white;
		overflow-x: hidden;
	}

	.page {
		position: relative;
		transition: all 0.5s ease;
	}

	/* Night Wash Mode */
	.page.night-mode {
		background: #1a1a2e;
	}

	.page.night-mode .about,
	.page.night-mode .cta,
	.page.night-mode .team,
	.page.night-mode .reviews,
	.page.night-mode .calculator,
	.page.night-mode .faq,
	.page.night-mode .achievements,
	.page.night-mode .softness-meter-section {
		background: #1a1a2e;
	}

	.page.night-mode .about h2,
	.page.night-mode .cta h2,
	.page.night-mode .team h2,
	.page.night-mode .reviews h2,
	.page.night-mode .calculator h2,
	.page.night-mode .faq h2,
	.page.night-mode .achievements h2,
	.page.night-mode .softness-meter-section h2,
	.page.night-mode .seasonal h2 {
		color: #4fc3f7;
	}

	.page.night-mode .about-card,
	.page.night-mode .team-card,
	.page.night-mode .review-card,
	.page.night-mode .calc-card,
	.page.night-mode .faq-item,
	.page.night-mode .achievement-badge {
		background: #16213e;
		color: #e0e0e0;
	}

	.page.night-mode .about-card h3,
	.page.night-mode .team-card h3 {
		color: #4fc3f7;
	}

	.page.night-mode .about-card p,
	.page.night-mode .team-card p,
	.page.night-mode .review-text,
	.page.night-mode .faq-answer p,
	.page.night-mode .cta p,
	.page.night-mode .team-intro,
	.page.night-mode .calc-intro {
		color: #b0b0b0;
	}

	.page.night-mode .service-card {
		background: #16213e;
		color: #e0e0e0;
	}

	.page.night-mode .service-card h3 {
		color: #4fc3f7;
	}

	.page.night-mode .car-services {
		background: linear-gradient(180deg, #1a1a2e, #16213e);
	}

	.page.night-mode .home-services {
		background: linear-gradient(180deg, #16213e, #0f3460);
	}

	.page.night-mode .seasonal {
		background: linear-gradient(180deg, #1a1a2e, #16213e);
	}

	.page.night-mode .seasonal-card {
		background: #16213e;
		color: #e0e0e0;
	}

	.page.night-mode .bubble.glowing {
		background: linear-gradient(135deg, rgba(79, 195, 247, 0.6), rgba(255, 255, 255, 0.3));
		box-shadow: 0 0 20px rgba(79, 195, 247, 0.5),
					inset -5px -5px 10px rgba(255, 255, 255, 0.3),
					inset 5px 5px 10px rgba(79, 195, 247, 0.3);
	}

	.page.night-mode .soft-quote {
		background: #16213e;
		color: #b0b0b0;
		border-left-color: #4fc3f7;
	}

	.page.night-mode footer {
		background: #0f0f1a;
	}

	.night-mode-toggle {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 1000;
		background: rgba(255, 255, 255, 0.9);
		border: none;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		font-size: 1.5rem;
		cursor: pointer;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		transition: transform 0.3s ease;
	}

	.night-mode-toggle:hover {
		transform: scale(1.1);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	/* Floating Bubbles */
	.bubbles-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
		overflow: hidden;
	}

	.bubble {
		position: absolute;
		bottom: -100px;
		background: linear-gradient(135deg, rgba(135, 206, 250, 0.4), rgba(255, 255, 255, 0.6));
		border-radius: 50%;
		animation: float-up linear infinite;
		box-shadow: inset -5px -5px 10px rgba(255, 255, 255, 0.8),
					inset 5px 5px 10px rgba(135, 206, 250, 0.3);
	}

	@keyframes float-up {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: 0.6;
		}
		90% {
			opacity: 0.6;
		}
		100% {
			transform: translateY(-100vh) rotate(360deg);
			opacity: 0;
		}
	}

	/* Konami Message */
	.konami-message {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(135deg, #4fc3f7, #03a9f4);
		padding: 40px;
		border-radius: 20px;
		text-align: center;
		z-index: 2000;
		color: white;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		animation: pop-in 0.5s ease;
	}

	.konami-message h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: 2rem;
		margin-bottom: 15px;
	}

	.konami-message .secret-text {
		font-size: 1.3rem;
		font-style: italic;
		margin: 15px 0;
		padding: 15px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
	}

	.konami-hint {
		font-size: 1rem;
		opacity: 0.9;
	}

	@keyframes pop-in {
		from {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}

	/* Hero Section */
	.hero {
		background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #03a9f4 100%);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		padding: 20px;
	}

	.title {
		font-family: 'Fredoka', sans-serif;
		color: white;
		text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.title-rachel {
		display: block;
		font-size: clamp(2rem, 8vw, 4rem);
		font-weight: 500;
		letter-spacing: 2px;
	}

	.title-main {
		display: block;
		font-size: clamp(3rem, 12vw, 6rem);
		font-weight: 700;
		line-height: 1;
		animation: wobble 3s ease-in-out infinite;
	}

	.title-sub {
		display: block;
		font-size: clamp(2rem, 8vw, 4rem);
		font-weight: 500;
	}

	@keyframes wobble {
		0%, 100% { transform: rotate(-2deg); }
		50% { transform: rotate(2deg); }
	}

	.tagline {
		font-size: clamp(1.2rem, 4vw, 2rem);
		color: white;
		margin-top: 20px;
		font-weight: 500;
	}

	.subtitle {
		font-size: clamp(1rem, 3vw, 1.5rem);
		color: rgba(255, 255, 255, 0.9);
		margin-top: 10px;
		background: rgba(255, 255, 255, 0.2);
		padding: 10px 20px;
		border-radius: 50px;
		display: inline-block;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	.hero-bubbles {
		margin-top: 30px;
		font-size: 3rem;
	}

	.hero-bubble {
		display: inline-block;
		animation: bounce 2s ease-in-out infinite;
	}

	.hero-bubble.delay-1 {
		animation-delay: 0.3s;
	}

	.hero-bubble.delay-2 {
		animation-delay: 0.6s;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-20px); }
	}

	.wave {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.wave svg {
		display: block;
		width: 100%;
		height: auto;
	}

	/* Softness Meter Section */
	.softness-meter-section {
		padding: 60px 0;
		background: white;
		position: relative;
		z-index: 1;
	}

	.softness-meter-section h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(1.8rem, 5vw, 2.5rem);
		text-align: center;
		color: #0288d1;
		margin-bottom: 30px;
	}

	.meter-container {
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
	}

	.meter {
		background: #e0e0e0;
		border-radius: 50px;
		height: 40px;
		position: relative;
		overflow: hidden;
	}

	.meter-fill {
		background: linear-gradient(90deg, #81d4fa, #4fc3f7, #29b6f6, #03a9f4);
		height: 100%;
		border-radius: 50px;
		transition: width 0.1s ease;
		animation: pulse-meter 1s ease-in-out infinite;
	}

	@keyframes pulse-meter {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.8; }
	}

	.meter-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: 'Fredoka', sans-serif;
		font-size: 1.2rem;
		font-weight: 700;
		color: #01579b;
	}

	.meter-broken {
		margin-top: 15px;
		color: #e91e63;
		font-weight: 600;
		animation: shake 0.5s ease-in-out infinite;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-5px); }
		75% { transform: translateX(5px); }
	}

	.meter-disclaimer {
		margin-top: 15px;
		font-size: 0.85rem;
		color: #90a4ae;
		font-style: italic;
	}

	/* About Section */
	.about {
		padding: 80px 0;
		background: white;
		position: relative;
		z-index: 1;
	}

	.about h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: #0288d1;
		margin-bottom: 40px;
	}

	.about-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 30px;
		margin-bottom: 40px;
	}

	.about-card {
		background: linear-gradient(135deg, #e3f2fd, #bbdefb);
		padding: 30px;
		border-radius: 20px;
		text-align: center;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.about-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 20px 40px rgba(3, 169, 244, 0.2);
	}

	.about-icon {
		font-size: 3rem;
		margin-bottom: 15px;
	}

	.about-card h3 {
		font-family: 'Fredoka', sans-serif;
		color: #0277bd;
		margin-bottom: 10px;
		font-size: 1.4rem;
	}

	.about-card p {
		color: #37474f;
		line-height: 1.6;
	}

	.soft-quote {
		text-align: center;
		font-style: italic;
		color: #546e7a;
		font-size: 1.1rem;
		background: #f5f5f5;
		padding: 20px;
		border-radius: 10px;
		border-left: 4px solid #4fc3f7;
	}

	.soft-quote span {
		display: block;
		margin-top: 10px;
		font-style: normal;
		font-weight: 600;
		color: #0288d1;
	}

	/* Reviews Carousel */
	.reviews {
		padding: 80px 0;
		background: white;
		position: relative;
		z-index: 1;
	}

	.reviews h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: #0288d1;
		margin-bottom: 40px;
	}

	.reviews-carousel {
		max-width: 700px;
		margin: 0 auto;
		text-align: center;
	}

	.review-card {
		background: linear-gradient(135deg, #e3f2fd, #bbdefb);
		padding: 40px;
		border-radius: 20px;
		min-height: 200px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		animation: fade-in 0.5s ease;
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.review-stars {
		font-size: 1.5rem;
		margin-bottom: 15px;
	}

	.review-text {
		font-size: 1.2rem;
		color: #37474f;
		font-style: italic;
		margin-bottom: 20px;
		line-height: 1.6;
	}

	.review-author {
		font-weight: 600;
		color: #0277bd;
		font-size: 1.1rem;
	}

	.review-dots {
		margin-top: 20px;
		display: flex;
		justify-content: center;
		gap: 10px;
	}

	.review-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #b0bec5;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.review-dot.active {
		background: #03a9f4;
		transform: scale(1.3);
	}

	/* Team Section */
	.team {
		padding: 80px 0;
		background: white;
		position: relative;
		z-index: 1;
	}

	.team h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: #0288d1;
		margin-bottom: 15px;
	}

	.team-intro {
		text-align: center;
		color: #546e7a;
		font-size: 1.1rem;
		margin-bottom: 40px;
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
	}

	.team-card {
		background: linear-gradient(135deg, #e3f2fd, #bbdefb);
		padding: 25px;
		border-radius: 20px;
		text-align: center;
		transition: transform 0.3s ease;
	}

	.team-card:hover {
		transform: translateY(-5px) rotate(2deg);
	}

	.team-emoji {
		font-size: 3rem;
		margin-bottom: 10px;
	}

	.team-card h3 {
		font-family: 'Fredoka', sans-serif;
		color: #0277bd;
		font-size: 1rem;
		margin-bottom: 5px;
	}

	.team-name {
		color: #546e7a;
		font-weight: 600;
	}

	.team-note {
		text-align: center;
		font-style: italic;
		color: #90a4ae;
	}

	/* Seasonal Special */
	.seasonal {
		padding: 80px 0;
		background: linear-gradient(135deg, #fff9c4, #fff59d);
		position: relative;
		z-index: 1;
	}

	.seasonal h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: #f57c00;
		margin-bottom: 40px;
	}

	.seasonal-card {
		max-width: 500px;
		margin: 0 auto;
		background: white;
		padding: 40px;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
	}

	.seasonal-icon {
		font-size: 4rem;
		margin-bottom: 15px;
	}

	.seasonal-card h3 {
		font-family: 'Fredoka', sans-serif;
		color: #f57c00;
		font-size: 1.8rem;
		margin-bottom: 10px;
	}

	.seasonal-price {
		font-family: 'Fredoka', sans-serif;
		font-size: 2.5rem;
		color: #ff9800;
		font-weight: 700;
		margin-bottom: 15px;
	}

	.seasonal-card p {
		color: #546e7a;
		line-height: 1.6;
		margin-bottom: 20px;
	}

	/* Services Sections */
	.services {
		padding: 80px 0;
		position: relative;
		z-index: 1;
	}

	.car-services {
		background: linear-gradient(180deg, white, #e1f5fe);
	}

	.home-services {
		background: linear-gradient(180deg, #e1f5fe, #b3e5fc);
	}

	.services h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: #0288d1;
		margin-bottom: 10px;
	}

	.services-intro {
		text-align: center;
		color: #546e7a;
		font-size: 1.2rem;
		margin-bottom: 20px;
	}

	.new-badge {
		text-align: center;
		font-size: 1.5rem;
		animation: sparkle 1s ease-in-out infinite;
	}

	@keyframes sparkle {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.7; transform: scale(1.1); }
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 30px;
		margin-top: 40px;
	}

	.service-card {
		background: white;
		padding: 30px;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		cursor: pointer;
		border: 3px solid transparent;
	}

	.service-card:hover {
		transform: translateY(-10px) scale(1.02);
		box-shadow: 0 20px 50px rgba(3, 169, 244, 0.3);
		border-color: #4fc3f7;
	}

	.service-card.selected {
		border-color: #4fc3f7;
		background: linear-gradient(135deg, #e3f2fd, white);
	}

	.service-icon {
		font-size: 4rem;
		margin-bottom: 15px;
	}

	.service-card h3 {
		font-family: 'Fredoka', sans-serif;
		color: #0277bd;
		font-size: 1.5rem;
		margin-bottom: 10px;
	}

	.service-price {
		font-family: 'Fredoka', sans-serif;
		font-size: 2.5rem;
		color: #00acc1;
		font-weight: 700;
		margin-bottom: 15px;
	}

	.service-card p {
		color: #546e7a;
		line-height: 1.6;
		margin-bottom: 10px;
	}

	.service-pun {
		font-style: italic;
		color: #0288d1;
		font-weight: 500;
		font-size: 0.95rem;
	}

	.book-btn {
		background: linear-gradient(135deg, #4fc3f7, #03a9f4);
		color: white;
		border: none;
		padding: 12px 30px;
		border-radius: 50px;
		font-family: 'Fredoka', sans-serif;
		font-size: 1.1rem;
		cursor: pointer;
		margin-top: 15px;
		transition: all 0.3s ease;
	}

	.book-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 5px 20px rgba(3, 169, 244, 0.4);
	}

	/* Softness Calculator */
	.calculator {
		padding: 80px 0;
		background: linear-gradient(180deg, #b3e5fc, #81d4fa);
		position: relative;
		z-index: 1;
	}

	.calculator h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: #01579b;
		margin-bottom: 15px;
	}

	.calc-intro {
		text-align: center;
		color: #0277bd;
		font-size: 1.1rem;
		margin-bottom: 40px;
	}

	.calc-card {
		max-width: 500px;
		margin: 0 auto;
		background: white;
		padding: 40px;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
	}

	.calc-card label {
		display: block;
		font-family: 'Fredoka', sans-serif;
		font-size: 1.3rem;
		color: #0277bd;
		margin-bottom: 20px;
	}

	.dirt-slider {
		width: 100%;
		height: 20px;
		-webkit-appearance: none;
		appearance: none;
		background: linear-gradient(90deg, #c8e6c9, #fff59d, #ffcc80, #ef9a9a, #8d6e63);
		border-radius: 10px;
		outline: none;
		margin-bottom: 10px;
	}

	.dirt-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 30px;
		height: 30px;
		background: #03a9f4;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	}

	.dirt-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		color: #90a4ae;
		margin-bottom: 25px;
	}

	.calc-btn {
		background: linear-gradient(135deg, #4fc3f7, #03a9f4);
		color: white;
		border: none;
		padding: 15px 40px;
		border-radius: 50px;
		font-family: 'Fredoka', sans-serif;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.calc-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 5px 20px rgba(3, 169, 244, 0.4);
	}

	.calc-result {
		margin-top: 25px;
		text-align: left;
		background: #e3f2fd;
		padding: 20px;
		border-radius: 10px;
	}

	.calc-result pre {
		font-family: 'Poppins', sans-serif;
		white-space: pre-wrap;
		color: #0277bd;
		line-height: 1.8;
	}

	/* FAQ Section */
	.faq {
		padding: 80px 0;
		background: white;
		position: relative;
		z-index: 1;
	}

	.faq h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: #0288d1;
		margin-bottom: 40px;
	}

	.faq-list {
		max-width: 700px;
		margin: 0 auto;
	}

	.faq-item {
		background: #f5f5f5;
		border-radius: 15px;
		margin-bottom: 15px;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.faq-item.open {
		background: linear-gradient(135deg, #e3f2fd, #bbdefb);
	}

	.faq-question {
		width: 100%;
		padding: 20px 25px;
		background: none;
		border: none;
		text-align: left;
		font-size: 1.1rem;
		font-weight: 600;
		color: #0277bd;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: 'Poppins', sans-serif;
	}

	.faq-icon {
		font-size: 1.5rem;
		font-weight: 700;
		color: #03a9f4;
	}

	.faq-answer {
		padding: 0 25px 20px;
		animation: slide-down 0.3s ease;
	}

	@keyframes slide-down {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.faq-answer p {
		color: #546e7a;
		line-height: 1.6;
	}

	/* Fun Facts */
	.fun-facts {
		padding: 80px 0;
		background: linear-gradient(135deg, #0288d1, #0277bd);
		position: relative;
		z-index: 1;
	}

	.fun-facts h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: white;
		margin-bottom: 40px;
	}

	.facts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 30px;
	}

	.fact-card {
		background: rgba(255, 255, 255, 0.15);
		padding: 30px;
		border-radius: 20px;
		text-align: center;
		backdrop-filter: blur(10px);
		transition: transform 0.3s ease;
	}

	.fact-card:hover {
		transform: scale(1.05);
	}

	.fact-number {
		display: block;
		font-family: 'Fredoka', sans-serif;
		font-size: 3rem;
		color: white;
		font-weight: 700;
	}

	.fact-text {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1.1rem;
	}

	/* CTA Section */
	.cta {
		padding: 80px 0;
		background: white;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.cta h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		color: #0288d1;
		margin-bottom: 20px;
	}

	.cta p {
		color: #546e7a;
		font-size: 1.3rem;
		margin-bottom: 10px;
	}

	.cta-subtext {
		font-size: 1rem !important;
		font-style: italic;
		color: #90a4ae !important;
	}

	.cta-button {
		display: inline-block;
		background: linear-gradient(135deg, #4fc3f7, #03a9f4);
		color: white;
		text-decoration: none;
		padding: 20px 50px;
		border-radius: 50px;
		font-family: 'Fredoka', sans-serif;
		font-size: 1.5rem;
		margin: 30px 0;
		transition: all 0.3s ease;
		box-shadow: 0 10px 30px rgba(3, 169, 244, 0.3);
		border: none;
		cursor: pointer;
	}

	.cta-button:hover {
		transform: translateY(-5px) scale(1.05);
		box-shadow: 0 20px 50px rgba(3, 169, 244, 0.4);
	}

	.cta-disclaimer {
		font-size: 0.85rem !important;
		color: #b0bec5 !important;
		font-style: italic;
	}

	/* Achievements Section */
	.achievements {
		padding: 80px 0;
		background: linear-gradient(180deg, white, #e8f5e9);
		position: relative;
		z-index: 1;
	}

	.achievements h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(2rem, 6vw, 3rem);
		text-align: center;
		color: #2e7d32;
		margin-bottom: 40px;
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 20px;
		max-width: 900px;
		margin: 0 auto 30px;
	}

	.achievement-badge {
		background: #e0e0e0;
		padding: 25px 15px;
		border-radius: 15px;
		text-align: center;
		transition: all 0.3s ease;
		position: relative;
	}

	.achievement-badge.unlocked {
		background: linear-gradient(135deg, #c8e6c9, #a5d6a7);
		box-shadow: 0 5px 20px rgba(76, 175, 80, 0.3);
	}

	.achievement-badge:not(.unlocked) {
		opacity: 0.6;
	}

	.badge-icon {
		display: block;
		font-size: 2.5rem;
		margin-bottom: 10px;
		filter: grayscale(100%);
	}

	.achievement-badge.unlocked .badge-icon {
		filter: none;
		animation: badge-pop 0.5s ease;
	}

	@keyframes badge-pop {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.3); }
	}

	.badge-name {
		display: block;
		font-weight: 600;
		color: #37474f;
		font-size: 0.9rem;
	}

	.badge-hint {
		display: block;
		font-size: 0.75rem;
		color: #90a4ae;
		margin-top: 5px;
		font-style: italic;
	}

	.achievements-count {
		text-align: center;
		font-family: 'Fredoka', sans-serif;
		font-size: 1.3rem;
		color: #2e7d32;
	}

	/* Footer */
	footer {
		background: #01579b;
		padding: 40px 0;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	footer p {
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 10px;
	}

	.footer-pun {
		font-size: 1.1rem;
		color: white !important;
	}

	.footer-tagline {
		font-style: italic;
		font-size: 0.9rem;
	}

	.konami-hint-footer {
		font-size: 0.8rem;
		opacity: 0.5;
		margin-top: 20px;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000;
		animation: fade-in 0.3s ease;
	}

	.modal {
		background: white;
		padding: 40px;
		border-radius: 20px;
		max-width: 500px;
		width: 90%;
		position: relative;
		animation: pop-in 0.3s ease;
	}

	.modal h2 {
		font-family: 'Fredoka', sans-serif;
		color: #0288d1;
		margin-bottom: 10px;
		text-align: center;
	}

	.modal-subtitle {
		text-align: center;
		color: #90a4ae;
		margin-bottom: 30px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-group label {
		display: block;
		font-weight: 600;
		color: #0277bd;
		margin-bottom: 8px;
	}

	.form-group input {
		width: 100%;
		padding: 15px;
		border: 2px solid #e0e0e0;
		border-radius: 10px;
		font-size: 1rem;
		font-family: 'Poppins', sans-serif;
		transition: border-color 0.3s ease;
	}

	.form-group input:focus {
		outline: none;
		border-color: #4fc3f7;
	}

	.submit-btn {
		width: 100%;
		background: linear-gradient(135deg, #4fc3f7, #03a9f4);
		color: white;
		border: none;
		padding: 15px;
		border-radius: 50px;
		font-family: 'Fredoka', sans-serif;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.submit-btn:hover {
		transform: scale(1.02);
		box-shadow: 0 5px 20px rgba(3, 169, 244, 0.4);
	}

	.close-btn {
		position: absolute;
		top: 15px;
		right: 20px;
		background: none;
		border: none;
		font-size: 2rem;
		color: #90a4ae;
		cursor: pointer;
		transition: color 0.3s ease;
	}

	.close-btn:hover {
		color: #e91e63;
	}

	.excuse-container {
		text-align: center;
		padding: 20px 0;
	}

	.sorry-text {
		color: #e91e63;
		font-weight: 600;
		font-size: 1.1rem;
		margin-bottom: 15px;
	}

	.excuse-text {
		font-size: 1.2rem;
		color: #0277bd;
		font-style: italic;
		line-height: 1.6;
		padding: 20px;
		background: #e3f2fd;
		border-radius: 10px;
		margin-bottom: 20px;
	}

	.try-again-text {
		color: #90a4ae;
		font-size: 0.95rem;
	}

	.try-again-btn {
		margin-top: 20px;
		background: linear-gradient(135deg, #90a4ae, #78909c);
		color: white;
		border: none;
		padding: 12px 30px;
		border-radius: 50px;
		font-family: 'Fredoka', sans-serif;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.try-again-btn:hover {
		transform: scale(1.05);
	}

	/* Toast Notification */
	.toast {
		position: fixed;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		background: linear-gradient(135deg, #4fc3f7, #03a9f4);
		color: white;
		padding: 20px 40px;
		border-radius: 50px;
		font-family: 'Fredoka', sans-serif;
		font-size: 1.2rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		z-index: 1000;
		animation: toast-in 0.5s ease;
	}

	.achievement-toast {
		position: fixed;
		top: 80px;
		right: 20px;
		background: linear-gradient(135deg, #66bb6a, #43a047);
		color: white;
		padding: 20px 30px;
		border-radius: 15px;
		font-family: 'Fredoka', sans-serif;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		z-index: 1000;
		animation: slide-in-right 0.5s ease;
	}

	.achievement-toast p:first-child {
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.achievement-name {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 5px;
	}

	@keyframes slide-in-right {
		from {
			opacity: 0;
			transform: translateX(100px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(50px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	/* Responsive */
	@media (max-width: 768px) {
		.hero {
			min-height: 80vh;
		}

		.about-content,
		.services-grid,
		.facts-grid,
		.team-grid,
		.achievements-grid {
			grid-template-columns: 1fr;
		}

		.service-card {
			margin: 0 10px;
		}

		.night-mode-toggle {
			top: 10px;
			right: 10px;
			width: 40px;
			height: 40px;
			font-size: 1.2rem;
		}

		.konami-message {
			width: 90%;
			padding: 25px;
		}

		.modal {
			padding: 25px;
		}
	}
</style>
