import { useEffect, useContext } from "react";
import { TopNavContext } from "@contexts/nav.context";
import styles from "./content.module.scss";

interface ContentProps {
	section: string;
	title: string;
}

export const Content: React.FC<ContentProps> = ({ section, title }) => {
	const { update } = useContext(TopNavContext);

	useEffect(() => {
		update({ section, title });
	}, [section, title, update]);

	return (
		<section className={styles.content}>
			<h1 className={styles.contentTitle}>{title}</h1>
		</section>
	);
};

interface SectionContentProps extends Omit<ContentProps, "section"> {}

export const HompageContent = (props: SectionContentProps) => <Content section="Homepage" {...props} />;

export const LearnContent = (props: SectionContentProps) => <Content section="Learn" {...props} />;

export const PriceContent = (props: SectionContentProps) => <Content section="Price" {...props} />;

export const NewsletterContent = (props: SectionContentProps) => <Content section="Newsletter" {...props} />;

export const AboutUsContent = (props: SectionContentProps) => <Content section="About Us" {...props} />;

export const ArticleContent = (props: SectionContentProps) => <Content section="Article" {...props} />;

export const TypographyExplorationContent = (props: SectionContentProps) => (
	<Content section="Typography Exploration" {...props} />
);

export const PodcastContent = (props: SectionContentProps) => <Content section="Podcast" {...props} />;
