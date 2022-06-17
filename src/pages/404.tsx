import { ShellLayout } from "@components/layouts/shell.layout";

export default function Custom404() {
	return (
		<ShellLayout>
			<h1>404 - Page Not Found</h1>
		</ShellLayout>
	);
}

Custom404.getLayouut = ShellLayout.single;