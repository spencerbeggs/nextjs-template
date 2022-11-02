type Props = { children: React.ReactNode };

export const Page: React.FC<Props> = ({ children }) => (
	<section className="container flex flex-col px-0 md:mx-auto lg:px-20">
		<div className="flex flex-col sm:container">{children}</div>
	</section>
);
