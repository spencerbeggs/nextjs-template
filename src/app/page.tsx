import React from "react";

export default function Home() {
	return (
		<article className="prose prose-zinc mx-auto mt-8 px-4 sm:px-0 sm:indent-0 lg:prose-base">
			<h1>Steal This Template...</h1>
			<p className="prose-xl text-center">
				⚡ <a href="https://nextjs.org/">Next.js 12</a> ⚡ <a href="https://tailwindcss.com/">Tailwind CSS</a> ⚡{" "}
				<a href="https://www.typescriptlang.org/">TypeScript</a> ⚡ <a href="https://redux.js.org/">Redux</a> ⚡
				Local SSL ⚡ Vercel ⚡
			</p>
			<p>This repo is a GitHub template that can be used to deploy a barebones webapp with in minutes.</p>
			<h2>Features</h2>
			<ul className="sm:columns-2">
				<li>Next.js 12 with Server-Side Modules</li>
				<li>Tailwind with all the plugins</li>
				<li>Local SSL server</li>
				<li>VSCode intergration</li>
				<li>Figma project export graphics</li>
				<li>Adaptive SSR rendering</li>
				<li>Deploy to Vercel in minutes</li>
				<li>Bootstrap script</li>
			</ul>
		</article>
	);
}
