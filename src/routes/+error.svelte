<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-page">
	<div class="error-content">
		<div class="error-icon">🫧</div>
		<h1>4😢4</h1>
		<h2>Page Not Found</h2>
		<p class="error-message">Rachel looked everywhere but couldn't find this page.</p>
		<p class="apology">She's very sorry. Like, really sorry. She's already written an apology letter to the URL.</p>

		<div class="rachel-quotes">
			<p class="quote">"I checked under the soap bubbles..."</p>
			<p class="quote">"I looked behind the squeegees..."</p>
			<p class="quote">"I even asked the sponges..."</p>
			<p class="quote">"Nothing. It's gone. Like dirt after I'm done with it."</p>
		</div>

		<a href="/" class="home-btn">🏠 Take Me Home (Rachel Will Clean Up This Mess)</a>

		<p class="error-code">Error {$page.status}: {$page.error?.message || 'Lost in the suds'}</p>
	</div>

	<div class="floating-elements">
		<span class="float-item">🧽</span>
		<span class="float-item delay-1">🫧</span>
		<span class="float-item delay-2">🧴</span>
		<span class="float-item delay-3">💧</span>
		<span class="float-item delay-4">🪣</span>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #03a9f4 100%);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
		position: relative;
		overflow: hidden;
	}

	.error-content {
		text-align: center;
		color: white;
		max-width: 600px;
		z-index: 1;
	}

	.error-icon {
		font-size: 5rem;
		animation: bounce 2s ease-in-out infinite;
	}

	h1 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(4rem, 15vw, 8rem);
		margin: 20px 0;
		text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
	}

	h2 {
		font-family: 'Fredoka', sans-serif;
		font-size: clamp(1.5rem, 5vw, 2.5rem);
		margin-bottom: 20px;
		opacity: 0.95;
	}

	.error-message {
		font-size: 1.3rem;
		margin-bottom: 10px;
	}

	.apology {
		font-size: 1rem;
		opacity: 0.9;
		font-style: italic;
		margin-bottom: 30px;
	}

	.rachel-quotes {
		background: rgba(255, 255, 255, 0.15);
		padding: 25px;
		border-radius: 15px;
		margin: 30px 0;
		backdrop-filter: blur(10px);
	}

	.quote {
		font-style: italic;
		margin: 10px 0;
		opacity: 0.9;
	}

	.quote:last-child {
		font-weight: 600;
		opacity: 1;
	}

	.home-btn {
		display: inline-block;
		background: white;
		color: #0288d1;
		text-decoration: none;
		padding: 18px 40px;
		border-radius: 50px;
		font-family: 'Fredoka', sans-serif;
		font-size: 1.2rem;
		margin: 20px 0;
		transition: all 0.3s ease;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}

	.home-btn:hover {
		transform: translateY(-5px) scale(1.05);
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
	}

	.error-code {
		margin-top: 30px;
		font-size: 0.85rem;
		opacity: 0.6;
	}

	.floating-elements {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;
	}

	.float-item {
		position: absolute;
		font-size: 3rem;
		animation: float 6s ease-in-out infinite;
	}

	.float-item:nth-child(1) { top: 10%; left: 10%; }
	.float-item:nth-child(2) { top: 20%; right: 15%; }
	.float-item:nth-child(3) { bottom: 30%; left: 5%; }
	.float-item:nth-child(4) { bottom: 15%; right: 10%; }
	.float-item:nth-child(5) { top: 50%; left: 50%; }

	.delay-1 { animation-delay: 1s; }
	.delay-2 { animation-delay: 2s; }
	.delay-3 { animation-delay: 3s; }
	.delay-4 { animation-delay: 4s; }

	@keyframes float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-30px) rotate(10deg); }
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-20px); }
	}
</style>
