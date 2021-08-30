<?php include('./includes/head.html'); ?>

<!-- page container -->
	<div class="relative py-16 overflow-hidden">
		
		<!-- post decorators -->
		<div class="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
			<div class="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
				<svg class="absolute top-12 left-full transform translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
					<defs>
					<pattern id="74b3fd99-0a6f-4271-bef2-e80eeafdf357" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
					<rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
					</pattern>
					</defs>
					<rect width="404" height="384" fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
				</svg>
				<svg class="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
					<defs>
					<pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
					<rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
					</pattern>
					</defs>
					<rect width="404" height="384" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
				</svg>
				<svg class="absolute bottom-12 left-full transform translate-x-32" width="404" height="384" fill="none" viewBox="0 0 404 384">
					<defs>
					<pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
					<rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
					</pattern>
					</defs>
					<rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
				</svg>
			</div>
		</div>
		<!-- END post decorators -->
		
		<!-- post container -->
		<div class="relative px-4 sm:px-6 lg:px-8">
			
			<!-- post header -->
			<div class="text-lg max-w-prose mx-auto">
				<h1>
					<span class="block text-base text-center font-semibold tracking-wide uppercase">Formatting</span>
					<span class="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight sm:text-4xl">Ghost-Specific Content</span>
				</h1>
				<p class="mt-8 text-xl leading-8">A formatting guide to display how standard elements from the Ghost editor will appear within the context of this theme.</p>
			</div>
			<!-- END post header -->
	
			<!-- post body -->
			<article class="mt-6 prose prose-lg mx-auto">
				<h2><code>figure</code> and <code>figcaption</code></h2>

				<figure class="kg-image-card">
					<img class="kg-image" src="https://casper.ghost.org/v1.25.0/images/koenig-demo-1.jpg" width="1600" height="2400" >
					<figcaption>An example image</figcaption>
				</figure>
				
				<h2>Gallery card</h2>

				<figure class="kg-card kg-gallery-card kg-width-wide">
					<div class="kg-gallery-container">
						<div class="kg-gallery-row">
							<div class="kg-gallery-image">
								<img src="/assets/images/pexels.jpg" width="6720" height="4480" >
							</div>
							<div class="kg-gallery-image">
								<img src="/assets/images/pexels.jpg" width="4946" height="3220" >
							</div>
							<div class="kg-gallery-image">
								<img src="/assets/images/pexels.jpg" width="5560" height="3492" >
							</div>
						</div>
						<div class="kg-gallery-row">
							<div class="kg-gallery-image">
								<img src="/assets/images/pexels.jpg" width="3654" height="5473" >
							</div>
							<div class="kg-gallery-image">
								<img src="/assets/images/pexels.jpg" width="4160" height="6240" >
							</div>
							<div class="kg-gallery-image">
								<img src="/assets/images/pexels.jpg" width="2645" height="3967" >
							</div>
						</div>
						<div class="kg-gallery-row">
							<div class="kg-gallery-image">
								<img src="/assets/images/pexels.jpg" width="3840" height="5760" >
							</div>
							<div class="kg-gallery-image">
								<img src="/assets/images/pexels.jpg" width="3456" height="5184" >
							</div>
						</div>
					</div>
				</figure>
				
				<h2>Bookmark card</h2>

				<figure class="kg-card kg-bookmark-card">
					<a href="/" class="kg-bookmark-container">
						<div class="kg-bookmark-content">
							<div class="kg-bookmark-title">The bookmark card</div>
							<div class="kg-bookmark-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at interdum ipsum.</div>
							<div class="kg-bookmark-metadata">
								<img src="/assets/images/author-icon.jpg" class="kg-bookmark-icon">
								<span class="kg-bookmark-author">David Darnes</span>
								<span class="kg-bookmark-publisher">Ghost</span>
							</div>
						</div>
						<div class="kg-bookmark-thumbnail">
							<img src="/assets/images/pexels.jpg">
						</div>
					</a>
				</figure>
				
				<h2>Embed card</h2>

				<figure class="kg-card kg-embed-card fluid-width-video-wrapper">
					<iframe src="https://player.vimeo.com/video/288344114?app_id=122963&amp;h=63fff44243" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Vimeo Stock">				<!-- <iframe> represents card content -->
				</figure>
			</article>
			<!-- END post body -->
		</div>
		<!-- END post container -->
	</div>
<!-- END page container -->
	
	
<?php include('./includes/footer.html'); ?>